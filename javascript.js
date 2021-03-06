

var light =  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaC13YXJyZW4iLCJhIjoiY2tpbmV2aHl5MDYxcjJzcGNqaGJzNWwyNSJ9.8Iik9-Klh7z3K-zMi-m_yg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
});

var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaC13YXJyZW4iLCJhIjoiY2tpbmV2aHl5MDYxcjJzcGNqaGJzNWwyNSJ9.8Iik9-Klh7z3K-zMi-m_yg', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
});


// add base layers and controls to switch layers manually
var map = L.map("map", {layers:[light]}).fitWorld();
var baseLayers = {"Light":light, "Dark":dark};
var controlLayers = L.control.layers(baseLayers).addTo(map);

// add overlay to map before finding location
function on() {
  document.getElementById("overlay").style.display = "block";
}
function off() {
  document.getElementById("overlay").style.display = "none";
}

// add button to initiate location services for finding user
var btn = L.easyButton('<i class="fas fa-location-arrow"></i>', function(btn, map) {
    // command to find location once button is clicked
   map.locate({setView: true, maxZoom: 16});
 }).addTo(map);
// var btn = L.easyButton('<span class="curren">&curren;</span>', function(btn, map) {
//     map.stopLocate({setView: false, maxZoom: 14});

// var allowLoc = L.easyButton({
//   states: [{
//       stateName: 'findMe',
//       icon: '<span class="curren">&curren;</span>',
//       onClick: function(control) {
//         map.locate({setView:true, maxZoom:14});
//         control.addTo('forgetMe');
//       }
//   }, {
//     stateName: 'forgetMe',
//     icon: '<span class="target">&target;</span>',
//     onClick: function(control) {
//         map.stopLocate({setView:false,keepCurrentZoomLevel: true});
//       control.remove('findMe');
//     }
//   }]
// });
// allowLoc.addTo(map);



function onLocationFound(e) {
    var radius = e.accuracy; //this defines a variable radius as the accuracy value returned by the locate method. The unit is meters.

    L.marker(e.latlng).addTo(map)

      //this adds a marker at the lat and long returned by the locate function.
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet of this point").openPopup(); //this binds a popup to the marker. The text of the popup is defined here as well. Note that we multiply the radius by 3.28084 to convert the radius from meters to feet and that we use Math.round to round the conversion to the nearest whole number.

        if (radius <= 100) {
            L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
        }
        else {
            L.circle(e.latlng, radius, {color: 'red', opacity:0.4}).addTo(map);
        }

       //this adds a circle to the map centered at the lat and long returned by the locate function. Its radius is set to the var radius defined above.

       // sets info on time of day from users location changing dk/lt layers
    var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
    var sunrise = times.sunrise.getHours();
    var sunset = times.sunset.getHours();

    var currentTime = new Date().getHours();
        if (sunrise < currentTime && currentTime < sunset) {
          map.removeLayer(dark);
          map.addLayer(light);
        }
        else {
          map.removeLayer(light);
          map.addLayer(dark);
        }
}


    // listener for overlay on load then close on click
overlay.addEventListener('load', on);
overlay.addEventListener('click', off);

 //this is the event listener
map.on('locationfound',onLocationFound);

  function onLocationError(e) {
    alert(e.message);
}
map.on('locationerror', onLocationError);
