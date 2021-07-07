

// Data structure for the app
const GUIMapLayers = {};


// Basemap layer (EMODNET bathymetry)
const bathymetryLayer = new ol.layer.Tile({
  //preload: 15,
  source: new ol.source.XYZ ({ // https://openlayers.org/en/latest/examples/xyz.html
          url: 'https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{z}/{x}/{y}.png', // https://tiles.emodnet-bathymetry.eu/
          attributions: "© EMODnet Bathymetry Consortium",
          cacheSize: 500
        }),
});
GUIMapLayers["Bathymetry"] = {"ol-layers": [bathymetryLayer], "color": null};



const graticuleLayer = new ol.layer.Graticule({
  // the style to use for the lines, optional.
  strokeStyle: new ol.style.Stroke({
    color: 'rgba(0,0,0,0.2)',
    width: 2,
    lineDash: [0.5, 4],
  }),
  showLabels: true,
  wrapX: false,
  latLabelStyle: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    textAlign: 'end',
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,0.9)',
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(255,255,255,0.5)',
      width: 3
    })
  }),
  lonLabelStyle: new ol.style.Text({
    font: '12px Calibri,sans-serif',
    textAlign: 'center',
    textBaseline: 'bottom',
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,0.9)',
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(255,255,255,0.5)',
      width: 3
    })
  }),
});
GUIMapLayers["Graticule"] = {"ol-layers": [graticuleLayer], "color": graticuleLayer.strokeStyle_.color_};



// Shoreline layer
const shorelineLayer = new ol.layer.VectorTile({
  maxZoom: 22,
  source: new ol.source.VectorTile({
    attributions: '© European Environment Agency',
    format: new ol.format.MVT(),
    url: 'data/shoreline-tiles/{z}/{x}/{y}.pbf',
    maxZoom: 10, // Defined in MVT folders
    zDirection: -1
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0,0,0,0.7)',
      width: 1
    })
  }),
});
shorelineLayer.set('name', "Shoreline");
GUIMapLayers["Shoreline"] = {"ol-layers": [shorelineLayer], "color": shorelineLayer.style_.stroke_.color_};




// Exclusive economical zone 12 nautical miles layer
const eez12nmLayer = new ol.layer.VectorTile({
  maxZoom: 22,
  source: new ol.source.VectorTile({
    attributions: '© Flanders Marine Institute',
    format: new ol.format.MVT(),
    url: 'data/eez_12nm/{z}/{x}/{y}.pbf',
    maxZoom: 9, // Defined in MVT folders
    zDirection: -1
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(240,150,150,0.6)',
      width: 1
    })
  }),
});
eez12nmLayer.set('name', "EEZ 12 nautical miles");
GUIMapLayers["EEZ 12 nautical miles"] = {"ol-layers": [eez12nmLayer], "color": eez12nmLayer.style_.stroke_.color_};



// Rivers MVT layer
//https://gis.stackexchange.com/questions/210188/unzipping-osm2vectortiles-after-extracing-with-mbutil
const riversLayer = new ol.layer.VectorTile({
  maxZoom: 22,
  source: new ol.source.VectorTile({
    attributions: '© FAO',
    format: new ol.format.MVT(),
    url: 'data/rivers_westmed/{z}/{x}/{y}.pbf',
    maxZoom: 5,
    zDirection: -1
  }),
  style: function(feature, resolution) {
    var zoom = map.getView().getZoomForResolution(resolution); // ALERT, THIS DEPENDS ON THE map VARIABLE
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'rgba(60,150,200,1)',
        width: Math.min(zoom/10, 1)
      })
    })
  },
});
riversLayer.set('name', "Rivers");
GUIMapLayers["Rivers"] = {"ol-layers": [riversLayer], "color": 'rgba(60,150,200,1)'};









// Webcam layer
const webcamLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/webcams.json',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  style: function (feature, resolution) {
    var zoom = map.getView().getZoomForResolution(resolution); // ALERT, THIS DEPENDS ON THE map VARIABLE
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: Math.min(zoom,10),
        fill: new ol.style.Fill({color: 'rgba(0, 255, 0, 0.1)'}),
        stroke: new ol.style.Stroke({color: 'green', width: 1}),
      }),
    });
  },
});
// Webcam label layer
const webcamLabelLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/webcams.json',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  style: function (feature, resolution) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get('name'),
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
          color: '#000',
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 3,
        }),
      }),
    });
  },
  declutter: true,
});
webcamLayer.set('name', "Webcams");
webcamLabelLayer.set('name', "Webcams");
GUIMapLayers["Webcams"] = {"ol-layers": [webcamLayer, webcamLabelLayer], "color": 'green'};






// Buoys layer
const buoysLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/buoys.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  style: function (feature, resolution) {
    var zoom = map.getView().getZoomForResolution(resolution); // ALERT, THIS DEPENDS ON THE map VARIABLE
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: Math.min(zoom,10),
        fill: new ol.style.Fill({color: 'rgba(255, 0, 0, 0.1)'}),
        stroke: new ol.style.Stroke({color: 'red', width: 1}),
      }),
    });
  },
});
// Buoys Label layer
const buoysLabelLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/buoys.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  style: function (feature) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get('name'),
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
          color: '#000',
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 3,
        }),
      }),
    });
  },
  declutter: true,
});
buoysLayer.set('name', "Buoys");
buoysLabelLayer.set('name', "Buoys");
GUIMapLayers["Buoys"] = {"ol-layers": [buoysLayer, buoysLabelLayer], "color": 'red'};





// Radars layer
// TODO STYLE
const radarsLayer = new ol.layer.Vector({
  maxZoom: 9,
  source: new ol.source.Vector({
    url: 'data/radars.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  /*style: function (feature, resolution) {
    var zoom = map.getView().getZoomForResolution(resolution); // ALERT, THIS DEPENDS ON THE map VARIABLE
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: Math.min(zoom,10),
        fill: new ol.style.Fill({color: 'rgba(255, 0, 0, 0.1)'}),
        stroke: new ol.style.Stroke({color: 'red', width: 1}),
      }),
    });
  },*/
});
// Radars Label layer
const radarsLabelLayer = new ol.layer.Vector({
  minZoom: 7,
  maxZoom: 9,
  source: new ol.source.Vector({
    url: 'data/radars.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  style: function (feature) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get('name'),
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
          color: '#000',
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 3,
        }),
      }),
    });
  },
  declutter: true,
});
radarsLayer.set('name', "Radars");
radarsLabelLayer.set('name', "Radars");
GUIMapLayers["Radars"] = {"ol-layers": [radarsLayer, radarsLabelLayer], "color": 'blue'};






// Discharge Points layer
const dischargePointsLayer = new ol.layer.Vector({
  minZoom: 10,
  source: new ol.source.Vector({
    url: 'data/discharge_urban_treatment_plants.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© MITECO',
  }),
  style: function (feature, resolution) {
    var zoom = map.getView().getZoomForResolution(resolution); // ALERT, THIS DEPENDS ON THE map VARIABLE
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: Math.min(zoom/5,5),
        fill: new ol.style.Fill({color: 'rgba(0, 0, 0, 0.1)'}),
        stroke: new ol.style.Stroke({color: 'black', width: 1}),
      }),
    });
  },
});
// Discharge points label layer
const dischargePointsLabelLayer = new ol.layer.Vector({
  minZoom: 10,
  source: new ol.source.Vector({
    url: 'data/discharge_urban_treatment_plants.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© MITECO',
  }),
  style: function (feature) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get('dcpName'),
        textBaseline: 'bottom',
        offsetY: -5,
        font: '9px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 0, 1)',
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(170, 170, 170, 0.3)',
          width: 3,
        }),
      }),
    });
  },
  declutter: true,
});
dischargePointsLayer.set('name', "Discharge points");
dischargePointsLabelLayer.set('name', "Discharge points");
GUIMapLayers["Discharge points"] = {"ol-layers": [dischargePointsLayer, dischargePointsLabelLayer], "color": 'black'};





// Weather Stations layer
const weatherStationsLayer = new ol.layer.Vector({
  minZoom: 10,
  source: new ol.source.Vector({
    url: 'data/weather_stations_med.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© MITECO',
  }),
  style: function (feature, resolution) {
    var zoom = map.getView().getZoomForResolution(resolution); // ALERT, THIS DEPENDS ON THE map VARIABLE
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: Math.min(zoom/5,5),
        fill: new ol.style.Fill({color: 'rgba(255, 50, 25, 0.1)'}),
        stroke: new ol.style.Stroke({color: 'rgba(255, 50, 25, 0.9)', width: 1}),
      }),
    });
  },
});
// Weather Stations label layer
const weatherStationsLabelLayer = new ol.layer.Vector({
  minZoom: 10,
  source: new ol.source.Vector({
    url: 'data/weather_stations_med.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© MITECO',
  }),
  style: function (feature) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: "ESTACIÓ METEO " + feature.get('NOMBRE'),
        textBaseline: 'bottom',
        offsetY: -5,
        font: '9px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
          color: '#000',
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 3,
        }),
      }),
    });
  },
  declutter: true,
});
weatherStationsLayer.set('name', "Weather stations");
weatherStationsLabelLayer.set('name', "Weather stations");
GUIMapLayers["Weather stations"] = {"ol-layers": [weatherStationsLayer, weatherStationsLabelLayer], "color": 'rgb(255, 50, 25)'};










// National national parks
const nationalParksLayer = new ol.layer.Vector({
  minZoom: 10,
  maxZoom: 12,
  source: new ol.source.Vector({
    url: 'data/national_parks.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© MAPAMED',
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "rgba(0, 255, 0, 0.5)"
    }),
    fill: new ol.style.Fill({
      color: "rgba(0, 255, 0, 0.2)",
    })
  })
});
// National national parks
const nationalParksLabelsLayer = new ol.layer.Vector({
  minZoom: 10,
  maxZoom: 12,
  source: new ol.source.Vector({
    url: 'data/national_parks.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© MAPAMED',
  }),
  style: function (feature) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get('DESIG') + "\n" + feature.get('NAME'),
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
          color: '#000',
        }),
        stroke: new ol.style.Stroke({
          color: '#fff',
          width: 3,
        }),
      }),
    });
  },
  declutter: true
});
nationalParksLabelsLayer.set('name', "National parks");
nationalParksLayer.set('name', "National parks");
GUIMapLayers["National parks"] = {"ol-layers": [nationalParksLayer, nationalParksLabelsLayer], "color": nationalParksLayer.style_.stroke_.color_};




// River labels
const riversLabelsLayer =  new ol.layer.Vector({
  minZoom: 13,
  source: new ol.source.Vector({
    url: 'data/rivers_westmed.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© FAO ',
  }),
  style: function (feature) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get('SUB_NAME') + ", " + feature.get('MAJ_NAME'),
        font: '12px Calibri,sans-serif',
        overflow: true,
        fill: new ol.style.Fill({
          color: 'blue',
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(100,200,255,0.8)',
          width: 3,
        }),
      }),
    });
  },
  declutter: true,
});
