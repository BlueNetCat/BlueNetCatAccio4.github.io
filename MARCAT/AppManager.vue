<template>
  <div id="app-manager">

    <ol-map ref="map" @changeWMSSource="changeWMSSource($event)" @changeWMSStyle="changeWMSStyle($event)"></ol-map>
    <animation-canvas ref="animcanvas"></animation-canvas>
    <forecast-bar ref="forecastbar" @changeWMSSource="changeWMSSource($event)"></forecast-bar>

  </div>
</template>






<script>
// Import components
import Map from "Map.vue";
import AnimationCanvas from "AnimationCanvas.vue";
import ForecastBar from "ForecastBar.vue"


export default {
  name: "app-manager",
  created(){

  },
  mounted () {

  },
  data () {
    return {
      
    }
  },
  methods: {
    changeWMSSource: function(infoWMS){
      // Update map
      this.$refs.map.updateSourceWMS(infoWMS);
      let OLMap = this.$refs.map.getOLMap();
      // Update animation
      if (infoWMS.animation)
        this.$refs.animcanvas.defineWMSSource(infoWMS, infoWMS.animation, OLMap);
    },
    changeWMSStyle: function(newStyle){
      // Update Forecastbar
      this.$refs.forecastbar.changeWMSStyle(newStyle);
    }
  },
  components: {
    "ol-map": Map,
    "animation-canvas": AnimationCanvas,
    "forecast-bar": ForecastBar,
  },
  computed: {
  
  }
}


</script>





<style scoped>
#animationCanvas {
  background: none;
}

</style>