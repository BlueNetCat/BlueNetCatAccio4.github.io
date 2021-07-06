/*
 Creates HTML for dynamic elements
*/



// Creates HTML for layers
const createLayersHTML = () => {


  // Check bootstrap offcanvas (does the same)
  // https://getbootstrap.com/docs/5.0/components/offcanvas/
  let el = document.getElementById("menu-right");

  // Open pop-up
  el.classList.contains("menu-open") ? el.classList.remove("menu-open") : el.classList.add("menu-open");
  // Create HTML content according to layers
  let str = '<div class="container overflow-auto">';
  // Header
  str += '<div class="offcanvas-header">'+
    '<h5 class="offcanvas-title">'+ "Layers" +'</h5>' +
    '<button type="button" class="btn-close" '+
      ' onclick="document.getElementById(\'menu-right\').classList.remove(\'menu-open\')" aria-label="Close"></button>'+
    '</div>'

  Object.keys(GUIMapLayers).forEach(key => {
    //GUIMapLayers[key];
    str += '<div class="row d-flex"><button class="col layer layervisible">' + key + "</button></div>";
    //str += '<div class="row d-flex"><div class="col">' + key + "</div></div>";
  })

  str += '<div>'; // container
  el.innerHTML = str;

  // Button events
  // Iterate buttons
  el.querySelectorAll('button.col').forEach(layerEl => {
    // Add click event
    layerEl.onclick = () => {
      GUIMapLayers[layerEl.innerText]["ol-layers"].forEach( olLayer => olLayer.setVisible(!olLayer.getVisible())); // Change visibility
      layerEl.classList.contains("layervisible") ? layerEl.classList.remove("layervisible") : layerEl.classList.add("layervisible"); // Change style
    }
  })
}



















// Creates html for GEOJSON feature
const createFeatureInnerHTML = (props, el, layerName) => {
  //console.log(props);
  let innerHTML = "<div class='container'>";
  // Header
  innerHTML +=
      '<div class="offcanvas-header">'+
        '<h5 class="offcanvas-title">'+ layerName +'</h5>'+
        '<button type="button" class="btn-close" onclick="document.getElementById(\'menu-bottom\').classList.remove(\'menu-open\')" aria-label="Close"></button>'+
      '</div>'

  // Content
  innerHTML += "<div class='row row-cols-auto'>";

  let keys = Object.keys(props);
  keys.forEach(key => {
    innerHTML += "<div class='col'><strong>" + key +"</strong>: ";
    innerHTML += processContent(props[key]);
    innerHTML += "</div>"; // col
  });

  innerHTML += "</div></div>"; // row, container
  el.innerHTML = innerHTML;
}


// Process keys of the properties of the GeoJSON
const processContent = (content) => {
  let str = "";
  // Check if it is a hyperlink
  if (typeof content === 'string')
    str = content.substr(0,4) == "http" ? createLinkHTML(content) : content;
  // It is an array
  else if (Array.isArray(content) || typeof content === 'number')
    str = content;
  // It is an object
  else if (typeof content === 'object' && content !== null){
    str = "<ul>";
    Object.keys(content).forEach(subkey => {
      str += "<li>" + subkey +": ";
      str += processContent(content[subkey]);
      str += "</li>";
    });
    str += "</ul>";
  }
  // TODO: if source does not exist, take it from geojson file with fetch and layer.get("source").getUrl()
  return str;
}

// Creates HTML string for link
const createLinkHTML = (content, text) => "<a href='" + content + "' target='_blank' rel='noopener noreferrer'>" + (text || content) + "</a>";
