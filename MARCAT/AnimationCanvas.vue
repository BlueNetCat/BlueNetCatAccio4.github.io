<template>
  <div id="app-animation" ref="app-animation">

    <!--canvas id="animationCanvas" class ="position-absolute pe-none vh-100 vw-100"></canvas-->
    <!-- Creates a new canvas for each new animation. Calls the function that creates the animation engine -->
    <!--canvas class ="position-absolute pe-none vh-100 vw-100" :id="anim.id" :ref="el => $createAnimEngine(el)" :key="anim.id" v-for="anim in $animations"></canvas-->

    <!-- Tooltip -->
    <div style="position: absolute; margin: 0px; font-size: .875rem">
      <button type="button" class="btn btn-dark rounded-pill"
        style="font-size: smaller"
          :key="anim.id" :id="anim.id" :title=anim.tooltip @click.prevent="animClicked" v-for="anim in $animations">
      <!--button type="button" class="border-0 p-0"
        style="white-space: nowrap; background: none;"
          :key="anim.id" :id="anim.id" @click.prevent="animClicked" v-for="anim in $animations"-->
        <!--div class="rounded-pill tooltip-inner ps-3" :title=anim.tooltip-->
          {{anim.name}}
          <button type="button" class="btn-close btn-close-white" style="font-size: smaller" aria-label="Close" @click.stop ="closeAnimClicked"></button>
        <!--/div-->
      </button>
    </div>

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
      $animEngine: undefined,
      $animations: [],
      $OLMap: undefined,
    }
  },
  methods: {
    // USER HTML ACTIONS
    // Animation HTML EL clicked
    // Hides/unhides canvas element
    animClicked: function(event) {
      // Get animObj id
      let id = event.currentTarget.id;
      // Find animEl
      let animSel;
      this.$data.$animations.forEach(a => {if (id == a.id) animSel = a;});
      animSel.canvas.hidden = !animSel.canvas.hidden;
      // Change button class
      if (animSel.canvas.hidden){ // Add opacity class
        event.currentTarget.className += ' opacity-75';
      } else // Remove class
        event.currentTarget.className = event.currentTarget.className.replace('opacity-75', '');
      console.log("OPACITY CHANGED!")
    },
    // Closed animation clicked. Destroys the animation
    closeAnimClicked: function(event) {
      console.log("closeAnimClicked")
      // Get id
      let id = event.currentTarget.id;
      // Destroy animation
      this.$destroyAnim(id);
      // Update visibility of remaining buttons

    },





    // PRIVATE METHODS
    $start: function(infoWMS, animation, OLMap){
      
      // Declare OLMap
      this.$OLMap = OLMap;

      // Create canvas
      let canvas = document.createElement("canvas");
      canvas.className = "position-absolute pe-none vh-100 vw-100";
      canvas.id = infoWMS.name;

      // Append to HTML DOM
      this.$refs["app-animation"].appendChild(canvas);

      // Create animation engine
      let animEngine = new AnimationEngine(canvas, this.$OLMap, infoWMS.exampleWMSURL, animation);

      // Define map events for animation
      // Update canvas and positions
      this.$OLMap.on('moveend', animEngine.onMapMoveEnd);
      // Clear canvas
      this.$OLMap.on('movestart', animEngine.onMapMoveStart);

      // Store animation in array
      this.$data.$animations.push({
        id: infoWMS.name,
        name: infoWMS.name,
        tooltip: infoWMS.tooltip,
        animInfo: animation,
        infoWMS: infoWMS,
        animEngine: animEngine,
        canvas: canvas
      });

    },

    // Destroys the animation clicked
    $destroyAnim: function(id){
      // Find selected animation and index
      let animSel;
      let idxSel;
      this.$data.$animations.forEach((a, idx) => {if (id == a.id) {animSel = a; idxSel = idx}});
      // Destroy animation item
      let animObj = this.$data.$animations.splice(idxSel, 1)[0]; // The animation will stop because the canvas has no parent element
      // TODO: GC (reuse anim object?)
      // Remove canvas from HTML DOM
      animObj.canvas.remove();
      // Remove event listeners
      let animEng = animObj.animEngine;
      console.log("Deleted "+ animObj.id + ". Canvas parent element: " + animEng.canvasParticles.parentElement)
      animEng.map.un('moveend', animEng.onMapMoveStart);
      animEng.map.un('movestart', animEng.onMapMoveEnd);
      animEng.destroyer();
      animEng = null;
    },





    // PUBLIC METHODS
    // Defines the new source to use
    $defineWMSSource: function(infoWMS, animation, OLMap){ // Called from AppManager.vue
      // If it is the first time, start
      if (!this.$animEngine){
        this.$start(infoWMS, animation, OLMap);
        return;
      }
      console.log("SHOULD NEVER GET HERE");
      // Update WMS source
      this.$animEngine.setSource(infoWMS.exampleWMSURL, animation);
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

.opacity-75{
  opacity: 0.75;
}

</style>