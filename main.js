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
  }), visData = {}, geolocations = {};

  // Add the osm layer with a custom tile url
  map.createLayer(
    'osm',
    {
      baseUrl: 'http://otile1.mqcdn.com/tiles/1.0.0/map/'
    }
  );

  // Parse the geolocations
  $.ajax({
    url: "geolocations.json",
    async: false,
    success: function (data) {
      //geolocations = JSON.parse(data);
      for (var i = 0; i < data.length; ++i) {
        if (data[i] && data[i][0] && data[i][1]) {
          geolocations[data[i][0]] = data[i][1];
        }
      }
      console.log(geolocations);
    },
    error: function (msg) {
      console.log(msg);
    }
  })

  // Parse the data
  $.ajax({
    url: "giant_oak_data.json",
    async: false,
    success: function (data) {
      var dataItemName = null;
      for (var dataItem in data.geography) {
        dataItemName = data.geography[dataItem].name;
        if (visData[dataItemName]) {
          // Do nothing
        } else {
          if (geolocations[dataItemName]) {
            visData[dataItemName] = {adCount: data.data[dataItem].ad_count, location: geolocations[dataItemName]};
          }
        }
      }
       console.log(visData);
    }
  });

  map.createLayer('point')
    .data(visData)
    .position(function(d) {
      return {x: d.lon, y: d.lat};
    })
    .style('radius', function(d) {
      return d.adCount / 1000.0;
    });

  // Draw the map
  map.draw();
});
