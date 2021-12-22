<template>
  <div id="app-animation">

    <!--canvas id="animationCanvas" class ="position-absolute pe-none vh-100 vw-100"></canvas-->
    <!-- Creates a new canvas for each new animation. Calls the function that creates the animation engine -->
    <canvas class ="position-absolute pe-none vh-100 vw-100" :id="anim.id" :ref="el => $createAnimEngine(el)" :key="anim.id" v-for="anim in $animations"></canvas>

    <!-- Tooltip -->
    <div style="position: absolute; margin: 0px; font-size: .875rem">
      <button type="button" class="border-0 p-0"
          style="white-space: nowrap; background: none;"
          :key="anim.id" :id="anim.id" @click.prevent="animClicked" v-for="anim in $animations"><!--  transform: translate(-30px, 0px); -->
        <div class="rounded-pill tooltip-inner" :title=anim.tooltip>{{anim.name}}</div>
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
      $OLMap: undefined
    }
  },
  methods: {
    // USER HTML ACTIONS
    // Animation HTML EL clicked
    // Destroys the animation
    animClicked: function(event) {
      // Get animObj id
      let id = event.currentTarget.id;
      // Find selected animation and index
      let animSel;
      let idxSel;
      this.$data.$animations.forEach((a, idx) => {if (id == a.id) {animSel = a; idxSel = idx}});
      // Destroy animation item
      this.$data.$animations.splice(idxSel, 1);
      // TODO: DESTROY METHOD FOR AnimationEngine --> Remove loop setInterval, Remove event listeners

    },

    // PRIVATE METHODS
    $start: function(infoWMS, animation, OLMap){
      
      // Create new AnimationEngine
      //this.$animEngine = new AnimationEngine(document.getElementById('animationCanvas'), OLMap); // Reference defined in vueParser.js
      //this.$animEngine.setSource(infoWMS.exampleWMSURL, animation);
      
      // Declare OLMap
      this.$OLMap = OLMap;

      // Store animation in array
      this.$data.$animations.push({
        id: infoWMS.name,
        name: infoWMS.name,
        tooltip: infoWMS.tooltip,
        animInfo: animation,
        infoWMS: infoWMS
      });

      // Can only find the canvas once the front-end is updated?
      /*let animEngine = new AnimationEngine(document.getElementById(infoWMS.name), OLMap);
      animEngine.setSource(infoWMS.exampleWMSURL, animation);

      // Define map events for animation
      // Update canvas and positions
      OLMap.on('moveend', () => {
        //this.$animEngine.onMapMoveEnd();
        animEngine.onMapMoveEnd();
      });
      // Clear canvas
      OLMap.on('movestart', () => {
        //this.$animEngine.onMapMoveStart();
        animEngine.onMapMoveStart();
      });*/
    },

    // When a new canvas is created in the :v-for loop, the animation is created
    $createAnimEngine: function(canvas){
      if (canvas == null) // When an element is deleted this function is called too
        return

      // Get the lastest animation element
      let animEl = this.$data.$animations[this.$data.$animations.length -1];

      let animEngine = new AnimationEngine(canvas, this.$OLMap);
      animEngine.setSource(animEl.infoWMS.exampleWMSURL, animEl.animInfo);
      // Assign animEngine to animations array
      animEl.animEngine = animEngine;

      // Define map events for animation
      // Update canvas and positions
      this.$OLMap.on('moveend', () => {
        //this.$animEngine.onMapMoveEnd();
        animEngine.onMapMoveEnd();
      });
      // Clear canvas
      this.$OLMap.on('movestart', () => {
        //this.$animEngine.onMapMoveStart();
        animEngine.onMapMoveStart();
      });
    },


    // PUBLIC METHODS
    // Defines the new source to use
    $defineWMSSource: function(infoWMS, animation, OLMap){ // Called from AppManager.vue
      // If it is the first time, start
      if (!this.$animEngine){
        this.$start(infoWMS, animation, OLMap);
        return;
      }
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

</style>