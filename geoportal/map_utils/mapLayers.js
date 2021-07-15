

// Data structure for the app
const GUIMapLayers = {};

// Function to add layers to data structure
const addToGUIMapLayers = (layers, layerName, layerColor) => {
  // Set name of layers
  layers.forEach(l => l.set('name', layerName));
  // Store to GUIMapLayers
  GUIMapLayers[layerName] = {"ol-layers": layers, "color": layerColor || 'black'};
}





// Basemap layer (EMODNET bathymetry)
const bathymetryLayer = new ol.layer.Tile({
  //preload: 15,
  source: new ol.source.XYZ ({ // https://openlayers.org/en/latest/examples/xyz.html
          url: 'https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{z}/{x}/{y}.png', // https://tiles.emodnet-bathymetry.eu/
          attributions: "© EMODnet Bathymetry Consortium",
          cacheSize: 500,
          crossOrigin: 'anonymous',
        }),
        zIndex: -2,
});
addToGUIMapLayers([bathymetryLayer], 'Bathymetry');



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
addToGUIMapLayers([graticuleLayer], 'Graticule', graticuleLayer.strokeStyle_.color_);



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
addToGUIMapLayers([shorelineLayer], 'Shoreline', shorelineLayer.style_.stroke_.color_);




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
addToGUIMapLayers([eez12nmLayer], 'EEZ 12 nautical miles', eez12nmLayer.style_.stroke_.color_);



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
addToGUIMapLayers([riversLayer, riversLabelsLayer], 'Rivers', 'rgba(60,150,200,1)');










// Webcam layer
const webcamLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/webcams.geojson',
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
    url: 'data/webcams.geojson',
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
addToGUIMapLayers([webcamLayer, webcamLabelLayer], 'Webcams', 'green');







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
addToGUIMapLayers([buoysLayer, buoysLabelLayer], 'Buoys', 'red');





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
addToGUIMapLayers([radarsLayer, radarsLabelLayer], 'Radars', 'blue');







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
addToGUIMapLayers([dischargePointsLayer, dischargePointsLabelLayer], 'Discharge points', 'black');





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
addToGUIMapLayers([weatherStationsLayer, weatherStationsLabelLayer], 'Weather stations', 'rgb(255, 50, 25)');



// Tide Gauges layer
const tideGaugesLayer = new ol.layer.Vector({
  minZoom: 5,
  source: new ol.source.Vector({
    url: 'data/tide_gauges.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  style: function (feature, resolution) {
    var zoom = map.getView().getZoomForResolution(resolution); // ALERT, THIS DEPENDS ON THE map VARIABLE
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: Math.min(zoom/5,5),
        fill: new ol.style.Fill({color: 'rgba(25, 50, 255, 0.1)'}),
        stroke: new ol.style.Stroke({color: 'rgba(25, 50, 255, 0.9)', width: 1}),
      }),
    });
  },
});
// Weather Stations label layer
const tideGaugesLabelLayer = new ol.layer.Vector({
  minZoom: 8,
  source: new ol.source.Vector({
    url: 'data/tide_gauges.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  style: function (feature) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get('name'),
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
addToGUIMapLayers([tideGaugesLayer, tideGaugesLabelLayer], 'Tide gauges', 'rgb(25, 50, 255)');











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
addToGUIMapLayers([nationalParksLabelsLayer, nationalParksLayer], 'National parks', nationalParksLayer.style_.stroke_.color_);








// BlueNetCat members layer
const bluenetcatMembersLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/BlueNetCatMembers.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  style: function (feature, resolution) {
    var zoom = map.getView().getZoomForResolution(resolution); // ALERT, THIS DEPENDS ON THE map VARIABLE
    return new ol.style.Style({
      image: new ol.style.Icon({
        crossOrigin: 'anonymous',
        src: '../network/logos/BlueNetCat.png',
        scale: Math.min(zoom/70, '0.3'),
        opacity: 0.9
        /*radius: Math.min(zoom,10),
        fill: new ol.style.Fill({color: 'rgba(0, 255, 0, 0.1)'}),
        stroke: new ol.style.Stroke({color: 'green', width: 1}),*/
      }),
    });
  },
});
// BlueNetCat members label layer
const bluenetcatMembersLabelLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'data/BlueNetCatMembers.geojson',
    format: new ol.format.GeoJSON(),
    attributions: '© BlueNetCat',
  }),
  style: function (feature, resolution) {
    return new ol.style.Style({
      text: new ol.style.Text({
        text: feature.get('orga') + (feature.get('orga') !== feature.get('centre') ? (", " + feature.get('centre')) : ""),
        font: '12px Calibri,sans-serif',
        overflow: true,
        offsetY: 15,
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
addToGUIMapLayers([bluenetcatMembersLayer, bluenetcatMembersLabelLayer], 'BlueNetCat Members', 'green');















// OCEANOGRAPHY LAYERS
// https://openlayers.org/en/latest/examples/wms-time.html
// Sea velocity
// https://view-cmems.mercator-ocean.fr/MEDSEA_ANALYSISFORECAST_PHY_006_013
// https://resources.marine.copernicus.eu/?option=com_csw&view=details&product_id=MEDSEA_ANALYSISFORECAST_PHY_006_013&pk_vid=284d9e3ec1af79f91626341520c7c158
const seaVelocityLayer = new ol.layer.Tile({
  className: 'seaVelocity',
  source: new ol.source.TileWMS ({
    url: 'https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d',
    attributions: '© CMEMS ',
    cacheSize: 500,
    zDirection: -1,
    crossOrigin: 'anonymous',
    params: {'LAYERS': 'sea_water_velocity', 'COLORSCALERANGE':[-1, 1], 'STYLES': 'boxfill/greyscale', 'TRANSPARENT': true}, //'boxfill/occam' or 'boxfill/rainbow' or fancyvec/greyscale
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&COLORSCALERANGE=-0.5354787%2C0.92136043&ELEVATION=-1.0182366371154785&LAYERS=uo&STYLES=boxfill%2Frainbow&TIME=2021-06-22T12%3A00%3A00.000Z&URL=https%3A%2F%2Fnrt.cmems-du.eu%2Fthredds%2Fwms%2Fmed-cmcc-cur-an-fc-d&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4326&BBOX=22.5%2C-11.25%2C33.75%2C0
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?request=GetCapabilities&service=WMS
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?request=GetMetadata&item=layerDetails&layerName=sea_water_velocity
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?REQUEST=GetLegendGraphic&LAYER=sea_water_velocity&PALETTE=rainbow&COLORSCALERANGE=-0.5354787%2C0.92136043
  }),
  zIndex: -1,
  opacity: 0.9,
});

addToGUIMapLayers([seaVelocityLayer], 'Sea Velocity');


// How to get values of pixels on an image
// Working example: https://gis.stackexchange.com/questions/332008/mapserver-query-raster-for-pixel-value-at-point
// Openlayers far-example: https://openlayers.org/en/latest/examples/getfeatureinfo-tile.html
// Problem solver: https://stackoverflow.com/questions/61860054/map-foreachlayeratpixel-callback-function-has-an-empty-rgba-array
// Here are the vectorial WMS of sea velocity. They are two layers, which should not be visible
const seaVelocityColorRange = [-1,1];
// Test here color range https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?REQUEST=GetLegendGraphic&LAYER=sea_water_velocity&PALETTE=greyscale&COLORSCALERANGE=-0.5%2C0.5
const seaVelocityEastLayer = new ol.layer.Tile({
  className: 'seaVelocityEast',
  source: new ol.source.TileWMS ({
    url: 'https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d',
    attributions: '© CMEMS ',
    cacheSize: 500,
    crossOrigin: 'anonymous',
    params: {'LAYERS': 'uo', 'COLORSCALERANGE': seaVelocityColorRange, 'STYLES': 'boxfill/greyscale'}, //'boxfill/occam' or 'boxfill/rainbow'
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&COLORSCALERANGE=-0.5354787%2C0.92136043&ELEVATION=-1.0182366371154785&LAYERS=uo&STYLES=boxfill%2Frainbow&TIME=2021-06-22T12%3A00%3A00.000Z&URL=https%3A%2F%2Fnrt.cmems-du.eu%2Fthredds%2Fwms%2Fmed-cmcc-cur-an-fc-d&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4326&BBOX=22.5%2C-11.25%2C33.75%2C0
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?request=GetCapabilities&service=WMS
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?request=GetMetadata&item=layerDetails&layerName=sea_water_velocity
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?REQUEST=GetLegendGraphic&LAYER=sea_water_velocity&PALETTE=rainbow&COLORSCALERANGE=-0.5354787%2C0.92136043
  }),
  zIndex: -100,
  opacity: 0.1,
});
const seaVelocityNorthLayer = new ol.layer.Tile({
  className: 'seaVelocityNorth',
  source: new ol.source.TileWMS ({
    url: 'https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d',
    attributions: '© CMEMS ',
    cacheSize: 500,
    crossOrigin: 'anonymous',
    params: {'LAYERS': 'vo', 'COLORSCALERANGE': seaVelocityColorRange, 'STYLES': 'boxfill/greyscale'}, //'boxfill/occam' or 'boxfill/rainbow'
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&COLORSCALERANGE=-0.5354787%2C0.92136043&ELEVATION=-1.0182366371154785&LAYERS=uo&STYLES=boxfill%2Frainbow&TIME=2021-06-22T12%3A00%3A00.000Z&URL=https%3A%2F%2Fnrt.cmems-du.eu%2Fthredds%2Fwms%2Fmed-cmcc-cur-an-fc-d&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4326&BBOX=22.5%2C-11.25%2C33.75%2C0
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?request=GetCapabilities&service=WMS
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?request=GetMetadata&item=layerDetails&layerName=sea_water_velocity
    // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?REQUEST=GetLegendGraphic&LAYER=sea_water_velocity&PALETTE=rainbow&COLORSCALERANGE=-0.5354787%2C0.92136043
  }),
  zIndex: -100,
  opacity: 0.1,
});
