// Created by Gerard Llorach (gerard.llorach (at) gmail.com), December 2020

// Creates HTML text information
function createHTML(data, graph, index, htmlContainer, simulation){

	// Reset html panel with new info
	function showNewInfo (e){
		var event = e || window.event;
		event.stopPropagation();// Do not hide the overlay

		htmlContainer.innerHtml = "";
		

		// Restart background simulation network
		d3.selectAll("circle")
			.attr("fx", d => delete d.fx)
			.attr("fy", d => delete d.fy)
			.classed("fixed", false);

		// Select new item using id
		let nameId = graph.names[event.srcElement.id].replace(/[^a-zA-Z ]|\s/g, "");
		let d = d3.select("#" + nameId).select("circle").classed("fixed", true); // Select circle
		let n = simulation.nodes()[event.srcElement.id]; // Select from simulation
		// Get width and height
		let width = d3.select("svg").attr("viewBox").split(",")[2];
		let height = d3.select("svg").attr("viewBox").split(",")[3];
		n.fx = width*0.2; // TODO: smooth transitions whn clicking. Center and separate? Other strategies? links?
		n.fy = height*0.15;

		simulation.alpha(0.8).restart();


		// Restart HTML content
		createHTML(data, graph, event.srcElement.id, htmlContainer, simulation);
	}

	// Create button element
	function createButtonElement (text, id){
		
		let b = document.createElement("button");
		b.innerText = text;
		b.id = id;
		b.onclick = (e) => showNewInfo(e);
		htmlContainer.append(b);
		
		return b;
	}
	// Create html element
	function createElement(elType, text){
		let p = document.createElement(elType);
		p.innerText= text;
		htmlContainer.append(p);
	}


	// Reset htmlContainer
	htmlContainer.innerHTML = "";

	let numGrups = data.features.length;

	let centerFullNames = {
		ICM: "Institut de les Ciències del Mar",
		IDAEA: "Institut de Diagnosi Ambiental i Estudis de l'Aigua",
		CEAB: "Centre d'Estudis Avançats de Blanes",
		IRTA: "Institut de Recerca i Tecnologia Agroalimentàries",
		UdG: "Universitat de Girona",
		UPC: "Universitat Politècnica de Catalunya",
		UAB: "Universitat Autònoma de Barcelona",
		UB: "Universitat de Barcelona",
		URV: "Universitat Rovira i Virgili",
		// Other info
		"Generalitat de Catalunya": "Departament d'Empresa i Coneixement. Secretaria d'Universitats i Recerca",
		"Fons FEDER": "Fons Europeu de DEsenvolupament Regional",
		"Fundació Bosch i Gimpera": "FBG",
		"BlueNetCat": "Xarxa d'R+D+I Marítima de Catalunya",
		"CSIC": "Consell Superior d'Investigacions Científiques" 
	};

	// It is a research grup
	if (index < numGrups){ // HARCODED according to how graph is made

		createElement("h2", graph.names[index]);
		createElement("h3", "Centre: ");
		createButtonElement(data.features[index].properties.centro, graph.names.indexOf(data.features[index].properties.centro));
		
		createElement("h3", "IP: ");
		createElement("p", data.features[index].properties.ip);

		createElement("h3", "Investigadors: ");
		createElement("p", data.features[index].properties.res.toString().replace(/,/g, "\n"));

		createElement("h3", "Tècnics: ");
		createElement("p", data.features[index].properties.tech.toString().replace(/,/g, "\n"));
	} 
	// It is an organization
	else {
		let centerName = graph.names[index];
		// Title and institution info
		createElement("h2", centerName);
		createElement("p", centerFullNames[graph.names[index]]);

		// Different data for research institutes and institutions (BlueNetCat, FBG...)
		// Research institutes
		if (index < numGrups + 9){// HARDCODED VALUE FOR NUM CENTERS
			createElement("h3", "Grups: ");
			
			// Iterate all research grups
			for (var i = 0; i < data.features.length; i++){
				if (data.features[i].properties.centro.localeCompare(centerName)== 0){
					createButtonElement("· " + data.features[i].properties.grup, i);
				}
			}
			// Create reference to BlueNetCat
			createElement("h3", "Xarxa: ");
			createButtonElement("BlueNetCat", graph.names.indexOf("BlueNetCat"))

		} 
		// BlueNetCat, CSIC, etc...
		else {
			let instName = graph.names[index];

			switch (instName){
				case "Fons FEDER":
					createElement("p", "Aquest projecte ha estat cofinançat per la Unió Europea a través del Fons Europeu de Desenvolupament Regional (FEDER).");
					createButtonElement("BlueNetCat", graph.names.indexOf("BlueNetCat"));
					break;
				case "Generalitat de Catalunya":
					createElement("p", "Aquest projecte ha estat cofinançat per la Generalitat de Catalunya.");
					createButtonElement("BlueNetCat", graph.names.indexOf("BlueNetCat"));
					break;
				case "Fundació Bosch i Gimpera":
					createElement("h3", "Gerents de la Xarxa: ");
					createElement("p", "· Lourdes Reig Puig");
					createElement("p", "· Pablo Bou Mira");
					createElement("h3", "Treballadors: ");
					createElement("p", "· Gerard Llorach Tó");
					createElement("p", "· Teresa Muñoz");
					createElement("p", "· Alexandre Closa");
					createElement("h3", "Xarxa: ");
					createButtonElement("BlueNetCat", graph.names.indexOf("BlueNetCat"));
					break;
				case "BlueNetCat":
					// Coordinadors
					createElement("h3", "Coordinadors: ");
					createButtonElement("· Fundació Bosch i Gimpera", graph.names.indexOf("Fundació Bosch i Gimpera"));
					createButtonElement("· Institut de les Ciències del Mar", graph.names.indexOf("ICM"));
					// Finançament
					createElement("h3", "Finançament: ");

					createButtonElement ("· Fons FEDER", graph.names.indexOf("Fons FEDER"));
					createButtonElement ("· Generalitat de Catalunya", graph.names.indexOf("Generalitat de Catalunya"));
					
					// Centres d'investigació
					createElement("h3", "Centres d'Investigació: ");
					// Incloure els centres d'investigació
					for (var i = 0; i<9; i++){ // HARDCODED INDEX (referred to )
						createButtonElement ("· "+ graph.names[numGrups + i] + " - " + centerFullNames[graph.names[numGrups + i]], (numGrups + i));
					}
					
					// Àmbits
					createElement("h3", "Àmbits d'actuació: ");
					createElement("p", " a) Pesca (pesca professional i pesca esportiva");
					createElement("p", " b) Aqüicultura");
					createElement("p", " c) Turisme i activitats marítimorecreatives i esportives");
					createElement("p", " d) Enginyeria marítima (costes, onatge, energies renovables, construcció naval i acústica)");
					createElement("p", " e) Biotecnologia marina");
					createElement("p", " f) Conservació de recursos naturals (recursos vius i no vius)");
					createElement("p", " g) Cultura marítima");
					createElement("p", " h) Riscos naturals");
					createElement("p", " i) Canvi climàtic");

					break;
				case "CSIC":
					createElement("h3", "Centres: ");
					createButtonElement ("· ICM", graph.names.indexOf("ICM"));
					createButtonElement ("· CEAB", graph.names.indexOf("CEAB"));
					createButtonElement ("· IDAEA", graph.names.indexOf("IDAEA"));
					break;
			}
		}

	}

}





