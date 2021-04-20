// From https://www.highcharts.com/demo/area-basic
// https://www.highcharts.com/demo/spline-irregular-time

let myChart = undefined;
let dataFromServer = undefined;
let count = 0;

export const startTamany = () => {

  // Load information
  getSizes('http://localhost:8080/sizes', 'data/sizes.json', createApp);

}

// Processes the data and creates the chart
const createApp = (inData) => {

  // Process data
  dataFromServer = inData;

  let species = getUnique(inData, "NomEspecie"); // Useful to create species selector

  let dataSpeciesForGraph = getDataForSpecieX(dataFromServer, species[0])

  // TODO in chart configuration
  /*xAxis: {
      categories: ['1750', '1800', '1850', '1900', '1950', '1999', '2050'],
      tickmarkPlacement: 'on',
      title: {
          enabled: false
      }
  },*/
  // Create Highchart
  myChart = createChart(dataSpeciesForGraph);
  //myChart.addSeries(graphSpecies);
  // Escull la especie button dropdown



  let graph2= {
    name: 'Gamba rosada 2',
    data:
      [null, null, null, null, null, null, null, null, null, null,
            5, 25, 50, 120, 150, 200, 426, 660, 869, 1060,
            1605, 2471, 3322, 4238, 5221, 6129, 7089, 8339, 9399, 10538,
            11643, 13092, 14478, 15915, 17385, 19055, 21205, 23044, 25393, 27935,
            30062, 32049, 33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000,
            37000, 35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
            21000, 20000, 19000, 18000, 18000, 17000, 16000, 15537, 14162, 12787,
            12600, 11400, 5500, 4512, 4502, 4502, 4500, 4500
      ]
  };



  //myChart.showLoading();
  const addSerieBtnEl = myChart.container.querySelector('[aria-label="Show +"]');
  const removeSerieBtnEl = myChart.container.querySelector('[aria-label="Show -"]');
  addSerieBtnEl.addEventListener('click', () => {
    count++;
    dataSpeciesForGraph = getDataForSpecieX(dataFromServer, species[count])
    myChart.addSeries(dataSpeciesForGraph);
  });
  removeSerieBtnEl.addEventListener('click', () => {
    if (myChart.series.length > 3)
      myChart.series[myChart.series.length-1].remove()
  });


  // Create timeSlider
  //var timeSlider = new TimeSliderArcGIS("timeSliderContainer", undefined,undefined,undefined);
  //timeSlider.createTimeSlider();

}





// Create Highchart
const createChart = (serieSpecies) => {

  const hChart = Highcharts.chart('tamanyContainer', {
    chart: {
        type: 'area'
    },
    accessibility: {
        description: 'Image description: blabla'
    },
    title: {
        text:'' //'Freqüència de talles '
    },
    subtitle: {
        text: ''//'per espècie'
    },
    legend: {
        align: 'left',
        verticalAlign: 'top'
        //x: 0,
        //y: 100
    },
    credits: {
        enabled: false
    },
    xAxis: {
        type: 'number'
        //categories: inCategories,
        //tickmarkPlacement: 'on',
        //title: {
        //    enabled: false
        //}
    },
    /*xAxis: {
        allowDecimals: false,
        labels: {
            formatter: function () {
                return this.value + ' cm'; // clean, unformatted number for year
            }
        },
        accessibility: {
            rangeDescription: 'Range: 1cm to 10cm'//'Range: 1940 to 2017.'
        }
    },*/
    yAxis: {
        title: {
            text: 'Nombre d\'individus'//'Nuclear weapon states'
        },
        labels: {
            formatter: function () {
                return this.value;//this.value / 1000 + 'k';
            }
        }
    },
    tooltip: {
        pointFormat: 'Hi ha {point.y} que fan {point.x} cm de l\'espècie {series.name}'//'{series.name} had stockpiled <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
    },
    loading: {
      hideDuration: 500,
      showDuration: 500
    },
    series: [
      {
          name: '+',
          data: [null, null, null, null, null, null, null, null, null]
      }, {
          name: '-',
          data: [null, null, null, null, null, null, null, null, null]
      }, serieSpecies
      ],
    plotOptions: {
        area: {
            pointStart: 1,//1940,
            marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            }
        }
    }
  });

  return hChart;
}

// Get sizes (freqüència talles)
// var results = fetch("http://localhost:8080/sizes").then(r => r.json()).then(r => results = r).catch(e => console.log(e))
const getSizes = async (address, staticUrl, callbackPrepareData) => {
  // Get data
  await fetch(address)
    .then(r => r.json())
    .then(r => {
      let outData = callbackPrepareData(r); // returns prepared data for d3
    })
    .catch(e => {
      if (staticUrl !== undefined){ // Load static file
        console.error("Could not fetch from " + address + ". Error: " + e + ". Trying with static file.");
        getSizes(staticUrl, undefined, callbackPrepareData);
      } else {
        console.error("Could not fetch from " + address + ". Error: " + e + ".");
      }
    });
}


// Prepares the data for the highchart
const getDataForSpecieX = (inData, inSpecies) => {
  // Select the data from a species
  let dataSelSpecies = inData.filter((item) => item.NomEspecie == inSpecies);
  // Categories
  let categories = getUnique(dataSelSpecies, "Talla"); // Important to create X axis
  categories.forEach((cat, index) => categories[index] = parseFloat(cat)); // Transform into numbers
  categories.sort((a, b) => a - b); // Sort
  // Sizes
  let numInd = getNumIndPerCategories(dataSelSpecies, categories);
  // Prepare for highcharts
  let dataHC = [];
  categories.forEach((catItem, index) => dataHC[index] = [catItem, numInd[index]]);
  console.log(dataHC);
  // https://www.highcharts.com/demo/spline-irregular-time
  let graphSpecies = {name: inSpecies, data: dataHC};
  return graphSpecies;
}



// Get unique keys
const getUnique = (inData, inKey) => {
  let uniqueKeys = [];
  // Iterate
  for (let i = 0; i < inData.length; i++){
    let value = inData[i][inKey];
    if (value !== undefined && uniqueKeys.findIndex((item) => item == value) == -1)
      uniqueKeys.push(value);
  }
  return uniqueKeys;
}


// Select data
const selectData = (inData, especie) => {
  let outData = [];

  // Iterate data
  for (let i = 0; i < dataFromServer.length; i++){
    if (inData[i].NomEspecie == especie)
      outData.push(inData[i]);
      /*outData.push({
        num: inData[i].NIndividus,
        size: inData[i].Talla
      });*/
      //outData[inData[i].Talla] = parseInt(inData[i].NIndividus);
  }

  return outData;
}

// Get sizes given the categories
const getNumIndPerCategories = (inData, categories) => {
  let numInd = [];
  inData.forEach(item => {
    // Find the category index
    let catIndex = categories.findIndex((catItem) => catItem == item.Talla);
    numInd[catIndex] = numInd[catIndex] === undefined ? parseFloat(item.NIndividus) : numInd[catIndex] + parseFloat(item.NIndividus);
  })
  return numInd;
}



export default startTamany
