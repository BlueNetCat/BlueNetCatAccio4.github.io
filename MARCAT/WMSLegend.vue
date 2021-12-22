<template>
  <!-- Div container with mouse events -->
  <div id="wms-legend" @mouseover="mouseIsOver = true" @mouseleave="mouseLeftLegend()" @click.prevent="legendClicked($event)">

      <!-- Canvas with legend and interactivity -->
      <canvas @mousemove="updateMousePosition($event)" width="30" height="250" 
          id="wmsLegendCanvas" ref="wmsLegendCanvas" class="img-fluid rounded" title="Click to change the colormap"></canvas>
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
    //this.setWMSLegend('');
  },
  data () {
    return {
      baseWMSLegendURL: "{SOURCEURL}?REQUEST=GetLegendGraphic&LAYER={LAYER}&PALETTE={PALETTE}&COLORSCALERANGE={COLORRANGE}",
      baseGetCapabilitiesURL: "{SOURCEURL}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities",
      mouseIsOver: false,
      mousePosition: {mouseX: 0, mouseY: 0},
      imgEl: undefined,
      legendLoaded: false, // When imgEl is loaded becomes true
      legendValue: '',
      legendUnits: 'm/s',
      range: [0,1],
      styles: [],
      currentURL: "",
    }
  },
  methods: {

    // USER HTML ACTIONS
    // Legend clicked --> change style
    legendClicked: function(event){
      // Circular shfit
      this.styles.push(this.styles.shift(1));
      // Replace in url
      this.currentURL = SourceWMS.setWMSParameter(this.currentURL, 'PALETTE', this.styles[0].split('/')[1]);
      this.imgEl.src = this.currentURL;

      // Emit for changing styles
      this.$emit('legendClicked', this.styles[0])
    },




    // PRIVATE METHODS
    // Get WMS styles
    getWMSStyles: function(infoWMS){
      let capabilitiesURL = this.baseGetCapabilitiesURL.replace('{SOURCEURL}', infoWMS.url);
      // fetch
      fetch(capabilitiesURL).then(response => response.text())
        .then(data => {
          const parser = new DOMParser();
          let xml = parser.parseFromString(data, "application/xml");
          let layers = xml.querySelectorAll('Layer');
          // Iterate through layers
          layers.forEach(ll => {
            // Get layer by its name
            //console.log(ll.firstElementChild.innerHTML);
            if (ll.querySelector("Name").innerHTML == infoWMS.params.LAYERS){
              let layerStyles = ll.querySelectorAll("Style");
              // Store style names
              layerStyles.forEach(ss => {
                if (ss.querySelector("Name").innerHTML.includes("boxfill")) // Only boxfill styles
                  this.styles.push(ss.querySelector("Name").innerHTML)
              });
              //console.log(this.styles);
            }
          })
        })
        .catch(console.error);
    },



    // Draw legend and cursor
    draw: function(canvas){
      if (!this.legendLoaded)
        return;
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
      // Calculate legend value
      let normValue = (canvas.height - event.offsetY)/canvas.height;
      this.legendValue = (normValue * (this.range[1] - this.range[0]) + this.range[0]).toFixed(2);

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
    },





    // PUBLIC METHODS
    setWMSLegend: function(infoWMS){
      // Define Legend WMS URL
      let wmsURL = this.baseWMSLegendURL.replace('{SOURCEURL}', infoWMS.url);
      wmsURL = wmsURL.replace('{LAYER}', infoWMS.params.LAYERS);
      wmsURL = wmsURL.replace('{PALETTE}', infoWMS.params.STYLES.split('/')[1]);
      wmsURL = wmsURL.replace('{COLORRANGE}', infoWMS.params.COLORSCALERANGE[0] + "," + infoWMS.params.COLORSCALERANGE[1]);
      this.currentURL = wmsURL;

      // Define range
      this.range[0] = infoWMS.params.COLORSCALERANGE[0];
      this.range[1] = infoWMS.params.COLORSCALERANGE[1];

      // Define units
      this.legendUnits = infoWMS.params.UNITS;

      // Get styles from WMS service
      this.getWMSStyles(infoWMS);

      // Create image element to paint the legend graphic
      let canvas = this.$refs.wmsLegendCanvas;
      let ctx = canvas.getContext("2d");
      this.imgEl = document.createElement("img");
      this.imgEl.src = wmsURL;
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
      this.imgEl.onload = () =>{
        this.legendLoaded = true;
        this.draw(canvas);
      };
    },



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
  cursor: pointer
}

</style>