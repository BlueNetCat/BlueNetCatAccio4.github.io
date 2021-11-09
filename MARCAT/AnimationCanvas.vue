<template>
  <div id="app-animation">

    <canvas id="animationCanvas" class ="position-absolute pe-none vh-100 vw-100"></canvas>

  </div>
</template>






<script>
/*
  TODO: 
- Integrate ParticleSystem.js
- Instead of doing a WMS layer, call for a specific WMS image with bigger size.
The resolution of the CMEMS is not so big, so a single WMS image covering the Catalan
Sea might be enough to do the particle animation. It would speed up the process. The
image from the WMS service could be processed individually.

getPixelFromCoordinate should help. Coordinate would come from the actual map and
would be used to get the pixel value from the image. The image would be the 
pixels from a ol-map canvas that does not react to mouse movements.
*/

export default {
  name: "app-animation",
  created(){

  },
  mounted () {

  },
  data () {
    return {
      $animEngine: undefined
    }
  },
  methods: {
    $start: function(wmsURL, directionLayersName){
      this.$animEngine = new AnimationEngine(document.getElementById('animationCanvas'), this.$root.$refs.map.$map); // Reference defined in vueParser.js
      this.$animEngine.setSource(wmsURL, directionLayersName);
      
      // Define map events for animation
      // Update canvas and positions
      let olMap = this.$root.$refs.map.$map;

      olMap.on('moveend', () => {
        this.$animEngine.onMapMoveEnd();
        //this.$animEngine.isReady = true;
      });
      // Clear canvas
      olMap.on('movestart', () => {
        this.$animEngine.onMapMoveStart();
        this.$animEngine.isReady = false;
      });
    },

    // Defines the new source to use
    $defineWMSSource: function(wmsURL, directionLayersName){ // Called from Map.vue
      // If it is the first time, start
      if (!this.$animEngine){
        this.$start(wmsURL, directionLayersName);
        return;
      }
      // Update WMS source
      this.$animEngine.setSource(wmsURL, directionLayersName);
    },

  },
  components: {

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