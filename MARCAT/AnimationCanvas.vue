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
      prevTime: 0,
      canvasEl: document.getElementById('animationCanvas'),
      source: undefined, // new Source(seaVelocityEastLayer, seaVelocityNorthLayer)
      particles: undefined, // new ParticleSystem(this.$animationCanvas, this.source)
    }
  },
  methods: {
    update: function(){
      // Update timer
      let timeNow = performance.now();
      let dt = (timeNow - this.prevTime)/1000; // in seconds;
      this.prevTime = timeNow; 


      // If data is loaded and layer is visible
      this.particles.draw(dt);
      
      // Loop
      setTimeout(this.update, 40); // Frame rate in milliseconds
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