(function(){
  var pokemonRepository = (function(){
    var repository =[];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
    function getAll(){
      return repository;
    }
  
    function add(item){
      repository.push(item);
    }
  
   function loadList() {
      return fetch(apiUrl).then(function (response) {
        return response.json();
      }).then(function (json) {
        json.results.forEach(function (item) {
          var pokemon = {
            name: item.name,
            height: item.height,
            detailsUrl: item.url
          };
          add(pokemon)
        })
  
        }).catch(function (e) {
        console.error(e);
      })
    }
  
  
    function loadDetails(item){
      var url = item.detailsUrl;
      return $.ajax(url).then(function(details){
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types.map(function(pokemon) {
    return pokemon.type.name;
  });
  
    //   }).catch(function(e){
    //     console.error(e);
    //   });
    // }
  
    return {
      add: add,
      getAll: getAll,
      loadList: loadList,
      loadDetails: loadDetails
    };
  })();
  
  var $pokemonList = $('.poke-list')
  
  function addListItem(pokemon){
    var listItem = $('<button type="button" class="poke-list_item list-group-item list-group-item-action" data-toggle="modal" data-target="#modal-container"></button>');
    listItem.text(pokemon.name);
    $pokemonList.append(listItem);
    
    listItem.click(function() {
      showDetails(pokemon)
    });
  }
  
  /*************
  Display modal about pokemon details
  **************/
  
  function showDetails(pokemon){
    pokemonRepository.loadDetails(pokemon).then(function() {
      var modal = $('.modal-body');
      /*eslint no-unused-vars: ["error", { "varsIgnorePattern": "name" }]*/
      var name = $('.modal-title').text(pokemon.name);
      var height = $('<p class="pokemon-height"></p>').text('Height: ' + pokemon.height);
      var type = $('<p class="pokemon-type"></p>').text('Type: ' + pokemon.types);
      var image = $('<img class="pokemon-pic">');
      image.attr('src', pokemon.imageUrl);
  
  
      if(modal.children().length) {
        modal.children().remove();
      }
  
      modal.append(image)
           .append(height)
           .append(type);
  
    });
  }
  
  
  pokemonRepository.loadList().then(function(){
    var pokemons = pokemonRepository.getAll();
  
    $.each(pokemons, function(index, pokemon){
          addListItem(pokemon);
    });
  });
  })();