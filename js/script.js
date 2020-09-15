var pokemonRepository =(function($) {
  var pokemonList = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  
  function getAll(){
    return pokemonList;
  }

  function add(pokemon){
    pokemonList.push(pokemon);
  }

  function addListItem(pokemon){
    var $unorderedList = $(".pokemonsList");
    var $listItem = $("<li></li>");
    var $button = $('<button type="button" class="btn btn-primary button" data-toggle="modal" data-target="#exampleModal"></button>');
    $button.text(pokemon.name);
    $listItem.append($button);
    $unorderedList.append($listItem);
    $button.on("click", function(){
      showDetails(pokemon);
    });
  }

  function loadList() {
    return $.ajax(apiUrl, {
      dataType: 'json',
    }).then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item,
          };
          add(pokemon);
        });
      }).catch(function (e) {
        console.error(e)
      })
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon);
    });
  }

  function loadDetails(pokemon) {
    var url = pokemon.detailsUrl;
    return $.ajax(url, { dataType: 'json' }).then(function (details) {
      pokemon.imageUrl = details.sprites.front_default;
      pokemon.height = details.height;
      pokemon.weight = details.weight;
      pokemon.type = details.types[0].type.name;
  }).catch(function (e) {
    console.error(e);
  });
  }

  function showModal(pokemon){ 
    var $modalContent = $(".modal-content");  
    var $modalBody = $(".modal-body");
    var $modalTitle = $(".modal-title");
    var $modalHeader = $(".modal-header");
    var $pokeNames = $("<h1>" + pokemon.name + "</h1>");
    var $pokenamesImg = $('<img clas="modal-img" style="width:50%">');
    $pokenamesImg.attr("src", pokemon.imageUrl);
    var $pokeHeight = $("<p>" + "height : " + pokemon.height + " M." + "</p>");
    var $pokeWeight = $("<p>" + "weight : " + pokemon.weight + " Kg." + "</p>");
    var $pokeTypes = $("<p>" + "type : " + pokemon.type + "</p>");
    $modalBody.empty();
    $modalTitle.empty();
    $modalContent.css({
                      "background-color": "#B9ECF3",
                      "text-align": "center"
                    });
    $modalTitle.append($pokeNames.css({
                                        "text-transform":"capitalize", 
                                        "background-color": "#10013A",
                                        "color": "#FFCB05",
                                        "padding": "10px 20px 10px 10px"
                                      }));
    $modalBody.append($pokenamesImg.css({
                                        "border": "3px solid rgba(100,80,2,0.8)",
                                        "border-radius": "8px",
                                        "margin-bottom": "10px",
                                        "text-align": "center",
                                        "background-color": "rgba(100,80,2,0.3)"
                                      }));
    $modalBody.append($pokeHeight.css({
                                        "text-transform":"capitalize", 
                                        "background-color": "#10013A",
                                        "color": "#FFCB05",
                                        "padding": "10px"
                                      }));
    $modalBody.append($pokeWeight.css({
                                        "text-transform":"capitalize", 
                                        "background-color": "#10013A",
                                        "color": "#FFCB05",
                                        "padding": "10px"
                                      }));
    $modalBody.append($pokeTypes.css({
                                        "text-transform":"capitalize", 
                                        "background-color": "#10013A",
                                        "color": "#FFCB05",
                                        "padding": "10px"
                                      }));
  }

  function hideModal(event){
    $(event.target).parent().removeClass("modalContainer__isVisible");
    $(event.target).parent().addClass("modalContainer__isHidden");
    var $unorderedList = $(".pokemonsList");
    var $modalContainer = $("#modalContainer");
    $modalContainer.html("");
    $unorderedList.css("style", "none");
  }

  $(window).on("keydown", function(event){
    var $modalContainer = $("#modalContainer");
    var $unorderedList = $(".pokemonsList");
    if(event.keyCode === 27 && $modalContainer.hasClass("modalContainer__isVisible")){
      $modalContainer.removeClass("modalContainer__isVisible");
      $modalContainer.addClass("modalContainer__isHidden");
      $modalContainer.html("");
    } 
    $unorderedList.css("filter", "none");
  })

  $(window).click(function(event){
    var $modalContainer = $("#modalContainer");
    var $unorderedList = $(".pokemonsList");
    if(!$(event.target).hasClass("modalContainer__isVisible")){
      $modalContainer.removeClass("modalContainer__isVisible");
      $modalContainer.addClass("modalContainer__isHidden");
      $unorderedList.css("filter", "none");
      $modalContainer.html("");
    }
  })

  return {
    getAll,
    add,
    addListItem,
    loadList,
    loadDetails,
    showDetails,
    showModal,
    hideModal
  };
})(jQuery);

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});


