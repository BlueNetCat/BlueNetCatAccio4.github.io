import {PieChart} from './PieChart.js';
import * as FilterSpecies from './filter.js'; // TODO HERE


class PieHTMLSection {

	constructor(htmlTitle, htmlPieSection, title, callbackPrepareData){
		// Set the HTML Title
    // Find HTML where title goes

    // Set prepare data callback
    this.prepareData = callbackPrepareData;

    // Find HTML buttons for filter and export
    // htmlTitle.getElement...

    // Add event listeners to filter and export buttons

    // Create variables
    this.staticFilename;
    this.pieChart;
    this.dataFromServer;
	}

  // Load and create pie chart
  createPieChart(address, staticFile, htmlContainer, title, measure, unit){
    console.log("Getting data: " + address +", "+ staticFile +", ");
    // Store static file name
    this.staticFilename = staticFile || this.staticFilename;
  	// Try data from server
  	fetch(address)
  		.then(r => r.json())
  		.then(r => {
        this.dataFromServer = r;
        this.prepareData(r, title);}) // retunrs prepared data
  		.then(outData => {
        this.pieChart = new PieChart(outData);
        this.pieChart.runApp(htmlContainer, outData,d3)})// TODO in PieChart.js: title, measure, unit)})
  		.catch(e => {
  			if (staticFile !== undefined){ // Load static file
  				console.error("Could not fetch from " + address + ". Error: " + e + ". Trying with static file.");
  				createPieChart(staticFile, undefined, htmlContainer, title, measure, unit);
  			} else {
  				console.error("Could not fetch from " + address + ". Error: " + e + ".");
  			}
  		})
  }


  // Export data
  // https://www.codevoila.com/post/30/export-json-data-to-downloadable-file-using-javascript
  exportJSON(event){
    // Data not yet loaded
    if (this.dataFromServer === undefined)
      return;
    // Create
    let dataStr = JSON.stringify(this.dataFromServer);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    let linkElement = event.target;//document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', this.staticFilename + 'json');
    // Now the "a" element has already the data, then remove the function
    linkElement.removeEventListener("onclick", exportJSON);
  }


  // Export data (CSV)
  exportCSV(event){
    // Data not yet loaded
    if (this.dataFromServer === undefined)
      return;
    // Parse JSON to CSV
    let jsonData = this.dataFromServer;
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
    let linkElement = event.target;//document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', this.staticFilename + '.csv');
    // Now the "a" element has already the data, then remove the function
    linkElement.removeEventListener("onclick", exportJSON); // ????
  }


}
