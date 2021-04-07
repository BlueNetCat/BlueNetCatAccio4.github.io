


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



// WKT information
const wkt =
  'MULTIPOLYGON(((276240.375653729 4457472.095957,277240.375653729 4457472.095957,277240.375653729 4456472.095957,276240.375653729 4456472.095957,276240.375653729 4457472.095957)))';

  var format = new ol.format.WKT();

  var feature = format.readFeature(wkt, {
    dataProjection: 'EPSG:25831',
    featureProjection: 'EPSG:3857',
  });

  var vectorWKT = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [feature],
    }),
  });






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
      portsLayer,
      vectorWKT
    ],
    view: mapView
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
