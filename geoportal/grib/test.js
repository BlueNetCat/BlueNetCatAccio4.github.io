const grib2 = require('./node_modules/grib2-simple/index.js')
const fs = require('fs-extra')
const https = require('https')
const gg = require('./grib2.js');


async function test() {

    // load file content
  const fileContentBuffer = await fs.readFile('./COSMODE_single_level_elements_PS_2018020500_000.grib2')

  // parse file content (this is a synchronous operation)
  // the result is an array, as multiple grib2 files can be concatenated to a single
  const grib2Array = grib2(fileContentBuffer)

  // get value at predefined coordinate
  // first parameter is longitude (East is positiv, West is negative)
  // second parameter is latitude (North is positive, South is negative)
  const value = grib2Array[0].getValue(7.13, 48.628)

  console.log("Reference time: " + grib2Array[0].referenceTimestamp)
  console.log("Forecast time: " + grib2Array[0].forecastTimestamp)
  console.log("Value at longitude 48.628 °N and 7.13 °E: " + value)
}

//test()
/*
fetch('https://nomads.ncep.noaa.gov/cgi-bin/filter_fnl.pl?file=gdas.t06z.pgrb2.1p00.f000&var_UGRD=on&var_VGRD=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgdas.20210901%2F06%2Fatmos')
  .then(response => response.arrayBuffer())
  .then(buffer => console.log(buffer))
  .catch(error => console.log(error));
*/


// request is deprecated, but the only one working???
var request = require('request');
request('https://nomads.ncep.noaa.gov/cgi-bin/filter_fnl.pl?file=gdas.t06z.pgrb2.1p00.f000&var_UGRD=on&var_VGRD=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgdas.20210901%2F06%2Fatmos', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(response);
    }
})


function decodeGRIB2(buffer) {

  var results = [];
  let index = 0;

  // Parse Section0
  for (let i = 0; i < gg.section0.length; i++){
    let bufferStartIndex = index + gg.section0[i].startIndex - 1;
    gg.section0[i].binaryData = buffer.splice(bufferStartIndex, gg.section0[i].size);
  }
  

}




