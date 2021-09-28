<template>
  <div id="app">

    <div class="accordion" id="accordionExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">

          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div class="accordion-body">
            <div class="container">
              <div class="row align-items-center flex-nowrap">
                <div class="col btn-group" :key="data.name" :id="data.name" @click.prevent="dataClicked" v-for="data in dataTypes">
                  <button type="button" class="btn btn-outline-dark" :class="[data.active ? 'active border': '']">{{data.name}}</button>
                </div>
              </div>

              <div class="row align-items-end flex-nowrap">
                <!-- https://github.com/john015/vue-load-image -->
                <div class="col btn btn-outline-light" :class="[fig.active ? 'active border': '']" :key="fig.id" :id="fig.id" @click.prevent="dateClicked" v-for="fig in figureInfo">
                  
                  <figure class="figure">
                    <vue-load-image>
                      <template v-slot:image>
                         <img :src="fig.url" class="img-fluid rounded" :alt="fig.caption">
                      </template>
                      <template v-slot:preloader>
                        <img style="max-height: 16em" class="img-fluid rounded" src="/geoportal/img/image-loader.gif" />
                      </template>
                    </vue-load-image>

                    <figcaption class="figure-caption border">{{fig.caption}}  <small class="text-end">({{fig.subcaption}})</small></figcaption>
                  </figure>

                </div>


              </div>


              <div class="row align-items-center flex-nowrap">
                <div class="col btn-group" :key="timeScale.id" :id="timeScale.id" @click.prevent="timeScaleClicked" v-for="timeScale in getAvailableTimeScales">
                  <button v-if="timeScale.available" type="button" class="btn btn-outline-dark" :class="[timeScale.active ? 'active border': '']">{{timeScale.name}}</button>
                </div>
              </div>



            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import VueLoadImage from "VueLoadImage.vue";

// https://www.youtube.com/watch?v=6noJ0dlG7jM&ab_channel=Academind
// https://www.youtube.com/watch?v=FWQSuskE5UA&ab_channel=Academind
export default {
  name: 'app',
  data () {
    return {
      currentDate: new Date(),
      days: [ -2, -1, 0, +1, +2],
      selectedDate: [false, false, true, false, false],
      weekDays: ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      // https://resources.marine.copernicus.eu/products
      // https://resources.marine.copernicus.eu/product-detail/MEDSEA_ANALYSISFORECAST_PHY_006_013/INFORMATION
      // https://view-cmems.mercator-ocean.fr/MEDSEA_ANALYSISFORECAST_PHY_006_013
      // https://view-cmems.mercator-ocean.fr/MEDSEA_ANALYSISFORECAST_WAV_006_017
      // LEGEND
      // TODO: ADD LEGEND. style is then transfered to legend.
      // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?REQUEST=GetLegendGraphic&LAYER=sea_water_velocity&PALETTE=rainbow&COLORSCALERANGE=-0.5354787%2C0.92136043
      dataTypes: {
        "current": {
          name: 'current',
          url: 'med-cmcc-cur-an-fc',
          layerName: 'sea_water_velocity',
          timeScales: ['h', 'h3', 'h6', 'h12', 'd', 'd3', 'm'],
          range: [-1,1],
          active: true
        },
        "sea-temperature": {
          name: 'sea-temperature',
          url: 'med-cmcc-tem-an-fc',
          layerName: 'thetao',
          timeScales: ['h', 'h3', 'h6', 'h12', 'd', 'd3', 'm'],
          range: [10, 30],
          active: false
        },
        "salinity": {
          name: 'salinity',
          url: 'med-cmcc-sal-an-fc',
          layerName: 'so',
          timeScales: ['h', 'h3', 'h6', 'h12', 'd', 'd3', 'm'],
          range: [32, 41],
          active: false
        },
        "wave significant height": {
          name: 'wave significant height',
          url: 'med-hcmr-wav-an-fc',
          layerName: 'VHM0',
          timeScales: ['h', 'h3', 'h6', 'h12'],
          range: [0, 4],
          active: false,
        },
        "chlorophyll": {
          name: 'chlorophyll',
          urlData: 'med-ogs-pft-an-fc',
          layerName: 'chl',
          timeScales: ['h', 'h3', 'h6', 'h12', 'd', 'd3'],
          range: [0.01, 1],
          active: false,// TODO BASE URL IS DIFFERENT
          // https://nrt.cmems-du.eu/thredds/wms/med-ogs-pft-an-fc-d?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&COLORSCALERANGE=0.028321734%2C2.3005204&ELEVATION=-1.0182366371154785&LAYERS=chl&STYLES=boxfill%2Frainbow&TIME=2021-10-06T12%3A00%3A00.000Z&URL=https%3A%2F%2Fnrt.cmems-du.eu%2Fthredds%2Fwms%2Fmed-ogs-pft-an-fc-d&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4326&BBOX=28.125%2C16.875%2C33.75%2C22.5
        }
      },
      // 15min, hourly, daily, monthly means
      timeScales: {
        'qm': {
          id: 'qm',
          name: '15-minutes instantaneous',
          url: 'qm',
          interval: [-30, -15, 0, 15, 30],
          active: false
        }, 
        'h': {
          id: 'h',
          name: "1 hour",
          url: 'h',
          interval: [-2, -1, 0, 1, 2],
          active: false
        },
        'h3': {
          id: 'h3',
          name: "3 hours",
          url: 'h',
          interval: [-6, -3, 0, 3, 6],
          active: false
        },
        'h6': {
          id: 'h6',
          name: "6 hours",
          url: 'h',
          interval: [-12. -6, 0, 6, 12],
          active: false
        },
        'h12': {
          id: 'h12',
          name: "12 hours",
          url: 'h',
          interval: [-24, -12, 0, 12, 24],
          active: false
        },
        'd': {
          id: 'd',
          name: '1 day',
          url: 'd',
          interval: [-2, -1, 0, 1, 2],
          active: true
        },
        'd3': {
          id: 'd3',
          name: '3 days',
          interval: [-6, -3, 0, 3, 6],
          url: 'd',
          active: false
        },
        'm': {
          id: 'm',
          name: 'Montly mean',
          url: 'm',
          interval: [-5, -4, -3, -2, -1],
          active: false
        }
      },
      figureInfo: {},
      dataURL: "https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=sea_water_velocity&COLORSCALERANGE=-1%2C1&STYLES=boxfill%2Foccam&WIDTH=256&HEIGHT=256&CRS=CRS%3A84&BBOX=-1%2C36%2C9%2C44&TIME=2021-{MONTH}-{DAY}T12%253A00%253A00.000Z",
      baseURL: "https://nrt.cmems-du.eu/thredds/wms/{URLdataTypes}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS={LAYERNAME}&COLORSCALERANGE={MINRANGE}%2C{MAXRANGE}&STYLES=boxfill%2Foccam&WIDTH=256&HEIGHT=256&CRS=CRS%3A84&BBOX=-1%2C36%2C9%2C44&TIME=2021-{MONTH}-{DAY}T{HOURS}%253A{MINUTES}%253A00.000Z"
    }
  },
  methods: {
    dateClicked: function (event) {
      // Deselect date in GUI
      this.selectedDate.forEach((e, index) => {
        this.selectedDate[index] = false;
      })
      // Highlight selected date
      this.selectedDate[event.currentTarget.id] = true;
      foo();
    },

    // Data type (SST, salinity, current)
    dataClicked: function(event) {
      // Select active data type
      this.selectButtonInGroup(this.dataTypes, event.currentTarget.id)
      // Change data type
      this.updateWMSURL();
    },

    // Time scale
    timeScaleClicked: function(event) {
      // Select active time scale
      this.selectButtonInGroup(this.timeScales, event.currentTarget.id)
      // Change time scale
      this.updateWMSURL();
    },
    // Select/deselect options
    selectButtonInGroup: function(array, selKey){
      Object.keys(array).forEach(key => array[key].active = false);
      array[selKey].active = true;
    },




    // Generate WMS url
    updateWMSURL: function(){
      
      let tmpURLData = this.baseURL;
      // Data type
      let activedataType; // = this.dataTypes.find(el => return el.active == true)
      Object.keys(this.dataTypes).forEach(key => { if (this.dataTypes[key].active) activedataType = this.dataTypes[key] }); // Returns active data type
      // Show/Hide available time scales
      Object.keys(this.timeScales).forEach(key => this.timeScales[key].available = activedataType.timeScales.includes(key)); // Show/hide time scales in GUI


      // TODO HERE: define this.timeScales.available
      // HTML --> v-if: tScale.available
      // TO0DO: WIND and Other sources:
      // https://data.noaa.gov/dataset/?_tags_limit=0&sort=score+desc%2C+metadata_modified+desc&q=wind+forecast+hourly&res_format=WMS
      // https://nowcoast.noaa.gov/help/#!section=wms-layer-ids
      // https://resources.marine.copernicus.eu/product-detail/MEDSEA_ANALYSISFORECAST_BGC_006_014/INFORMATION
      // GENREAL TODO: INIT!
      // Time scale
      let activeTimeScale;
      Object.keys(this.timeScales).forEach(key => { if (this.timeScales[key].active) activeTimeScale = this.timeScales[key] }); // Returns active data type


      tmpURLData = tmpURLData.replace('{URLdataTypes}', activedataType.url + '-' + activeTimeScale.url);
      tmpURLData = tmpURLData.replace('{LAYERNAME}', activedataType.layerName);
      tmpURLData = tmpURLData.replace('{MINRANGE}', activedataType.range[0]);
      tmpURLData = tmpURLData.replace('{MAXRANGE}', activedataType.range[1]);

      
      // Time intervals
      for (let i = 0; i < activeTimeScale.interval.length; i++){
        let dd = new Date(this.currentDate);
        let tmpURL = tmpURLData;
        let caption = '';
        let subcaption = '';

        switch (activeTimeScale.url){
          case 'qm':
            // Set minimum time interval to 15 min
            dd.setMinutes(Math.round(dd.getMinutes()/15)*15); // Rounds to closer 15min interval
            dd.setMinutes(dd.getMinutes() + activeTimeScale.interval[i]);
            caption = dd.getHours() + 'h:' + dd.getMinutes() + 'min';
            subcaption = activeTimeScale.interval[i] + 'min';
            break;
          case 'h':
            dd.setHours(dd.getHours() + activeTimeScale.interval[i]);
            // Depends on data service. Again, check GetCapabilities?
            if (activedataType.name == "wave significant height" || activedataType.name == "chlorophyll") // https://nrt.cmems-du.eu/thredds/wms/med-hcmr-wav-an-fc-h?request=GetCapabilities&service=WMS
              dd.setMinutes(0)
            else
              dd.setMinutes(30); // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-mld-an-fc-hts?request=GetCapabilities&service=WMS
            caption =  this.weekDays[dd.getDay()] + " " + dd.getDate() + " at " + dd.getHours() + ':00';
            subcaption = activeTimeScale.interval[i] + 'h';
            break;
          case 'd':
            dd.setDate(dd.getDate() + activeTimeScale.interval[i]);
            dd.setHours(12);
            dd.setMinutes(0);
            caption = this.weekDays[dd.getDay()] + " " + dd.getDate();
            subcaption = 24*activeTimeScale.interval[i] + 'h';
            break;
          case 'm':
            dd.setMonth(dd.getMonth() + activeTimeScale.interval[i])
            // TODO: time intervals can be extracted from get capabilities?
            // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-tem-an-fc-m?request=GetCapabilities&service=WMS
            dd.setDate(16); // or 15. check here: https://view.marine.copernicus.eu/ViewService/?record_id=66fb61fa-c911-4f7e-aec1-959627bbf2b3
            dd.setHours(12); // or 00?
            dd.setMinutes(0);
            caption = this.monthNames[dd.getMonth()] + ' ' + dd.getUTCFullYear();
            subcaption = 'Monthly average';
            break;
        }
        // URL
        tmpURL = tmpURL.replace("{MONTH}", (dd.getMonth()+1).toString().padStart(2,"0"));
        tmpURL = tmpURL.replace("{DAY}", dd.getDate().toString().padStart(2,"0"));
        tmpURL = tmpURL.replace("{HOURS}", dd.getHours().toString().padStart(2,"0"));
        tmpURL = tmpURL.replace("{MINUTES}", dd.getMinutes().toString().padStart(2,"0"));

        // Output
        this.figureInfo[i] = {
          'id': i,
          'caption': caption,
          'subcaption': subcaption,
          'url': tmpURL,
          'active': activeTimeScale.interval[i] == 0 ? true : false,
        }
      }

      return this.figureInfo;
      // Change image url
      this.dataURL = tmpURL;
      console.log(tmpURL);
    },

    // Get figure WMS URL from date intervals
    getFigureInfo: function(activeTimeScale, baseURL){
      
      let figureInfo = {};

      for (let i = 0; i < activeTimeScale.interval.length; i++){
        let dd = new Date(this.currentDate);
        let tmpURL = baseURL;
        let caption = '';
        let subcaption = '';

        switch (activeTimeScale.url){
          case 'qm':
            // Set minimum time interval to 15 min
            dd.setMinutes(Math.round(dd.getMinutes()/15)*15); // Rounds to closer 15min interval
            dd.setMinutes(dd.getMinutes() + activeTimeScale.interval[i]);
            caption = dd.getHours() + 'h:' + dd.getMinutes() + 'min';
            subcaption = activeTimeScale.interval[i] + 'min';
            break;
          case 'h':
            dd.setHours(dd.getHours() + activeTimeScale.interval[i]);
            dd.setMinutes(0);
            caption = dd.getHours() + 'h';
            subcaption = activeTimeScale.interval[i] + 'h';
            break;
          case 'd':
            dd.setDate(dd.getDate() + activeTimeScale.interval[i]);
            dd.setHours(12);
            dd.setMinutes(0);
            caption = this.weekDays[dd.getDay()] + " " + dd.getDate();
            subcaption = 24*activeTimeScale.interval[i] + 'h';
            break;
          case 'm':
            dd.setMonth(dd.getMonth() + activeTimeScale.interval[i])
            dd.setDate(16); // or 15. check here: https://view.marine.copernicus.eu/ViewService/?record_id=66fb61fa-c911-4f7e-aec1-959627bbf2b3
            dd.setHours(0);
            dd.setMinutes(0);
            caption = this.monthNames[dd.getMonth()] + ' ' + dd.getUTCFullYear();
            subcaption = 'Monthly average';
            break;
        }
        // URL
        tmpURL = tmpURL.replace("{MONTH}", dd.getMonth().toString().padStart(2,"0"));
        tmpURL = tmpURL.replace("{DAY}", dd.getDate().toString().padStart(2,"0"));
        tmpURL = tmpURL.replace("{HOURS}", dd.getHours().toString().padStart(2,"0"));
        tmpURL = tmpURL.replace("{MINUTES}", dd.getMinutes().toString().padStart(2,"0"));

        // Output
        figureInfo[i] = {
          'id': i,
          'caption': caption,
          'subcaption': subcaption,
          'url': tmpURL,
          'active': activeTimeScale.interval[i] == 0 ? true : false,
        }
      }

      return figureInfo;
    },

    


  },
  components: {
    "vue-load-image": VueLoadImage
  },
  computed: {   
    // Returns available time scales for a data type
    getAvailableTimeScales: function () {
      let avTimeScales = Object.keys(this.timeScales)
        .filter(key => this.timeScales[key].available)
        .reduce((availableTimeScalesObj, key) => {availableTimeScalesObj[key] = this.timeScales[key]; return availableTimeScalesObj}, {});
      // One available time scale should be active
      let keys = Object.keys(avTimeScales);
      for (let i = 0; i < keys.length; i++){ // The last will be active
        if (avTimeScales[keys[i]].active)
          break;
        else if (i == keys.length-1){
          avTimeScales[keys[i]].active = true;
          this.selectButtonInGroup(this.timeScales, keys[i]); // Update timeScales
          this.updateWMSURL(); // Update URLs
        }
      }
      return avTimeScales;
    }
  }
}
</script>


<style scoped>
</style>
