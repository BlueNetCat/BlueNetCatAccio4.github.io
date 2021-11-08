// Classes defined here:
// ParticleSystem
// Particle
// SourceWMS
// Source


// Class that manages the particle system
class ParticleSystem {
  // Variables
  numParticles = 10000; // particleCount = Math.round(width * PARTICLE_MULTIPLIER); // According to earth.nullschool
  speedFactor = 0.7;

  // Constructor
  constructor(canvas, source, olMap){
    // Canvas
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    // Source
    this.source = source;
    // OL map
    this.map = olMap;
    // When source is not visible
    /*this.source.eastLayer.on('change:visible', (e) => {
      this.source.isReady = myParticles.source.getSourceIsVisible();
      if (this.source.isReady)
        this.updateSource();
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    })*/
    // Create particles
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++)
      this.particles[i] = new Particle(this);
  }


  // Functions
  // Update the data coming from the images of layers
  updateSource(){

    // Update data source
    //this.source.updateSource();
    // Reposition particles
    for (let i = 0; i < this.numParticles; i++)
      this.particles[i].repositionParticle();
  }

  // Clear canvas
  clear(){
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.numParticles; i++)
      this.particles[i].repositionParticle();
  }

  draw(dt) {
    // Trail effect
    // https://codepen.io/Tyriar/pen/BfizE
    this.ctx.fillStyle = 'rgba(255, 255, 255, .9)';
    this.ctx.globalCompositeOperation = "destination-in";
    this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = "source-over";
    // Trail color
    this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';

    // Line style
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    for (let i = 0; i < this.numParticles; i++)
      this.particles[i].draw(dt);
    this.ctx.stroke();
  }

}







// Particle class
class Particle {
  // Variables
  numVerticesPath = 20;
  stepInPixels = 20; // Step (ideally in lat, long, not in pixels)

  // Constructor
  constructor(particleSystem){
    this.particleSystem = particleSystem;
    this.life = 0;
    this.vertices = new Float32Array(this.numVerticesPath*2); // XY values
    this.verticesValue = new Float32Array(this.numVerticesPath); // Wind/Current/Wave
    // Variable for optimization
    this.valueVec2 = [0,0];
    this.pointVec2 = [0,0];
    // Variables for drawing
    this.prevPos = [0,0];
    this.currentPos = [0,0];

  }

  // Functions
  // Reposition particle
  repositionParticle(){
    // Generate starting vertex
    this.generatePoint(this.pointVec2, this.valueVec2);
    // Assign initial position
    this.vertices[0] = this.pointVec2[0];
    this.vertices[1] = this.pointVec2[1];
    // Assign initial value
    if (this.valueVec2[0] !== undefined)
      this.verticesValue[0] = Math.sqrt(this.valueVec2[0]*this.valueVec2[0] + this.valueVec2[1]*this.valueVec2[1]);
    // Do not use this point
    else {
      this.verticesValue[0] = 0;
    }


    // Create vertices path
    for (var i = 1; i < this.numVerticesPath; i++){
      // Make step
      // North is inverted because of pixels (less pixels, more nord)
      this.pointVec2[0] += this.valueVec2[0] * this.stepInPixels || 0; // 0 if there is no data
      this.pointVec2[1] -= this.valueVec2[1] * this.stepInPixels || 0; // 0 if there is no data
      // Assign positions to vertices array
      this.vertices[i*2] = this.pointVec2[0];
      this.vertices[i*2 + 1] = this.pointVec2[1];
      // Get new value according to point
      //this.valueVec2 = this.particleSystem.source.getValueAtPixel(this.pointVec2, this.valueVec2); // Is rounding the pixel movement, could be done with floats
      // Transform pixel to long lat
      let coord = this.particleSystem.map.getCoordinateFromPixel(this.pointVec2);
      this.valueVec2 = this.particleSystem.source.getValueAtLongLat(coord[0], coord[1], this.valueVec2);
      // Assign values
      if (this.valueVec2[0] !== undefined)
        this.verticesValue[i] = Math.sqrt(this.valueVec2[0]*this.valueVec2[0] + this.valueVec2[1]*this.valueVec2[1]);

    }
  }


  // Generate new point
  // Could be done more intelligent, like taking the extent of the layer from openlayers or the WMS service
  generatePoint(point, value, callStackNum){
    // Generate random X,Y number
    point[0] = Math.random() * this.particleSystem.canvas.width;
    point[1] = Math.random() * this.particleSystem.canvas.height;
    // Check if it has data
    // Get value at pixel
    // Transform pixel to long lat
    let coord = this.particleSystem.map.getCoordinateFromPixel(point); // returns [long,lat]?
    // Get value at long lat from source
    //value = this.particleSystem.source.getValueAtPixel(point, value);
    value = this.particleSystem.source.getValueAtLongLat(coord[0], coord[1], value);

    // If pixel does not contain data, throw it again at least 20 times
    if (value[0] == undefined && callStackNum < 20){
      callStackNum = callStackNum || 1;
      generatePoint(point, value, callStackNum +1); // Recursive function
    }
  }


  // Draw / Update
  draw(dt){

    // Update life
    this.life += 0.005 + this.particleSystem.speedFactor * 0.1 * this.verticesValue[Math.round(this.life * this.numVerticesPath)];
    // Reset life
    if (this.life > 1) {
      this.life = 0;
    }
    if (isNaN(this.life))
      this.life = 0;



    // Get exact position
    let prevVertPath = Math.floor(this.life * (this.numVerticesPath-1)); // From 0 to numVerticesPath
    let nextVertPath = Math.ceil(this.life * (this.numVerticesPath-1)); // From 0 to numVerticesPath

    // Interpolation value
    let interpCoeff = (nextVertPath - this.life * (this.numVerticesPath-1));
    this.currentPos[0] = interpCoeff * this.vertices[prevVertPath*2]  +
                (1-interpCoeff) * this.vertices[nextVertPath*2];
    this.currentPos[1] = interpCoeff * this.vertices[prevVertPath*2 + 1]  +
                (1-interpCoeff) * this.vertices[nextVertPath*2 + 1];

    // Reset prevPos in first iteration or when values are too far away
    if (this.life == 0 || Math.abs(this.prevPos[0] - this.currentPos[0]) > this.stepInPixels*1.5 || Math.abs(this.prevPos[1] - this.currentPos[1]) > this.stepInPixels*1.5){ // TODO
      this.prevPos[0] = this.currentPos[0];
      this.prevPos[1] = this.currentPos[1];
    }

    // Draw in canvas
    let ctx = this.particleSystem.ctx;
    //ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    //ctx.lineWidth = 1.5;
    //ctx.beginPath();
    ctx.moveTo(this.prevPos[0], this.prevPos[1])
    ctx.lineTo(this.currentPos[0], this.currentPos[1]);
    //ctx.moveTo(Math.random()*1000, Math.random()*1000)
    //ctx.lineTo(Math.random()*1000, Math.random()*1000);
    //ctx.stroke();

    // Assign prevPos
    this.prevPos[0] = this.currentPos[0];
    this.prevPos[1] = this.currentPos[1];

  }
}





// Class that defines the source from a single WMS image
class SourceWMS {
  // Variables
  imgDataEast;
  imgDataNorth;

  canvasLongLatStep = 0.5;
  colorrange;

  medBBOX = [-18, 36, 30, 45]; // -18.12, 36.3, 45.98, 30.18 from https://resources.marine.copernicus.eu/product-detail/MEDSEA_ANALYSISFORECAST_WAV_006_017/INFORMATION
  catseaBBOX = [-1, 36, 9, 44];


  // Constructor
  constructor(wmsURL, directionLayersName){
   
    // Keep track of images loaded
    this.isReady = false;
    this.loaded = 0;
    //https://thredds.socib.es/thredds/wms/operational_models/oceanographical/hydrodynamics/model_run_aggregation/wmop/wmop_best.ncd?TRANSPARENT=true&FORMAT=image%2Fpng&LAYERS=salt&PROJECTION=EPSG%3A4326&ABOVEMAXCOLOR=extend&BELOWMINCOLOR=extend&STYLES=boxfill%2Frainbow&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&TIME=2021-10-18T15%3A00%3A00.000Z&SRS=EPSG%3A4326&COLORSCALERANGE=26.073683%2C38.58198&BBOX=5.625,33.75,11.25,39.375&WIDTH=256&HEIGHT=256


    // Define WMS image url with a standard size
    // SIZE TODO: could be random size or according to lat-long extension?
    wmsURL = this.setWMSParameter(wmsURL, 'WIDTH', '1024');
    wmsURL = this.setWMSParameter(wmsURL, 'HEIGHT', '1024');

    // BBOX
    this.bbox = this.medBBOX;//this.catseaBBOX;
    wmsURL = this.setWMSParameter(wmsURL, 'BBOX', JSON.stringify(this.bbox).replace('[', '').replace(']', ''));
    // STYLE gray
    let style = 'boxfill/greyscale';
    wmsURL = this.setWMSParameter(wmsURL, 'STYLES', style);

    // PROJECTION EPSG:4326 (lat and long are equally distributed in pixels)
    wmsURL = this.setWMSParameter(wmsURL, 'PROJECTION', 'EPSG:4326');

    // OUT OF RANGE PIXELS &ABOVEMAXCOLOR=extend&BELOWMINCOLOR=extend
    wmsURL = this.setWMSParameter(wmsURL, 'ABOVEMAXCOLOR', 'extend');
    wmsURL = this.setWMSParameter(wmsURL, 'BELOWMINCOLOR', 'extend');

    // COLORRANGE
    this.colorrange = this.getWMSParameter(wmsURL, 'COLORSCALERANGE').split('%2C');
    this.colorrange.map((e) => parseFloat(e));


    // Paint this image streched in a canvas of width and height related to the bounding box
    // Each pixel corresponds to a lat-long
    this.longExtension = Math.abs(this.bbox[0] - this.bbox[1]);
    this.latExtension = Math.abs(this.bbox[2] - this.bbox[3]);

    // Make canvas lat-long relationship
    let canvas = document.createElement('canvas');
    canvas.width = this.longExtension / this.canvasLongLatStep;
    canvas.height = this.latExtension / this.canvasLongLatStep;
    
    let ctx = canvas.getContext('2d');

    for (let i = 0; i<2; i++){
      // LAYER east and north
      wmsURL = this.setWMSParameter(wmsURL, 'LAYERS', directionLayersName[i]);

      // Get WMS image data
      let img = new Image();
      // Image is loaded, paint it in the canvas and get the data
      img.onload = () => {
        // Paint streched WMS image in canvas
        // For more details: https://developer.mozilla.org/es/docs/Web/CSS/image-rendering
        ctx.clearRect(img, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (i == 0)
          this.imgDataEast = ctx.getImageData(0, 0, canvas.width, canvas.height); // Store image data
        else
          this.imgDataNorth = ctx.getImageData(0, 0, canvas.width, canvas.height); // Store image data

        this.loaded++;
        
        // Both layers are loaded
        if (this.loaded == 2){
          this.isReady = true;
          // Callback
          if (this.callbackFunc)
            this.callbackFunc();
        }
      };
      // Start loading image
      img.src = wmsURL;
    }
  }

  // When all tiles from layer are loaded, call a function
  defineOnLoadCallback(callbackOnLoad) {
    this.callbackFunc = callbackOnLoad;
  }


  
  // Set WMS parameter
  setWMSParameter(wmsURL, paramName, paramContent){
    // If parameter does not exist
    if (wmsURL.indexOf(paramName + "=") == -1){
      console.log("Parameter ", paramName, " does not exist in WMS URL");
      return wmsURL + '&' + paramName + '=' + paramContent;
    }

    let currentContent = this.getWMSParameter(wmsURL, paramName);
    //let tmpSTR = wmsURL.substr(wmsURL.indexOf( paramName + "="));
    //let currentContent = tmpSTR.substring(paramName.length + 1, tmpSTR.indexOf('&'));

    return wmsURL.replace(currentContent, paramContent);
  }


  // Get WMS parameter
  getWMSParameter(wmsURL, paramName) {
    // If parameter does not exist
    if (wmsURL.indexOf(paramName + "=") == -1) {
      console.log("Parameter ", paramName, " does not exist in WMS URL");
      return '';
    }

    let tmpSTR = wmsURL.substr(wmsURL.indexOf(paramName + "="));
    return tmpSTR.substring(paramName.length + 1, tmpSTR.indexOf('&'));
  }


  // Get value at Long Lat
  getValueAtLongLat(long, lat, value){
    value[0] = undefined; value[1] = undefined; // Reset value

    // If is outside bbox
    let minLat = Math.min(this.bbox[0], this.bbox[1]);
    let minLong = Math.min(this.bbox[2], this.bbox[3]);
    if (lat < minLat || lat > Math.max(this.bbox[0], this.bbox[1]) || // lat
      long < minLong|| long > Math.max(this.bbox[2], this.bbox[3])) { // long
      return value;
    } 
 
    // Get closest pixel to long lat (nearest-neighbour interpolation)
    let xpixelpos = Math.round( (long - minLong) / canvasLongLatStep);
    let ypixelpos = Math.round( (lat - minLat) / canvasLongLatStep);
    
    // Index
    let index = xpixelpos * this.imgDataEast.width + ypixelpos;
    // Get RGB values (grayscale)
    let redE = imgDataEast[index*4] / 255; //R east
    let redN = imgDataNorth[index * 4] / 255; //R north
    let alphaE = imgDataEast[index*4 + 3] / 255; // Alpha

    // Low alpha
    if (alphaE < 0.1)
      return value;

    // Rescale RGB value to real unit
    value[0] = redN * (this.colorrange[1] - this.colorrange[0]) + this.colorrange[0]; // long
    value[1] = redE * (this.colorrange[1] - this.colorrange[0]) + this.colorrange[0]; // lat
    

    return value;
  }

  // Get value at pixel
  getValueAtPixel(pixel, value){
    // TODO: generate random point uses the animation canvas, not the data canvas
    // So, from generating random pixel from animation canvas, transform to lat long?
    // But when painting and moving the point, it is happening on the pixel, not lat long
    // Generating points should happen in the screen space, not the data space.
    // Animation canvas and data canvas can relate from the lat long, not the pixels. Transformation is needed.
  }
}






// Class that defines the source from Openlayers
class Source {
  // Variables
  imgDataEast;
  imgDataNorth;
  imgWidth;
  imgHeight;
  eastLayer;
  northLayer;
  // Constructor
  constructor(eastLayer, northLayer){
    this.eastLayer = eastLayer;
    this.northLayer = northLayer;
    this.isReady = false;

    this.colorRange = this.eastLayer.getSource().getParams().COLORSCALERANGE;

    this.loading = 0;
    this.loaded = 0;
  }

  // When all tiles from layer are loaded, call a function
  defineOnLoadCallback(callbackOnLoad){
    // Layer events
    this.eastLayer.getSource().on('tileloadend', () => {
      this.loaded++;
      // Only update when all tiles are loaded
      if (this.loading == this.loaded){
        callbackOnLoad();
      }
    });

    // When layer starts loading because of map change
    this.eastLayer.getSource().on('tileloadstart', () => {
      this.loading++;
    });
  }


  // Functions
  // Update image source coming from WMS
  updateSource(){
    if (!this.getSourceIsVisible())
      return
    let tmpCnv = this.eastLayer.getRenderer().getImage();
    this.imgDataEast = tmpCnv.getContext("2d").getImageData(0,0,tmpCnv.width,tmpCnv.height);
    tmpCnv = this.northLayer.getRenderer().getImage();
    this.imgDataNorth = tmpCnv.getContext("2d").getImageData(0,0,tmpCnv.width,tmpCnv.height);
    this.imgWidth = tmpCnv.width;
    this.imgHeight = tmpCnv.height;
    this.isReady = true;
  }

  // Check if the source is available / ready
  getSourceIsVisible(){
    return this.eastLayer.getVisible();
  }

  // Get the pixel value of the two WMS layers
  getValueAtPixel(pixel, value){
    value[0] = undefined; value[1] = undefined; // Reset value
    // Make sure pixel is integer
    pixel[0] = Math.round(pixel[0]);
    pixel[1] = Math.round(pixel[1]);

    // Check if data exists
    if (!this.isReady)
      return value;

    // Get pixel value
    let imgArrayPos = (pixel[0] + pixel[1] * this.imgWidth) * 4; // + 1,2,3 if you want (R)GBA
    let eastValue = this.imgDataEast.data[imgArrayPos];
    let northValue = this.imgDataNorth.data[imgArrayPos];

    // No alpha, no data
    if (this.imgDataEast.data[imgArrayPos + 3] < 26){ // No alpha, no data
      return value;
    }

    // Assign final value
    value[0] = (this.colorRange[1] - this.colorRange[0]) *  eastValue/255 + this.colorRange[0]; // Normalize
    value[1] = (this.colorRange[1] - this.colorRange[0]) *  northValue/255 + this.colorRange[0]; // Normalize

    return value;
  }
}
