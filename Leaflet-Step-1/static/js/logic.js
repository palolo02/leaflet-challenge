 

//var earthquakes_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var earthquakes_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

// Load the map
initMap();

function initMap(){
    // Loads the json results
    d3.json(earthquakes_url, function(data){
        var earthquakeData = data;
        //Adds points to map
        setMapPoints(earthquakeData);
    });
}

function setMapPoints(earthquakeData, layer){
    
    // Define the markers for the earthquake (style and popup)
    var markers = L.geoJSON(earthquakeData, {
        pointToLayer: onEachFeatureMarker,
        onEachFeature: onEachFeaturePopUp
    })    
    
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: "pk.eyJ1Ijoic2FsdmFkb3JwYXoiLCJhIjoiY2tiaWowNnhsMGZybTJxcDcxM2w5NXoycCJ9.L9HJzMrf_wk-xIOeS__zDQ"
    });

     // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
        "Light Map": lightmap
    };

    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
        "Earthquakes": L.layerGroup(markers)
    };

    //Create map
    var map = L.map("map", {
        center: [39.8283, -98.5785],
        zoom: 3,
        layers: [lightmap, markers]
    });
    
    // Create a layer control
    L.control.layers(null, overlayMaps, {
        collapsed: false
    }).addTo(map);

    
    // Add Legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5];
        div.innerHTML += "<h4>Legend</h4>";
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += `<i style="background-color:${setColor(i+1)}; color:${setColor(i+1)}">--</i> ${grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')}`;
      }

      return div;
    };
    legend.addTo(map);
    
}

// Set the marker's style on the map
function onEachFeatureMarker(feature, layer){
    console.log(feature.properties.alert)

    var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        fillOpacity: 0.5,
        color: "white",
        fillColor: setColor(feature.properties.mag),
        radius:  feature.properties.mag * 4
      });
    return marker;
}

// bind popup to display more information about the earthquake
function onEachFeaturePopUp(feature, layer){
    layer.bindPopup(`<div style='text-align:center'><h3>${feature.properties.place}</h3><h3>Magnitude:${feature.properties.mag}</h3><p>${new Date(feature.properties.time)}</p></div>`);
}

// Choose color according to the magnitude of the earthquake
function setColor(mag){
    if(mag < 2 )
        color = "#009c00";
    else if(mag >= 2 & mag < 3 )
        color = "#698700";
    else if(mag >= 3 & mag < 4 )
        color = "#ab6400";
    else if(mag >= 4 & mag < 5 )
        color = "#c34a00";
    else if(mag >= 5 & mag < 6 )
        color = "#e73b00";
    else if(mag >= 6)
        color = "#c2401b";
    return color
}