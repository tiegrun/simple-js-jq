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
    var $button = $("<button class='btn'></button>");
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
      // console.log(pokemon);
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
    var $modalContainer = $("#modalContainer");
    var $closeModalButton = $("<button>CLOSE</button>");
    var $unorderedList = $(".pokemonsList");
    var $profileImage = pokemon.imageUrl;
    var $profileName = pokemon.name;
    var $profileHeight = pokemon.height;
    var $profileWeight = pokemon.weight;
    var $profileType = pokemon.type;
    $modalContainer.removeClass("modalContainer__isHidden");
    $modalContainer.addClass("modalContainer__isVisible");
    $unorderedList.css("filter", "blur(5px)");
    var $profile = $('<div><img src="' + $profileImage + '" alt="' + 
                          $profileName +'"><div><h1>name: <span>'+ 
                          $profileName +'</span></h1><h2>height: <span>'+ $profileHeight +' M.</span></h2><h3>weight: <span>'+ $profileWeight +' KG.</span></h3><h4>type: <span>'+ $profileType +'</span></h4></div>');
    
    $modalContainer.append($profile);
    $modalContainer.append($closeModalButton);                 
    $closeModalButton.click(hideModal);                                 
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
    // unorderedList.style.filter = "none";
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


