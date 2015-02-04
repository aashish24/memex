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
  }), visData = [], geolocations = {}, scale = d3.scale.linear(), color = d3.scale.linear();

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
    url: "data.json",
    async: false,
    success: function (data) {
      var dataItemName = null;
      for (var dataItem in data.geography) {
        dataItemName = data.geography[dataItem].name;
        if (visData[dataItemName]) {
          // Do nothing
        } else {
          if (geolocations[dataItemName]) {
            //console.log(data.data[dataItem]);
            visData.push({name: dataItemName,
                          adCount: data.data[dataItem].ad_count,
                          location: geolocations[dataItemName],
                          unemployed: data.data[dataItem]['B17005']['estimate']['B17005006']
                        });
          }
        }
      }
       console.log(visData);
    }
  });

  scale
    .domain([d3.min(visData, function(d) {
      return d.location.ratio;
    }), d3.max(visData, function(d) { return d.location.ratio;  })])
    .range([8, 100]);

  color
    .domain([d3.min(visData, function(d) {
      return d.unemployed;
    }), d3.max(visData, function(d) { return d.unemployed;  })])
    .range([1.0, 1.0]);

  console.log(color(10));

  map.createLayer('feature').createFeature('point', {selectionAPI: true})
    .data(visData)
    .position(function(d) {
      return {x: d.location.lng, y: d.location.lat};
    })
    .style('strokeColor', {r: 0.3, g: 0.3, b: 0.1})
    .style('fillColor', function (d) { if (d.unemployed < 1000) {
        return {r: 1.0, g: 1.0, b: 0.0};
      } else {
        return {r: 1.0, g: 0.1, b: 0.1};
      }
    } )
    .style('fillOpacity', function (d) {
      return 0.4;
    })
    .style('radius', function(d) {
      return scale(d.location.ratio)  ;
    });

  // Draw the map
  map.draw();
});
