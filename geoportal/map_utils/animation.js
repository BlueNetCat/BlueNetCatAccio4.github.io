




// VARIABLES
let canvasParticles;
let mySource;
let myParticles;

// Application state
let prevTime = 0;




const onMapChange = () => {
  canvasParticles.width = map.getViewport().offsetWidth;
  canvasParticles.height = map.getViewport().offsetHeight;
}



// START
const start = () => {
  canvasParticles = document.getElementById("animationCanvas");

  mySource = new Source(seaVelocityEastLayer, seaVelocityNorthLayer);
  myParticles = new ParticleSystem(canvasParticles, mySource);
  mySource.defineOnLoadCallback(myParticles.updateSource.bind(myParticles));

  // First timer
  prevTime = performance.now();

  // Update canvas size
  onMapChange();

  // Define map events
  // Update canvas and positions
  map.on('moveend', () => {
    //getDataFromLayers();
    onMapChange();
    myParticles.updateSource();
    //update();
  });
  // Clear canvas
  map.on('movestart', () => {
    myParticles.clear();
    myParticles.source.isReady = false;
    //imgDataEast = undefined;
  });


  update();
}


// UPDATE/LOOP/DRAW
const update = () => {
  let timeNow = performance.now();
  let dt = (timeNow - prevTime)/1000; // in seconds

  // If data is loaded and layer is visible
  if (myParticles.source)
    if (myParticles.source.isReady)
      myParticles.draw(dt);


  prevTime = timeNow; // Update Timer
  //window.requestAnimationFrame(update);
  setTimeout(update, 40); // Frame rate in milliseconds

}


/*

// TODO: get previous days images
// TODO: get data from one image, instead of tiles?
https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d
?SERVICE=WMS&VERSION=1.3.0&
REQUEST=GetMap&FORMAT=image%2Fpng&
TRANSPARENT=true&LAYERS=sea_water_velocity&
COLORSCALERANGE=-1%2C1
&STYLES=boxfill%2Foccam&
WIDTH=256&HEIGHT=256&
CRS=EPSG%3A
3857&
BBOX=
-41581.7434
%2C
4404769.4284
%2C
968610.0224
%2C
5427395.1495
&TIME=2021-06-15T12
%253A
00
%253A
00.000Z




*/
