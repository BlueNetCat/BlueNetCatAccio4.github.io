<template>
  <!-- Div container with mouse events -->
  <div id="wms-legend" @mouseover="mouseIsOver = true" @mouseleave="mouseLeftLegend()">
    <!-- Canvas with legend and interactivity -->
    <canvas @mousemove="updateMousePosition($event)" width="30" height="250" 
        id="wmsLegendCanvas" ref="wmsLegendCanvas" class="img-fluid rounded"></canvas>
    <!-- Tooltip -->
    <div v-if=mouseIsOver class="tooltip fade show bs-tooltip-start" id="legendTooltip"
        style="position: absolute; white-space: nowrap; inset: 0px 0px auto auto; margin: 0px;"><!--  transform: translate(-30px, 0px); -->
      <div class="tooltip-arrow" style="position: absolute; top: 0px; transform: translate(0px, 8px); white-space: nowrap;"></div>
      <div class="tooltip-inner">{{legendValue}} {{legendUnits}}</div>
    </div>

  </div>
</template>






<script>
// Receives a WMS URL and we get the legend?
// // LEGEND
// ADD LEGEND. style is then transfered to legend.
// https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?REQUEST=GetLegendGraphic&LAYER=sea_water_velocity&PALETTE=rainbow&COLORSCALERANGE=-0.5354787%2C0.92136043
// WMS Parameters
// REQUEST
// LAYER
// PALETTE (STYLE)
// COLORSCALERANGE

// Functionalities
// When click, change style? --> propagate to Map.vue and to ForecastBar.vue
// Change range? --> bootstrap modal --> propagate to Map.vue and ForecastBar.vue
// When on map, show tooltip on legend with value? --> function called from outside, with RGB as input?

export default {
  name: "wms-legend",
  created(){

  },
  mounted () {
    this.setWMSLegend('');
  },
  data () {
    return {
      baseWMSLegendURL: "https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?REQUEST=GetLegendGraphic&LAYER=sea_water_velocity&PALETTE=rainbow&COLORSCALERANGE=0%2C2",
      mouseIsOver: false,
      mousePosition: {mouseX: 0, mouseY: 0},
      imgEl: undefined,
      legendValue: '',
      legendUnits: 'm/s',
    }
  },
  methods: {
      
    setWMSLegend: function(wmsURL){
      wmsURL = "https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?REQUEST=GetLegendGraphic&LAYER=sea_water_velocity&PALETTE=rainbow&COLORSCALERANGE=0%2C2";

      let canvas = this.$refs.wmsLegendCanvas;
      let ctx = canvas.getContext("2d");
      this.imgEl = document.createElement("img");
      this.imgEl.src = wmsURL;
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      this.imgEl.onload = () =>{
        this.draw(canvas);
      };
    },

    draw: function(canvas){
      // Context
      let ctx = canvas.getContext("2d");
      // Global composite
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
      ctx.globalCompositeOperation = "source-destination";
      // Top-left: 5 height, 2 width
      // Bottom-rigth: 257 height, 25
      // Size: 24x253
      ctx.drawImage(this.imgEl, 2, 5, 24, 253, 0, 0, canvas.width, canvas.height)
      // 25%, 50%, 75% lines
      ctx.strokeStyle = 'rgba(0,0,0,255)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height*0.25);
      ctx.lineTo(canvas.width, canvas.height*0.25);
      ctx.moveTo(0, canvas.height*0.5);
      ctx.lineTo(canvas.width, canvas.height*0.5);
      ctx.moveTo(0, canvas.height*0.75);
      ctx.lineTo(canvas.width, canvas.height*0.75);
      ctx.stroke();

      if (this.mouseIsOver){
        ctx.strokeStyle = 'rgba(0,0,0,255)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, this.mousePosition.mouseY);
        ctx.lineTo(canvas.width, this.mousePosition.mouseY);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,255)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, this.mousePosition.mouseY);
        ctx.lineTo(canvas.width, this.mousePosition.mouseY);
        ctx.lineTo(0, this.mousePosition.mouseY);
        ctx.lineTo(canvas.width, this.mousePosition.mouseY);
        ctx.stroke();
      }
    },

    // Update mouse Position (only happens when inside the canvas)
    updateMousePosition: function(event){
      this.mousePosition.mouseX = event.offsetX;
      this.mousePosition.mouseY = event.offsetY;

      let canvas = this.$refs.wmsLegendCanvas;

      this.legendValue = ((canvas.height - event.offsetY)/canvas.height).toString();

      let legendTooltipEl = document.getElementById("legendTooltip");
      legendTooltipEl.style.transform = "translate(-"+ canvas.width +"px, "+ (event.offsetY-12) +"px)";

      this.draw(canvas);
    },

    // TODO:
    // A function that receives a value (RGB maybe?) and maps it in the legend.
    // When the mouse is moving on the map, the legend should show the value.


    mouseLeftLegend: function(){
      this.mouseIsOver = false;
      this.draw(this.$refs.wmsLegendCanvas);
    }

  },
  components: {

  },
  computed: {
  
  }
}


</script>





<style scoped>

#wmsLegendCanvas:hover {
  border: 1px solid #000000!important;
}

</style>