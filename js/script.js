var pokemonRepository = (function(){
  var pokemonList = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  function getAll(){
    return pokemonList;
  }

  function add(pokemon){
    pokemonList.push(pokemon);
  }

  function addListItem(pokemon){
    var unorderedList = document.querySelector(".pokemonsList");
    var listItem = document.createElement("li");
    var button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("btn");
    listItem.appendChild(button);
    unorderedList.appendChild(listItem);
    button.addEventListener("click", function(){
      showDetails(pokemon);
    });
  }

  function loadList() {
    return fetch(apiUrl).then(function (response) {
      return response.json();
    }).then(function (json) {
      json.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon);
      });
    }).catch(function (e) {
      console.error(e);
    })
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      // console.log(pokemon);
      showModal(pokemon);
    });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.weight = details.weight;
      item.type = details.types[0].type.name;
    }).catch(function (e) {
      console.error(e);
    });
  }

  function showModal(pokemon){
    var modalContainer = document.querySelector("#modalContainer");
    var closeModalButton = document.createElement("button");
    var CloseNode = document.createTextNode("CLOSE");
    var unorderedList = document.querySelector(".pokemonsList");
    var profile = document.createElement("div");
    var profileImage = pokemon.imageUrl;
    var profileName = pokemon.name;
    var profileHeight = pokemon.height;
    var profileWeight = pokemon.weight;
    var profileType = pokemon.type;
    modalContainer.classList.remove("modalContainer__isHidden");
    modalContainer.classList.add("modalContainer__isVisible");
    unorderedList.style.filter = "blur(5px)";
    closeModalButton.appendChild(CloseNode);
    modalContainer.appendChild(profile);
    modalContainer.appendChild(closeModalButton);
    profile.innerHTML = `<img src = ${profileImage} alt = ${profileName}> 
                          <div><h1>name: <span>${profileName}</span></h1>
                          <h2>height: <span>${profileHeight} m.</span></h2>
                          <h3>weight: <span>${profileWeight} Kg.</span></h3>
                          <h4>type: <span>${profileType}</span></h4></div>`;
    closeModalButton.addEventListener("click", hideModal);
  }

  function hideModal(e){
    e.target.parentElement.classList.remove("modalContainer__isVisible");
    e.target.parentElement.classList.add("modalContainer__isHidden");
    var unorderedList = document.querySelector(".pokemonsList");
    var modalContainer = document.querySelector("#modalContainer");
    modalContainer.innerHTML = "";
    unorderedList.style.filter = "none";
  }

  window.addEventListener("keydown", function(e){
    var modalContainer = document.querySelector("#modalContainer");
    var unorderedList = document.querySelector(".pokemonsList");
    if(e.keyCode === 27 && modalContainer.classList.contains("modalContainer__isVisible")){
      modalContainer.classList.remove("modalContainer__isVisible");
      modalContainer.classList.add("modalContainer__isHidden");
      modalContainer.innerHTML = "";
    } 
    unorderedList.style.filter = "none";
  })

  window.addEventListener("click", function(e){
    var modalContainer = document.querySelector("#modalContainer");
    var unorderedList = document.querySelector(".pokemonsList");
    if(!e.target.classList.contains("modalContainer__isVisible")){
      modalContainer.classList.remove("modalContainer__isVisible");
      modalContainer.classList.add("modalContainer__isHidden");
      unorderedList.style.filter = "none";
      modalContainer.innerHTML = "";
    }
  })

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
    showModal: showModal,
    hideModal: hideModal
  };
})();

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});


