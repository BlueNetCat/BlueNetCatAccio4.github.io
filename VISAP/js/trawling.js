// Needs d3 library

// Import filter module
import * as FilterSpecies from './filter.js'; // TODO HERE
import * as PieChart from './d3PieChart.js';


var originalDataForD3 = undefined;
var filteredDataForD3 = undefined;
var currentData = undefined;
// Init function
export const startTrawling =  (staticDataFile) => {
  'use strict'

  // Expose onclick Button functions from imported html
  // https://stackoverflow.com/questions/44590393/es6-modules-undefined-onclick-function-after-import
  window.compareTrawling = compareTrawling;
  window.closeCompare = closeCompare;
  window.exportJSON = exportJSON;
  window.exportCSV = exportCSV;
  window.filterSpeciesGUI = filterSpeciesGUI;
  window.closeFilterGUI = closeFilterGUI;
  window.deactivateFilter = deactivateFilter;

  var htmlContainer = document.getElementById("piechart");
  // Loads the data and starts the visualizer
  if (originalDataForD3 === undefined)
    //showBiomassData("http://localhost:8080/portBiomass", staticDataFile, htmlContainer, "Pesca per port en Biomassa");
    showBiomassData(staticDataFile, undefined, htmlContainer, "Pesca per port en Biomassa");
  else{
    PieChart.runApp(htmlContainer, originalDataForD3, d3);
    currentData = originalDataForD3;
  }

}

// HTML button events
const compareTrawling = (event) => {
  if (originalDataForD3 === undefined)
    return;
  // Hide compare button
  event.target.style.visibility="hidden";
  // Show close compare button
  document.getElementById("closeCompare").style.visibility = null;

  // Create pie chart
  //var compEl = document.getElementById("comparePie");
  let piechart = document.getElementById("piechart");
  let compEl = piechart.cloneNode(false);
  compEl.id = "comparePie";
  piechart.parentElement.insertBefore(compEl, piechart);
  PieChart.runApp(compEl, currentData, d3);
}

// HTML button events
const closeCompare = (event) => {
  // Hide compare button
  event.target.style.visibility="hidden";

  // Show close compare button
  var cmp = document.getElementById("compareBtn");
  cmp.style.visibility=null;
  //cmp.className ="";// I don't understand why
  // Remove pie chart
  document.getElementById("comparePie").remove();
}

// Filter Species button event
const filterSpeciesGUI = (event) => {

  if (originalDataForD3 === undefined) // Data is not loaded yet
    return;
  // Show GUI
  if (event.target.GUIshow == false || event.target.GUIshow == undefined){ // If filter is not active (should be something related to class)
    // Fetch HTML
    console.log("Fetching html for filter");
    let filename = event.target.getAttribute("w3-include-html") || "filter.html";
    fetch("html/" + filename)
      .then(response => response.text())
      .then(text => {
        // Add/Show HTML to container
        let overlay = document.getElementById("overlay"); // ALERT: might cause problems when more overlays are present
        overlay.innerHTML = text;
        // Set style properties
        let posHTML = overlay.parentElement.getClientRects()[0];
        overlay.style.top = posHTML.top + "px";
        overlay.style.left = posHTML.left  + "px";
        overlay.style.width = posHTML.width  + "px";
        overlay.style.height = posHTML.height  + "px";
        overlay.style.visibility = null;
        // Start List buttons
        FilterSpecies.init();
        // Reload missing icons from new HTML
        feather.replace();
      });

    // Change button state
    event.target.GUIshow = true;
  }
  // Hide GUI
  else {
    console.log("Hiding Filter GUI");
    // Remove/Hide HTML
    document.getElementById("overlay").style.visibility = "hidden";
    // Hide overlay
    event.target.GUIshow = false;
    // Filter and update graphs
    exitFilterGUI();
  }
}


// Close filter GUI and show filtered data
const closeFilterGUI = (event) => {
  event.stopPropagation();
  // When clicked, hide this button
  event.currentTarget.style.visibility = 'hidden';
  // Hide overlay
  document.getElementById("filterSpeciesBtn").GUIshow = false; // ALERT: problem if more than one element with this ID
  // Exit filter GUI
  exitFilterGUI();
}

// Filter and update graphs
const exitFilterGUI = () => {
  // Get selected species
  let selectedSpecies = FilterSpecies.getSelected();
  // If filter exists
  if (selectedSpecies.length != 0){
    // Show filter is on button
    document.getElementById("filterIsOnBtn").style.visibility = null;
    // Preprocess data and re-start graph
    createFilteredGraph(selectedSpecies);
  } else {
    // Hide filter is on button
    document.getElementById("filterIsOnBtn").style.visibility = "hidden";
    // Restart graph with original data
    updateTrawlingChart(originalDataForD3);
  }
}

// Remove active filter
const deactivateFilter = (event) => {
  // Remove/Hide HTML overlay
  document.getElementById("overlay").style.visibility = "hidden";
  event.currentTarget.style.visibility = "hidden";
  // Deselect species
  FilterSpecies.deselectAll();
  // Update graphs to original data
  updateTrawlingChart(originalDataForD3);
}


// Filter data and update graphs
const createFilteredGraph = (selectedSpecies) => {
  // Filter the data
  let filteredDataForD3 = FilterSpecies.filterData(selectedSpecies, originalDataForD3);
  // Assign to pie chart
  updateTrawlingChart(filteredDataForD3);
}


// Update the pie chart with filtered or unfiltered data
const updateTrawlingChart = (inDataForD3) => {
  // Find the pie charts
  let piechart = document.getElementById("piechart");
  let comparePie = document.getElementById("comparePie");

  piechart.innerHTML = "";
  PieChart.runApp(piechart, inDataForD3, d3);
  currentData = inDataForD3;

  if (comparePie !== null){
    comparePie.innerHTML = "";
    PieChart.runApp(comparePie, inDataForD3, d3);
  }
}









// Server address to make a GET, static file in directory, html DIV element, string for title
function showBiomassData(address, staticFile, htmlContainer, title){
  console.log("getting biomass data per port: " + address +", "+ staticFile +", ")
	// Try data from server
	fetch(address)
		.then(r => r.json())
		.then(r => prepDataBiomass(r, title))
		.then(outData => {originalDataForD3 = outData; PieChart.runApp(htmlContainer, outData,d3); currentData = outData;})
		.catch(e => {
			if (staticFile !== undefined){ // Load static file
				console.error("Could not fetch from " + address + ". Error: " + e + ". Trying with static file.");
				showBiomassData(staticFile, undefined, htmlContainer, title);
			} else {
				console.error("Could not fetch from " + address + ". Error: " + e + ".");
			}
		})
}








// Prepare the data from the server-database
var databaseJSONBiomass = null;
function prepDataBiomass(inData, title){
  databaseJSONBiomass = inData;
	const outData = {};
	outData.name = title + ": ";
	outData.children = [];

	// Iterate over all rows
	for (let i = 0; i<inData.length; i++){
		let item = inData[i];
		let zonaPort = item.ZonaPort;
		let nomPort = item.NomPort;
		let nomEspecie = item.NomEspecie;
		let nomComu = item.NomCatala || item.NomEspecie;
		let classCaptura = item.ClassificacioCaptura;
		let biomass = item.Biomassa_Kg_Km2;

		if (biomass < 1) // Do not display items with little biomass
			continue;

		// Create ZonaPort level if it does not exist
		if (outData.children.find(child => child.name === zonaPort) === undefined)
			outData.children.push({"name": zonaPort, "children": [], "species": zonaPort});

		let zonaPortIndex = outData.children.findIndex(child => child.name === zonaPort)
		// Create Port level if it does not exist
		let zonaChilds = outData.children[zonaPortIndex].children;
		if (zonaChilds.find(child => child.name === nomPort) === undefined)
			outData.children[zonaPortIndex].children.push({"name": nomPort, "children": [], "species": nomPort});

		let portIndex = outData.children[zonaPortIndex].children.findIndex(child => child.name === nomPort)
		// Create category level (Comercial, Rebuig, Restes)
		let portChilds = outData.children[zonaPortIndex].children[portIndex].children;
		if (portChilds.find(child => child.name === classCaptura) === undefined)
			outData.children[zonaPortIndex].children[portIndex].children.push({"name": classCaptura, "children": [], "species": classCaptura});

		let classIndex =  outData.children[zonaPortIndex].children[portIndex].children.findIndex(child => child.name === classCaptura)
		// If biomass is very small, put to others
		if ((biomass < 9 && classCaptura == "Comercial") || (biomass < 5 && classCaptura == "Rebuig")){
			let altresIndex =  outData.children[zonaPortIndex].children[portIndex].children[classIndex].children.findIndex(child => child.name === "Altres");
			// Define Altres group
			if (altresIndex == -1) {
				outData.children[zonaPortIndex].children[portIndex].children[classIndex].children.push({"name": "Altres", "children": [], "species": "Altres"});
				altresIndex = outData.children[zonaPortIndex].children[portIndex].children[classIndex].children.length - 1;
			}
			// Assign to Altres
			outData.children[zonaPortIndex].children[portIndex].children[classIndex].children[altresIndex].children.push({"name": nomComu, "value": biomass, "species": nomEspecie});
		}
		// Biomass is bigger
		else {
			// Assign biomass value
			outData.children[zonaPortIndex].children[portIndex].children[classIndex].children.push({"name": nomComu, "value": biomass, "species": nomEspecie});
		}
	}

	return outData;
}



// Export data
// https://www.codevoila.com/post/30/export-json-data-to-downloadable-file-using-javascript
const exportJSON = function(event){
  // Data not yet loaded
  if (databaseJSONBiomass === null)
    return;
  // Create
  let dataStr = JSON.stringify(databaseJSONBiomass);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  let exportFileDefaultName = 'pesca_arrossegament_biomassa.json';
  let linkElement = event.target;//document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  // Now the "a" element has already the data, then remove the function
  linkElement.removeEventListener("onclick", exportJSON);
}

const exportCSV = function(event){
  // Data not yet loaded
  if (databaseJSONBiomass === null)
    return;
  // Parse JSON to CSV
  let jsonData = databaseJSONBiomass;
  let keys = Object.keys(jsonData[0]);

  let columnDelimiter = ',';
  let lineDelimiter = '\n';

  let csvColumnHeader = keys.join(columnDelimiter);
  let csvStr = csvColumnHeader + lineDelimiter;

  jsonData.forEach(item => {
      keys.forEach((key, index) => {
          if( (index > 0) && (index < keys.length) ) {
              csvStr += columnDelimiter;
          }
          csvStr += item[key];
      });
      csvStr += lineDelimiter;
  });

  // Now make downlodable element
  let dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvStr);
  let exportFileDefaultName = 'pesca_arrossegament_biomassa.csv';
  let linkElement = event.target;//document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  // Now the "a" element has already the data, then remove the function
  linkElement.removeEventListener("onclick", exportJSON);
}


export default startTrawling;
