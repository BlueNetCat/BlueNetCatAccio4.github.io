


// VARIABLES
// Reusable arrays for optimization
let seaVelVec2 = [0,0];
let pixelVec2 = [0,0];
// Canvas
let canvasParticles;
let ctx;
// Particle animation
let numParticles = 10000;
let numVerticesPath = 20;
let vertices = new Float32Array(numParticles*numVerticesPath*2);
let lifeParticle = new Float32Array(numParticles);
let velocityVertices = new Float32Array(numParticles*numVerticesPath);
let speedFactor = 0.5;

// Data
let imgDataEast;
let imgDataNorth;
let imgWidth;
let imgHeight;
// Application state
let loading = 0;
let loaded = 0;
let prevTime = 0;

// When layer has been loaded, update image
seaVelocityEastLayer.getSource().on('tileloadend', function () {
  loaded++;
  // Only update when all tiles are loaded
  if (loading == loaded){
    getDataFromLayers();
  }
});
seaVelocityNorthLayer.getSource().on('tileloadend', function () {
  loaded++;
  // Only update when all tiles are loaded
  if (loading == loaded){
    getDataFromLayers();
  }
});
// When layer starts loading because of map change
seaVelocityEastLayer.getSource().on('tileloadstart', function () {
  //imgDataEast = undefined;
  loading++;
});
seaVelocityNorthLayer.getSource().on('tileloadstart', function () {
  loading++;
  //imgDataNorth = undefined;
});
// Get the data from layers once loading has finished
const getDataFromLayers = () => {
  let tmpCnv = seaVelocityEastLayer.getRenderer().getImage();
  imgDataEast = tmpCnv.getContext("2d").getImageData(0,0,tmpCnv.width,tmpCnv.height);
  tmpCnv = seaVelocityNorthLayer.getRenderer().getImage();
  imgDataNorth = tmpCnv.getContext("2d").getImageData(0,0,tmpCnv.width,tmpCnv.height);
  imgWidth = tmpCnv.width;
  imgHeight = tmpCnv.height;
  repositionParticles();
  update();
}




// FUNCTIONS
// Get the sea velocity at a given pixel
const getSeaVelAtPixel = (pixel, seaVelVec2) => {
  seaVelVec2[0] = undefined; seaVelVec2[1] = undefined; // Reset seaVelVec2
  pixel[0] = Math.round(pixel[0]);
  pixel[1] = Math.round(pixel[1]);

  if (!imgDataEast || !imgDataNorth){
    //console.log("data not loaded");
    return seaVelVec2;
  }

  let imgArrayPos = (pixel[0] + pixel[1]*imgWidth) * 4; // + 1,2,3 if you want (R)GBA
  let eastValue = imgDataEast.data[imgArrayPos];
  let northValue = imgDataNorth.data[imgArrayPos];

  if (imgDataEast.data[imgArrayPos + 3] == 0){ // No alpha, no data
    return seaVelVec2;
  }

  // Assign to vector
  seaVelVec2[0] = (seaVelocityColorRange[1]-seaVelocityColorRange[0]) * eastValue/255 + seaVelocityColorRange[0]; // Normalize;
  seaVelVec2[1] = (seaVelocityColorRange[1]-seaVelocityColorRange[0]) * northValue/255 + seaVelocityColorRange[0]; // Normalize;

  return seaVelVec2;

}






// Repositions all particles and paths
const repositionParticles = () => {
  //for (var i = 0; i<particles.length; i++){
  for (var i = 0; i< numParticles; i++){

    // Generate starting point
    generatePoint(pixelVec2, seaVelVec2);

    // Assign initial value
    vertices[i*numVerticesPath*2] = pixelVec2[0];
    vertices[i*numVerticesPath*2 + 1] = pixelVec2[1];
    // Velocity
    if (seaVelVec2[0] !== undefined)
      velocityVertices[i*numVerticesPath] = Math.sqrt(seaVelVec2[0]*seaVelVec2[0] + seaVelVec2[1]*seaVelVec2[1]);


    let step = 20;
    // Set line
    for (var j = 1; j < numVerticesPath; j++){
      // Step (ideally in lat, long, not in pixels)
      // North is inverted because of pixels (less pixels, more nord)
      pixelVec2[0]+= seaVelVec2[0] * step || 0; // 0 if there is no data
      pixelVec2[1]-= seaVelVec2[1] * step || 0; // 0 if there is no data
      // Assign values to vertices
      vertices[i*numVerticesPath*2 + j*2] = pixelVec2[0];
      vertices[i*numVerticesPath*2 + j*2 + 1] = pixelVec2[1];
      // Get new sea velocity
      seaVelVec2 = getSeaVelAtPixel(pixelVec2, seaVelVec2);
      // Assign velocity
      if (seaVelVec2[0] !== undefined)
        velocityVertices[i*numVerticesPath + j] = Math.sqrt(seaVelVec2[0]*seaVelVec2[0] + seaVelVec2[1]*seaVelVec2[1]);
    }

  }
}

// Find a point with data
const generatePoint = (pixelVec2, seaVelVec2, callStackNum) => {
  // Generate starting pixel
  pixelVec2 = generateRandomPixel(pixelVec2, map.getViewport().offsetWidth, map.getViewport().offsetHeight);
  // Check if it has data
  // Get sea velocity at pixel
  seaVelVec2 = getSeaVelAtPixel(pixelVec2, seaVelVec2);
  // If pixel does not contain data
  if (seaVelVec2[0] === undefined && callStackNum < 20){
    callStackNum = callStackNum || 1;
    generatePoint(pixelVec2, seaVelVec2, callStackNum); // Recursive function
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


const onMapChange = () => {

  canvasParticles.width = map.getViewport().offsetWidth;
  canvasParticles.height = map.getViewport().offsetHeight;

}





// START
const start = () => {
  canvasParticles = document.getElementById("animationCanvas");
  ctx = canvasParticles.getContext("2d");

  prevTime = performance.now();

  // Update particles and canvas size
  onMapChange();

  // Define map events
  // Update canvas and positions
  map.on('moveend', () => {
    getDataFromLayers();
    onMapChange();
  });
  // Clear canvas
  map.on('movestart', () => {
    ctx.clearRect(0,0, canvasParticles.width, canvasParticles.height);
    imgDataEast = undefined;
  });

}


// UPDATE/LOOP/DRAW
let prevPosX = [];
let prevPosY = [];
const update = () => {
  // Time differential
  let timeNow = performance.now();
  let dt = (timeNow - prevTime)/1000; // in seconds

  // If data is loading
  if (imgDataEast === undefined || imgDataNorth === undefined)
    return;
  // If data layer is not visible
  if (!seaVelocityEastLayer.getVisible()){
    ctx.clearRect(0,0, canvasParticles.width, canvasParticles.height);
    return;
  }

  // Clear rect
  //ctx.clearRect(0,0, canvasParticles.width, canvasParticles.height);


  // Trail effect
  // https://codepen.io/Tyriar/pen/BfizE
  ctx.fillStyle = 'rgba(255, 255, 255, .9)';
  ctx.globalCompositeOperation = "destination-in";
  ctx.fillRect(0,0, canvasParticles.width, canvasParticles.height);
  ctx.globalCompositeOperation = "source-over";
  // Trail color
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';

  // Update paint particle's path
  for (var i = 0; i< numParticles; i++){
    // Draw trail
    // Get previous point in path
    lifePoint = lifeParticle[i];
    // Update life
    lifeParticle[i] += 0.005 + speedFactor*0.1*velocityVertices[i * numVerticesPath + Math.round(lifePoint*numVerticesPath)]; // Decide life increase according to velocity

    if (lifeParticle[i] > 1){
      lifeParticle[i] = 0;
    }
    // Get exact position
    let prevVertPath = Math.floor(lifeParticle[i]*(numVerticesPath-1)); // From 0 to numVerticesPath
    let nextVertPath = Math.ceil(lifeParticle[i]*(numVerticesPath-1)); // From 0 to numVerticesPath

    // Interpolation value
    let interpCoeff = (nextVertPath - lifeParticle[i]*(numVerticesPath-1));
    let xPos = interpCoeff * vertices[i*numVerticesPath*2 + prevVertPath*2]  +
                (1-interpCoeff) * vertices[i*numVerticesPath*2 + nextVertPath*2];
    let yPos = interpCoeff * vertices[i*numVerticesPath*2 + prevVertPath*2 + 1]  +
                (1-interpCoeff) * vertices[i*numVerticesPath*2 + nextVertPath*2 + 1];

    // First iteration
    if (lifeParticle[i] == 0){
      prevPosX[i] = xPos;
      prevPosY[i] = yPos;
    }
    // Prevent wrong prevPos due to late event callbacks
    if (Math.abs(prevPosX[i] - xPos) > 20 || Math.abs(prevPosY[i] - yPos) > 20){
      prevPosX[i] = xPos;
      prevPosY[i] = yPos;
    }


    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(prevPosX[i], prevPosY[i])
    ctx.lineTo(xPos, yPos);
    ctx.stroke();


    prevPosX[i] = xPos;
    prevPosY[i] = yPos;
/*
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.moveTo(xPos, yPos);
    ctx.arc(xPos, yPos, 2, 0, Math.PI*2, true);
    ctx.fill();
*/



    // Paint particle's path
    /*for (var j = 0; j< numVerticesPath; j++){

      // Full line
      if (j == 0){ // first sample
        ctx.beginPath();
        ctx.moveTo(vertices[i*numVerticesPath*2 + j*2], vertices[i*numVerticesPath*2 + j*2 + 1]);
      } else if (j != 0 && j < numVerticesPath - 1){ // path samples
        ctx.lineTo(vertices[i*numVerticesPath*2 + j*2], vertices[i*numVerticesPath*2 + j*2 + 1]);
      } else if (j == numVerticesPath - 1) { // last sample
        ctx.stroke();
      }
    }*/
  }


  // Update timer
  prevTime = timeNow;
  window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);
