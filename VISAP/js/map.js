// Popup piechart
import {PieChart} from './PieChart.js';


// https://github.com/cschwarz/wkx
var Buffer = require('buffer').Buffer;
var wkx = require('wkx');

export const startMap = () => {
  // EMODNET Bathymetry
  // https://tiles.emodnet-bathymetry.eu/
  // https://portal.emodnet-bathymetry.eu/services/services.html
  const bathymetryTileLayer = new ol.layer.Tile({
    //preload: 15,
    source: new ol.source.XYZ ({ // https://openlayers.org/en/latest/examples/xyz.html
            url: 'https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{z}/{x}/{y}.png', // https://tiles.emodnet-bathymetry.eu/
            attributions: "© EMODnet Bathymetry Consortium (Basemap)",
          }),
  });
  // Avoids requesting the same tile constantly
  // TODO: Check if this affects the peformance (maybe requires a lot of memory from the device?)
  bathymetryTileLayer.getSource().tileCache.setSize(512);











  // Attributions
  const attributions = new ol.control.Attribution({
     collapsible: true
   });


  // Graticule Layer style
  // Text style of the map graticule
  const textStyleLat = new ol.style.Text({
    font: '12px Arial, Helvetica, sans-serif',
    textAlign: 'end',
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,0.9)',
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(255,255,255,0.5)',
      width: 3
    })
  });
  const textStyleLon = textStyleLat.clone(true);
  textStyleLon.setTextAlign('center');
  textStyleLon.setTextBaseline('bottom');

  // Graticule layer
  // https://openlayers.org/en/latest/examples/graticule.html
  // https://openlayers.org/en/latest/apidoc/module-ol_layer_Graticule-Graticule.html
  const graticuleLayer = new ol.layer.Graticule({
    // the style to use for the lines, optional.
    strokeStyle: new ol.style.Stroke({
      color: 'rgba(0,0,0,0.2)',
      width: 2,
      lineDash: [0.5, 4],
    }),
    showLabels: true,
    wrapX: false,
    latLabelStyle: textStyleLat,
    lonLabelStyle: textStyleLon,
  });




  // Catalunya coastline
  // https://openlayers.org/en/latest/examples/geojson.html
  // http://www.ign.es/web/ign/portal/ide-area-nodo-ide-ign
  const catCoastlineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0,0,0,1)',
      width: 1
    })
  });
  const catCoastlineLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'data/shoreline_cat.geojson',
      format: new ol.format.GeoJSON(),
      attributions: "© Instituto Geográfico Nacional (Catalan coastline)",
    }),
    style: catCoastlineStyle
  });
  // European coastline complementary
  // https://www.eea.europa.eu/data-and-maps/data/eea-coastline-for-analysis-1/gis-data/europe-coastline-shapefile
  const compCoastlineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0,0,0,0.6)',
      width: 1
    })
  });
  const compCoastlineLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'data/coastline_complementary_cat.geojson',
      format: new ol.format.GeoJSON(),
      attributions: "© European Environment Agency (european coastline)",
    }),
    style: compCoastlineStyle
  });



  // Port labels trawling / arrossegament
  const portsTextStyle = textStyleLat.clone(true);
  portsTextStyle.setTextAlign('right');
  portsTextStyle.setOffsetX(-10);
  const portsStyle = new ol.style.Style({
    text: portsTextStyle,
    image: new ol.style.Circle({
      radius: 5,
      fill: new ol.style.Fill({color: 'rgba(255,255,255,0.6)'}),
      stroke: new ol.style.Stroke({color: 'rgba(0,0,0,0.8)', width: 1})
    })
  });
  const portsLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'data/ports.geojson',
      format: new ol.format.GeoJSON()
    }),
    //declutter: true,
    style: function(feature) {
      let name = feature.get('name');
      portsStyle.getText().setText(name);
      let paletteColor = palette[name].color || [255,255,255];
      portsStyle.getText().getStroke().setColor('rgba('+paletteColor.toString()+', 0.3)');
      return portsStyle},
  });




  // Track lines styles
  const trackLineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(255,0,0,0.6)', // TODO: depening on the feature port
      width: 2,
    })
  });
  const trackLineHighlightStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(255,0,0,0.9)', // TODO: depening on the feature port
      width: 8
    })
  });





  // Mouse position
  const mousePositionControl = new ol.control.MousePosition({
    coordinateFormat: (coord) => ol.coordinate.format(coord, '{x}º E / {y}º N', 2),//ol.coordinate.createStringXY(2),
    projection: 'EPSG:4326',
    className: 'custom-mouse-position', // Text style defined in CSS class outside
    target: document.getElementById('mouse-position'), // ALERT IF SEVERAL MAPS EXIST
    undefinedHTML: '&nbsp;', // What to show when mouse is out of map
  });

  // View
  const mapView = new ol.View({
    center: ol.proj.fromLonLat([3,41.5]),
    zoom: 8,
    extent: ol.proj.fromLonLat([-2,39.5]).concat(ol.proj.fromLonLat([7, 43.5]))//extent: [-2849083.336923, 3025194.250092, 4931105.568733, 6502406.032920]//olProj.get("EPSG:3857").getExtent()
  });


  // Popup info overlay
  const popupContainerEl = document.getElementById('popup'); // ALERT IF SEVERAL MAPS EXIST
  const popupContentEl = popupContainerEl.querySelector('#popup-content');
  const popupCloserEl = popupContainerEl.querySelector('#popup-closer');
  const popupOverlay = new ol.Overlay({
    element: popupContainerEl,
    positioning: 'center-right',
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });
  popupOverlay.setPositioning('bottom-left');
  popupCloserEl.onclick = function () {
    popupOverlay.setPosition(undefined);
    popupCloserEl.blur();
    return false;
  };


  // Map
  const map = new ol.Map({
    target: 'map-container',
    //controls: ol.control.defaults().extend([mousePositionControl]),
    controls: ol.control.defaults({attributions: false}).extend([attributions, mousePositionControl]),
    layers: [
      bathymetryTileLayer,
      graticuleLayer,
      catCoastlineLayer,
      compCoastlineLayer,
      portsLayer
    ],
    overlays: [popupOverlay],
    view: mapView
  });



  // Get track lines information
  // Load and create pie chart
  const getTrackLines = (address, staticFile) => {
    console.log("Getting data: " + address +", "+ staticFile +", ");
  	// Try data from server
  	fetch(address)
  		.then(r => r.json())
  		.then(r => {
        createTrackLines(r);
			})
			.catch(e => {
  			if (staticFile !== undefined){ // Load static file
  				console.error("Could not fetch from " + address + ". Error: " + e + ". Trying with static file.");
  				getTrackLines(staticFile, undefined);
  			} else {
  				console.error("Could not fetch from " + address + ". Error: " + e + ".");
  			}
  		})
  }
  getTrackLines('http://localhost:8080/trackLines', 'data/trackLines.json');


  // Create trackLines GEOJSON object and add vector layer
  const createTrackLines = (data)=>{
    let geoJSONData = {
      'type': 'FeatureCollection',
      'features': []
    };

    for (let i = 0; i < data.length; i++){
      //https://github.com/cschwarz/wkx
      //Parsing a node Buffer containing a WKB object
      if (data[i].geom === null)
        continue;

      let wkbBuffer = new Buffer(data[i].geom, 'hex');
      let geometry = wkx.Geometry.parse(wkbBuffer);
      let gJSON = geometry.toGeoJSON();
      delete data[i].geom; // delete geom, as we do not want it in the features
      // Create geoJSON
      let feature = {
        'type': 'Feature',
        'properties': {
          "id": data[i].Id,
          "info": data[i],
          "featType": "trackLine",
        },
        'geometry': gJSON,
      }

      geoJSONData.features.push(feature);
    }
    //console.log(JSON.stringify(geoJSONData));
    // Create URL
    let dataStr = JSON.stringify(geoJSONData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    // Create layer
    let vectorTrackLines = new ol.layer.Vector({
      source: new ol.source.Vector({
        //features: new ol.format.GeoJSON().readFeatures(geoJSONData), // This is not working??? https://openlayers.org/en/latest/examples/geojson.html
        url: dataUri,//'data/trackLines.geojson',
        format: new ol.format.GeoJSON(),
      }),
      style: trackLineStyle,
    });

    // Add layer to map
    map.addLayer(vectorTrackLines);
  }

  // Add map interaction for trackLine
  // https://openlayers.org/en/latest/examples/popup.html
  // https://openlayers.org/en/latest/examples/select-features.html
  const selectInteraction = new ol.interaction.Select();
  selectInteraction.on('select', (e) => {
    if (e.selected[0] === undefined)
      return false;

    // Show pop-up
    //console.log(e.selected[0].getProperties().info);
    let info = e.selected[0].getProperties().info;
    // Create HTML
    let htmlInfo = "<ul>";
    for (let key in info)
      htmlInfo += "<li>" + key + ": "+ info[key] + "</li>";
    htmlInfo += "</ul>";
    popupContentEl.innerHTML = htmlInfo;
    popupOverlay.setPosition(e.mapBrowserEvent.coordinate);



    // Get data from server to create pie chart
    // var results = fetch("http://localhost:8080/haulSpecies?HaulId=" + haulId).then(r => r.json()).then(r => results = r).catch(e => console.log(e))
    let haulId = info.Id;
    fetch("http://localhost:8080/haulSpecies?HaulId=" + haulId).then(r => r.json()).then(r => {
      console.log(r)
      // Create PieChart
      let pieChart = new PieChart();
      let preparedData = pieChart.processSample(r);
      pieChart.runApp(popupContentEl, preparedData, d3, info.Port + ", " + info.Data, "Biomassa", "kg / km2");

    }).catch(e => console.log(e));
  });
  // Add interaction to map
  map.addInteraction(selectInteraction);


  // Interaction of moveover
  let selectedTrack = null;
  map.on('pointermove', function (e) {
    // Reset style
    if (selectedTrack !== null && selectedTrack.getProperties().featType == "trackLine") {
      selectedTrack.setStyle(trackLineStyle);
      selectedTrack = null;
    }
    // Highlight style
    map.forEachFeatureAtPixel(e.pixel, function (f) {
      if (f.getProperties().featType != "trackLine")
        return true;
      selectedTrack = f;
      f.setStyle(trackLineHighlightStyle);
      return true;
    });

  });

/*  const mapColor = new ol.Map({
    target: 'mapColor-container',
    controls: ol.control.defaults().extend([mousePositionControl]),
    layers: [
      portsLayer
    ],
    view: mapView
  })*/





  // Mouse hover/onclick
  // https://openlayers.org/en/latest/examples/select-features.html
/*  const selectHover = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove
  });
  const selectClick = new ol.interaction.Select({
    condition: ol.events.condition.click
  })
  // https://openlayers.org/en/latest/examples/icon-negative.html
  mapColor.addInteraction(selectHover);
  selectHover.on('select', function(e){
    console.log(e.selected[0]);
  })
*/


/*
  // SVG FILTER
  let once = false;
  // Canvas 2D filter
  map.on('postrender', function(e){ // https://openlayers.org/en/latest/apidoc/module-ol_MapEvent-MapEvent.html#event:moveend
    if (!once){
      var ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
      ctx.filter = 'grayscale(100%) contrast(1.2) brightness(1.1) hue-rotate(-10deg)';
    }
  });*/
}

export default startMap;
