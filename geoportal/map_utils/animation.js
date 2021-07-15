


// VARIABLES
// Reusable arrays for optimization
let seaVelVec2 = [undefined, undefined];
let pixelVec2 = [undefined, undefined];
let particles = [];
let canvasParticles;
let ctx;

let numParticles = 1000;
let numVerticesPath = 10;
let vertices = new Float32Array(numParticles*numVerticesPath*2);



// FUNCTIONS
// Get the sea velocity at a given pixel
const getSeaVelAtPixel = (pixel, seaVelVec2) => {
  seaVelVec2[0] = undefined; seaVelVec2[1] = undefined; // Reset seaVelVec2
  // Get value at pixel
  map.forEachLayerAtPixel(pixel, (layer, pixel) => {
    if (layer.getClassName() === 'seaVelocityEast')
      seaVelVec2[0] = (seaVelocityColorRange[1]-seaVelocityColorRange[0]) * pixel[0]/255 + seaVelocityColorRange[0]; // Normalize;
    else if (layer.getClassName() === 'seaVelocityNorth')
      seaVelVec2[1] = (seaVelocityColorRange[1]-seaVelocityColorRange[0]) * pixel[0]/255 + seaVelocityColorRange[0]; // Normalize;

  }, {
    layerFilter: ll => (ll === seaVelocityEastLayer || ll === seaVelocityNorthLayer)
  });
  return seaVelVec2;
}





const createParticles = (inNumParticles) => {
  particles = [];
  numParticles = inNumParticles || 1000;
  //let numVerticesPath = 10;

  for (var i = 0; i< numParticles; i++){
    particles[i] = {
      vertices: new Float32Array(numVerticesPath*2),
      life: 0,
    };
  }
}


const updateParticles = () => {
  //for (var i = 0; i<particles.length; i++){
  for (var i = 0; i< numParticles; i++){

    // Generate starting point
    generatePoint(pixelVec2, seaVelVec2);

    // Assign initial value
    //particles[i].vertices[0] = pixelVec2[0];
    //particles[i].vertices[1] = pixelVec2[1];
    vertices[i*numVerticesPath*2] = pixelVec2[0];
    vertices[i*numVerticesPath*2 + 1] = pixelVec2[1];

    let step = 20;
    //numVerticesPath = particles[i].vertices.length/2;
    // Set line
    for (var j = 1; j < numVerticesPath; j++){
      // Step (ideally in lat, long, not in pixels)
      // North is inverted because of pixels (less pixels, more nord)
      pixelVec2[0]+= seaVelVec2[0] * step || 0; // 0 if there is no data
      pixelVec2[1]-= seaVelVec2[1] * step || 0; // 0 if there is no data
      // Assign values to vertices
      //particles[i].vertices[j*2] = pixelVec2[0];
      //particles[i].vertices[j*2+1] = pixelVec2[1];
      vertices[i*numVerticesPath*2 + j*2] = pixelVec2[0];
      vertices[i*numVerticesPath*2 + j*2 + 1] = pixelVec2[1];
      // Get new sea velocity
      seaVelVec2 = getSeaVelAtPixel(pixelVec2, seaVelVec2);
    }

  }
}

// Find a point with data
const generatePoint = (pixelVec2, seaVelVec2) => {
  // Generate starting pixel
  pixelVec2 = generateRandomPixel(pixelVec2, map.getViewport().offsetWidth, map.getViewport().offsetHeight);
  // Check if it has data
  // Get sea velocity at pixel
  seaVelVec2 = getSeaVelAtPixel(pixelVec2, seaVelVec2);
  // If pixel does not contain data
  if (seaVelVec2[0] === undefined){
    seaVelVec2[0] = 0;
    seaVelVec2[1] = 0;
    //generatePoint(pixelVec2, seaVelVec2);
  }
}

// Generate particles
const generateRandomPixel = (out, viewPortX, viewportY) => {
  // Generate random X,Y number
  out[0] = Math.random() * map.getViewport().offsetWidth;
  out[1] = Math.random() * map.getViewport().offsetHeight;
  // Could be done more intelligent, like taking the extent of the layer from openlayers or the WMS service

  return out;
}






// START
const start = () => {
  canvasParticles = document.getElementById("animationCanvas");
  canvasParticles.width = map.getViewport().offsetWidth;
  canvasParticles.height = map.getViewport().offsetHeight;
  ctx = canvasParticles.getContext("2d");

  createParticles();
  updateParticles();
}


// UPDATE
const update = () => {

  // Update paint particle's path
  //for (var i = 0; i < particles.length; i++){
  for (var i = 0; i< numParticles; i++){
    //particles[i].life++;
    // Paint particle's path
    //numVerticesPath = particles[i].vertices.length/2;
    for (var j = 0; j< numVerticesPath; j++){
      //if (particles[i].vertices[j*2] == -1) // Non existant data
      //  continue;
      if (j == 0){ // first sample
        ctx.beginPath();
        //ctx.moveTo(particles[i].vertices[j*2], particles[i].vertices[j*2+1]);
        ctx.moveTo(vertices[i*numVerticesPath*2 + j*2], vertices[i*numVerticesPath*2 + j*2 + 1]);
      } else if (j != 0 && j < numVerticesPath - 1){ // path samples
        //ctx.lineTo(particles[i].vertices[j*2], particles[i].vertices[j*2+1]);
        ctx.lineTo(vertices[i*numVerticesPath*2 + j*2], vertices[i*numVerticesPath*2 + j*2 + 1]);
      } else if (j == numVerticesPath - 1) { // last sample
        ctx.stroke();
      }
    }
  }

}
