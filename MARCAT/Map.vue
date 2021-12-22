<template>
    <div id="app-map">

      <div id="map" class="map position-absolute vh-100 vw-100"></div>
      <wms-legend @legendClicked="changeStyle($event)" ref="legendWMS" class="position-absolute top-0 end-0 d-sm-flex me-2 mt-5"></wms-legend>
    </div>
</template>











<script>
import WMSLegend from "WMSLegend.vue";

export default {
  name: 'app-map',
  created (){
    
  },
  mounted () {
    this.$initMap();
  },
  data () {
    return {
      $map: undefined,
      $wmsURLexample: undefined,
      layers: {
        bathymetry: new ol.layer.Tile({
            name: 'bathymetry',
            source: new ol.source.XYZ ({ // https://openlayers.org/en/latest/examples/xyz.html
              url: 'https://tiles.emodnet-bathymetry.eu/2020/baselayer/web_mercator/{z}/{x}/{y}.png', // https://tiles.emodnet-bathymetry.eu/
              attributions: "© EMODnet Bathymetry Consortium",
              cacheSize: 500,
              crossOrigin: 'anonymous',
            }),
            zIndex: -2,
          }),
        graticule: new ol.layer.Graticule({
          name: 'graticule',
          showLabels: true,
          wrapX: false,
          lonLabelPosition: 1,
          strokeStyle: new ol.style.Stroke({
            color: 'rgba(0,0,0,0.2)',
            width: 2,
            lineDash: [0.5, 4],
          }),
          lonLabelStyle: new ol.style.Text({
            font: '12px Calibri,sans-serif',
            textAlign: 'center',
            textBaseline: 'top',
            fill: new ol.style.Fill({
              color: 'rgba(0,0,0,0.9)',
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(255,255,255,0.5)',
              width: 3
            })
          }),
          latLabelStyle: new ol.style.Text({
            font: '12px Calibri,sans-serif',
            textAlign: 'end',
            textBaseline: 'top',
            fill: new ol.style.Fill({
              color: 'rgba(0,0,0,0.9)',
            }),
            stroke: new ol.style.Stroke({
              color: 'rgba(255,255,255,0.5)',
              width: 3
            })
          }),
        }),
        shoreline: new ol.layer.VectorTile({
          name: 'shoreline',
          maxZoom: 22,
          source: new ol.source.VectorTile({
            attributions: '© European Environment Agency',
            format: new ol.format.MVT(),
            url: '../geoportal/data/shoreline-tiles/{z}/{x}/{y}.pbf',
            maxZoom: 10, // Defined in MVT folders
            zDirection: -1
          }),
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'rgba(0,0,0,0.7)',
              width: 1
            })
          }),
        }),
        eez12nm: new ol.layer.VectorTile({
          name: '12nauticmiles',
          maxZoom: 22,
          source: new ol.source.VectorTile({
            attributions: '© Flanders Marine Institute',
            format: new ol.format.MVT(),
            url: '../geoportal/data/eez_12nm/{z}/{x}/{y}.pbf',
            maxZoom: 9, // Defined in MVT folders
            zDirection: -1
          }),
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'rgba(240,150,150,0.6)',
              width: 1
            })
          }),
        }),
        data: new ol.layer.Tile({
          name: 'data',
          zIndex: -1,
          //opacity: 0.9
        })
      }
    }
  },
  methods: {

    // PRIVATE METHODS
    // Figure clicked (TODO: emit)
    $initMap: function () {
      // Initialize map
      this.$map = new ol.Map({
        layers : [
          // Data layer
          this.layers.data,
          // Bathymetry
          //this.layers.bathymetry,
          // Graticule layer
          this.layers.graticule,
          // Shoreline
          this.layers.shoreline,
          // 12 nm
          this.layers.eez12nm,
          
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.fromLonLat([3,41.5]),
          zoom: 6,
          maxZoom: 22,
          extent: ol.proj.fromLonLat([-28,20]).concat(ol.proj.fromLonLat([40, 50]))
        }),
      });
      // Set css
      document.getElementsByClassName('ol-attribution')[0].style.bottom = 'auto';
      document.getElementsByClassName('ol-attribution')[0].style.top = '.5em';
    },


    // Get layer function
    $getMapLayer: function(layerName){
      let selLayer;
      this.$map.getLayers().forEach(layerItem => {
        //console.log(layerItem.get('name'));
        if (layerItem.get('name') == layerName)
          selLayer = layerItem;
      })
      return selLayer;
    },
  




    // INTERNAL EVENTS
    // Change the styles (WMSLegend.vue emit)
    changeStyle: function(newStyle){
      // Get params
      let params = this.$getMapLayer('data').getSource().getParams();
      params.STYLES = newStyle;
      // Set params
      this.$getMapLayer('data').getSource().updateParams(params);
      // Update ForecastBar if it exists
      this.$emit('changeWMSStyle', newStyle);
    },




    // PUBLIC METHODS
    // Update WMS data source. This function is called from forecast-component
    $updateSourceWMS: function (infoWMS){
      // Create tile grid for faster rendering for low resolution WMS
      let extent = ol.proj.get('EPSG:3857').getExtent();
      let tileSize = 512;
      let maxResolution = ol.extent.getWidth(extent) / tileSize;
      let resolutions = new Array(5);
      for (let i = 0; i < resolutions.length; i++){
        resolutions[i] = maxResolution / Math.pow(2,i);
      }
      // Assign to openlayers WMS tile source
      infoWMS.tileGrid = new ol.tilegrid.TileGrid({
        extent: extent,
        resolutions: resolutions,
        tileSize: tileSize
      });

      // Get information from forecast-component
      this.$getMapLayer('data').setSource(new ol.source.TileWMS(infoWMS));
      // Update legend
      if (this.$refs.legendWMS)
        this.$refs.legendWMS.setWMSLegend(infoWMS);
    },

    
    // Get OL map object
    $getOLMap: function(){
      return this.$map;
    }


  },
  components: {
    "wms-legend": WMSLegend
  },
  computed: {
      foo: function () {
      }
  }
}
</script>











<style scoped>
.map {
  background: #f8f4f0;
}

</style>