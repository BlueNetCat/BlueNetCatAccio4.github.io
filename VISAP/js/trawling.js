// Needs d3 library

// Import modules
import {PieHTMLSection} from './PieHTMLSection.js';

// TODO:  MAKE EACH BYYEAR BYPORT CLASSES?

// Init function
export const startTrawling =  (staticDataFile) => {

  // Create PieChart Section
  // Get title and pie divs
  let htmlTitleEl = document.getElementById("biomassPortHTMLTitleSection");
  let htmlPieSectionEl = document.getElementById("biomassPortHTMLPieSection");
  let title = "Captura en biomassa per port";
  const biomassPortSection = new PieHTMLSection(htmlTitleEl, htmlPieSectionEl, title);
  // Fetch data and create piechart
  biomassPortSection.createPieChart('data/pesca_arrossegament_port_biomassa.json', undefined, prepDataPortBiomass, 'Pesca per ports', 'Biomassa', 'kg / km2'); // (address, staticFile, callbackPrepareData, title, measure, unit)


  // TODO: create prep data for year-season
  // Create PieChart Section
  // Get title and pie divs
  htmlTitleEl = document.getElementById("biomassYearHTMLTitleSection");
  htmlPieSectionEl = document.getElementById("biomassYearHTMLPieSection");
  title = "Captura en biomassa per estació";
  const biomassYearSection = new PieHTMLSection(htmlTitleEl, htmlPieSectionEl, title);
  // Fetch data and create piechart
  biomassYearSection.createPieChart('data/pesca_arrossegament_any_biomassa.json', undefined, prepDataYearBiomass, 'Pesca per estació', 'Biomassa', 'kg / km2'); // (address, staticFile, callbackPrepareData, title, measure, unit)

}




// Prepare the data from the server-database
function prepDataPortBiomass(inData){

	const outData = {};
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


// Prepare the data from the server-database
function prepDataYearBiomass(inData){

  const outData = {};
	outData.children = [];

  // Iterate over all rows
	for (let i = 0; i<inData.length; i++){
    let item = inData[i];

    let any = item.Any;
		let estacio = item.Estacio;
		let nomEspecie = item.NomEspecie;
		let nomComu = item.NomCatala || item.NomEspecie;
		let classCaptura = item.ClassificacioCaptura;
		let biomass = item.Biomassa_Kg_Km2;

		if (biomass < 1) // Do not display items with little biomass
			continue;

    // Create Year level if it does not exist
		if (outData.children.find(child => child.name === any) === undefined)
			outData.children.push({"name": any, "children": [], "species": any});

		let anyIndex = outData.children.findIndex(child => child.name === any)
		// Create Estacio level if it does not exist
    let anyChilds = outData.children[anyIndex].children;
		if (anyChilds.find(child => child.name === estacio) === undefined)
			outData.children[anyIndex].children.push({"name": estacio, "children": [], "species": estacio});

		let estacioIndex = outData.children[anyIndex].children.findIndex(child => child.name === estacio)// TODO HERE NOW
		// Create category level (Comercial, Rebuig, Restes)
		let estacioChilds = outData.children[anyIndex].children[estacioIndex].children;
		if (estacioChilds.find(child => child.name === classCaptura) === undefined)
			outData.children[anyIndex].children[estacioIndex].children.push({"name": classCaptura, "children": [], "species": classCaptura});

		let classIndex =  outData.children[anyIndex].children[estacioIndex].children.findIndex(child => child.name === classCaptura)
		// If biomass is very small, put to others
		if ((biomass < 9 && classCaptura == "Comercial") || (biomass < 5 && classCaptura == "Rebuig")){
			let altresIndex =  outData.children[anyIndex].children[estacioIndex].children[classIndex].children.findIndex(child => child.name === "Altres");
			// Define Altres group
			if (altresIndex == -1) {
				outData.children[anyIndex].children[estacioIndex].children[classIndex].children.push({"name": "Altres", "children": [], "species": "Altres"});
				altresIndex = outData.children[anyIndex].children[estacioIndex].children[classIndex].children.length - 1;
			}
			// Assign to Altres
			outData.children[anyIndex].children[estacioIndex].children[classIndex].children[altresIndex].children.push({"name": nomComu, "value": biomass, "species": nomEspecie});
		}
		// Biomass is bigger
		else {
			// Assign biomass value
			outData.children[anyIndex].children[estacioIndex].children[classIndex].children.push({"name": nomComu, "value": biomass, "species": nomEspecie});
		}
  }

  return outData;
}



export default startTrawling;
