//Weathermap data halen
function getAPIdata(lon, lat) {
	// construct request
    var apikey = '2d92c977381c2c201ceefdea9b6f8f2b'
    var request = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`

	// get current weather
	fetch(request)	
	
	// parse response to JSON format
	.then(function(response) {
		return response.json();
	})
	
	// do something with response
	.then(function(response) {
      
        var temparatuur = (parseFloat(response.main.temp) - 273.15).toFixed(1);
        var beschrijving = response.weather[0].description;
        var plaatsnaam = response.name;
        var windsnelheid = response.wind.speed * 3.6;
        var regen = response.rain;

        var printString = "";
        printString += "<h4> " + plaatsnaam + "</h4>";
        printString += "<p> Temparatuur: <p id='bold'>" + temparatuur + "&deg;C </p></p> <br>";
        printString += "<p> Weerbeschrijving: <p id='bold'>" + beschrijving + "</p></p> <br>" 
        printString += "<p> Windsnelheid: <p id='bold'>" + windsnelheid.toFixed(1) + "km/h </p></p>";

        document.getElementById('printWeather').innerHTML = printString;

        checkLandingAvailabilty(temparatuur, windsnelheid, regen);
	});
}

// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGV3dzU5IiwiYSI6ImNrbWx0a3o3YzA5ZTcycWxlaWhkbDJnYmcifQ.O4Az-N2OZ23IZoy2MDYzBA';

// Initialate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [4.322840, 52.067101],
  zoom: 11.15
});


var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});

// Voeg de zoekbalk toe
map.addControl(geocoder, 'top-right');

map.on('load', function () {
	// Listen for the `geocoder.input` event that is triggered when a user
	// makes a selection
	geocoder.on('result', function (ev) {
	  //console.log(ev.result.center);
      var lon = ev.result.center[0];
      var lat = ev.result.center[1];
      getAPIdata(lon, lat);
	});
});

function checkLandingAvailabilty(temp, wind, regen){
  document.getElementById('printLandingAdvice').innerHTML = "";
  if(regen != null){
    document.getElementById('printLandingAdvice').innerHTML = "<p> Het regent je kunt hier niet landen </p>";
    return
  }

  if(wind > 20){
    document.getElementById('printLandingAdvice').innerHTML = "<p> Het waait te hard je kan hier niet landen </p>";
    return
  }

  if(temp < 0){
    document.getElementById('printLandingAdvice').innerHTML = "<p> Het vriest het is te koud om te landen </p>";
    return
  }

  if(temp > 30){
    document.getElementById('printLandingAdvice').innerHTML = "<p> Het is te warm om te landen </p>";
    return
  }

  document.getElementById('printLandingAdvice').innerHTML = "<p> De omstandigheden zijn perfect om te landen! </p>";
}
