// Run after the DOM loads
$(function () {
  'use strict';

  // Create a map object
  var map = geo.map({
    node: '#map',
    center: {
      x: -98.0,
      y: 39.5
    },
    zoom: 1
  }), visData = {}, geolocations;

  // Add the osm layer with a custom tile url
  map.createLayer(
    'osm',
    {
      baseUrl: 'http://otile1.mqcdn.com/tiles/1.0.0/map/'
    }
  );

  // Parse the geolocations
  $.ajax({
    url: "/geolocations.json",
    async: false,
    success: function (data) {
      geolocations = JSON.parse(data);
      console.log(geolocations);
    }
  })

  // Parse the data
  $.ajax({
    url: "giant_oak_data.json",
    async: false,
    success: function (data) {
      console.log(data);
    }
  });

  // Draw the map
  map.draw();
});
