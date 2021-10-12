//Color Palete for mags
var black = "#000000"
var red = "#FF0000"
var orange = "#ff6600"
var green = "#00FF00"

function magColor (mag) {
    //I hate to do it this way but according to some dude on stack overflow, this is the most performant way of doing this rather than a case statement
    //Scale determined by https://www.mtu.edu/geo/community/seismology/learn/earthquake-measure/magnitude/
    if (mag > 8) { return black; }
    else if (mag > 6) { return red; }
    else if (mag > 2.5) { return orange; }
    else { return green; }
}

function magSize (mag) {
    //If we just do a multiply the larger values will get out of hand. using sqrt function to subdue the larger value circle sizes
    if (mag <= 0) {
        mag = 1
    }
    return Math.sqrt(mag * 15)

}

function style(quakeObj) {
    //function to create the styling
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: magColor(quakeObj.properties.mag),
        color: "black",
        radius: magSize(quakeObj.properties.mag),
        weight:0.5
    }
}

function createMarker (feature, coords) {
    //Function to create the markers based on the coords
    return L.circleMarker(coords)
}

//Make the map
var myMap = L.map("map", {
    center: [38.89511, -77.03637],
    zoom: 6
  });
  
//Make the tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);


  var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  d3.json(geoData).then(function(response) {
    function styleInfo(quakeObj) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: magColor(quakeObj.properties.mag),
          color: "#000000",
          radius: magSize(quakeObj.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
      L.geoJson(response, {

        pointToLayer: createMarker,
        style: styleInfo,
        // Binding a pop-up to each layer
        onEachFeature: function (quakeObj, layer) {
    
          layer.bindPopup("Magnitude: " + quakeObj.properties.mag + "<br>Location:<br>" + quakeObj.properties.place);
        }
      }).addTo(myMap);
  //add legend on Bottom Right Corner
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    //Dom Utility that puts legend into DIV & Info Legend
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [1, 3.6, 6.1, 8.1];
      gradeNames = ["0- 2.5","2.6 - 6","6.1 - 8","8 +"]

    div.innerHTML = 'Eathquake<br>Magnitude<br><hr>'

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + magColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' + gradeNames[i] + '<br>'
    }

    return div;
  };
  //Adds Legend to myMap
  legend.addTo(myMap);
  })