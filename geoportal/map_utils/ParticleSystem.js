// Classes defined here:
// ParticleSystem
// Particle
// Source


// Class that manages the particle system
class ParticleSystem {
  // Variables
  numParticles = 10000; // particleCount = Math.round(width * PARTICLE_MULTIPLIER); // According to earth.nullschool
  speedFactor = 0.7;

  // Constructor
  constructor(canvas, source){
    // Canvas
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    // Source
    this.source = source;
    // When source is not visible
    this.source.eastLayer.on('change:visible', (e) => {
      this.source.isReady = myParticles.source.getSourceIsReady();
      if (this.source.isReady)
        this.updateSource();
      this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    })
    // Create particles
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++)
      this.particles[i] = new Particle(this);
  }


  // Functions
  // Update the data coming from the images of layers
  updateSource(){
    // Update data source
    this.source.updateSource();
    // Reposition particles
    for (let i = 0; i < this.numParticles; i++)
      this.particles[i].repositionParticle();
  }

  // Clear canvas
  clearCanvas(){
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
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
      this.valueVec2 = this.particleSystem.source.getValueAtPixel(this.pointVec2, this.valueVec2); // Is rounding the pixel movement, could be done with floats
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
    value = this.particleSystem.source.getValueAtPixel(point, value);

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
    if (this.life == 0 || Math.abs(this.prevPos[0] - this.currentPos[0]) > 10 || Math.abs(this.prevPos[1] - this.currentPos[1]) > 10){ // TODO
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




// Class that defines the source
class Source {
  // Variables
  imgDataEast;
  imgDataNorth;
  imgWidth;
  imgHeight;
  eastLayer;
  northLayer;
  colorRange = [-1, 1];
  // Constructor
  constructor(eastLayer, northLayer){
    this.eastLayer = eastLayer;
    this.northLayer = northLayer;
    this.isReady = false;
  }
  // Functions
  // Update image source coming from WMS
  updateSource(){
    if (!this.getSourceIsReady())
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
  getSourceIsReady(){
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
