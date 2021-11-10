<template>
  <div id="app-animation">

    <canvas id="animationCanvas" class ="position-absolute pe-none vh-100 vw-100"></canvas>

  </div>
</template>






<script>


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
      });
      // Clear canvas
      olMap.on('movestart', () => {
        this.$animEngine.onMapMoveStart();
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