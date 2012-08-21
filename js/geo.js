/* Geo
 *
 * Helper to proxy to the Google Geocoder API
 */
window.Geo = function(){ 

  // private methods

  //Get the latitude and the longitude;
  function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    if (window.Geo.callback){
      window.Geo.callback(lat,lng);
    }   
  }

  function errorFunction(){
    console.log('Geocoder failed');
    noResults();
  }

  function go() {
    // HTML5 geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }  
    else{
      noResults();
    }   
  }

  function noResults(){
    if (window.Geo.callback){
      window.Geo.callback(53.26299,-6.142579); // empty result set
    }
  }

  return {

    // public methods

    go : function(callback) {
      window.Geo.callback = callback;
      go();      
    }
  };
}();  // self initialise