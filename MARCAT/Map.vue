<template>
    <div id="app-map">

      <div id="map" class="map position-absolute vh-100 vw-100"></div>
    </div>
</template>











<script>
export default {
  name: 'app-map',
  created (){

  },
  mounted () {
    this.initMap();
  },
  data () {
    return {
      map: undefined
    }
  },
  methods: {
    // Figure clicked (TODO: emit)
    initMap: function () {
      // Initialize map
      this.map = new ol.Map({
        layers : [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.fromLonLat([3,41.5]),
          zoom: 6,
          maxZoom: 22,
          extent: ol.proj.fromLonLat([-28,20]).concat(ol.proj.fromLonLat([40, 50]))
        }),
      })
    }
  },
  components: {
    //"vue-load-image": VueLoadImage
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