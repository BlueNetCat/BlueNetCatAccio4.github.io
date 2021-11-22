<template>
  <div id="app-forecast">

    <template v-if="true"><!-- v-if="!mobile"-->
      <div class="accordion position-absolute bottom-0 start-0 end-0 mh-50" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingOne">
            <!--button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne"-->
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              Forecast and Analysis of Mediterranean Sea - {{currentDataInformation}}
            </button>
          </h2>
          <!--div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample"-->
          <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div class="accordion-body">


              <div class="container">


                <!-- Feature selection -->
                <div class="row p-1 align-items-center flex-nowrap">
                  <div class="col text-center">
                    <div class="btn-group" :key="data.name" :id="data.name" @click.prevent="dataClicked" v-for="data in dataTypes">
                      <button type="button" class="btn btn-sm btn-outline-dark" :class="[data.active ? 'active border': '']">{{data.name}}</button>
                    </div>
                  </div>
                </div>



                <!-- Data figures -->
                <div class="row p-1 align-items-end flex-nowrap">
                  <!-- https://github.com/john015/vue-load-image -->
                  <div class="col btn btn-outline-light fig-col" :class="[fig.active ? 'active border border-dark': '']" :key="fig.id" :id="fig.id" @click.prevent="figureClicked" v-for="fig in figureInfo">
                    
                    <figure class="figure m-0">
                      <img :id="fig.id" :src="fig.url" @error="onWMSImageNotFound($event)" class="figure-img img-fluid rounded" :alt="fig.caption">
                      <!--vue-load-image>
                        <template v-slot:image>
                          <img :src="fig.url" @error="onWMSImageNotFound($event)" class="figure-img img-fluid rounded" :alt="fig.caption">
                        </template>
                        <template v-slot:preloader>
                          <img class="figure-img img-fluid rounded" src="/geoportal/img/image-loader.gif" />
                        </template>
                      </vue-load-image-->

                      <figcaption class="figure-caption border">{{fig.caption}}  <small class="text-end">({{fig.subcaption}})</small></figcaption>
                    </figure>

                  </div>


                </div>

                <!-- Time scale selection -->
                <div class="row p-1 align-items-center flex-nowrap">
                  <div class="col text-center">
                    <div class="btn-group" role="group" :key="timeScale.id" :id="timeScale.id" @click.prevent="timeScaleClicked" v-for="timeScale in getAvailableTimeScales">
                      <button v-if="timeScale.available" type="button" class="btn btn-sm btn-outline-dark" :class="[timeScale.active ? 'active border': '']">{{timeScale.name}}</button>
                    </div>
                  </div>
                </div>


                <!-- Source selection -->
                <div class="row p-2 align-items-center flex-nowrap">
                  <div class="col text-center">
                    <div class="btn-group" role="group" aria-label="Source selection" :key="source.id" :id="source.id" @click.prevent="sourceClicked" v-for="source in sources">
                      <button type="button" class="btn btn-sm btn-outline-dark" :class="[source.active ? 'active border': '']">{{source.id}}</button>
                    </div>
                  </div>
                </div>

                <!-- Attribution -->
                <div class="row">
                  <div class="col text-center">
                    <div :key="source.id" v-for="source in sources">
                      <small v-if="source.active">Attribution: {{source.attribution}}<small>
                    </div>
                  </div>
                </div>
                

              </div>

            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>


<script>
import VueLoadImage from "VueLoadImage.vue";

// https://www.youtube.com/watch?v=6noJ0dlG7jM&ab_channel=Academind
// https://www.youtube.com/watch?v=FWQSuskE5UA&ab_channel=Academind
export default {
  name: 'app-forecast',
  created (){
    window.addEventListener('resize', this.checkScreenRatio);
    this.checkScreenRatio();
    this.updateWMSURL();
  },
  mounted (){
    // Once mounted, update the WMS url of map
    if (this.$root.$refs.map) // Reference defined in vueParser.js
      this.$root.$refs.map.$updateSourceWMS(this.getWMSURL());
  },
  data () {
    return {
      currentDataInformation: "",
      mobile: false,
      currentDate: new Date(),
      days: [ -2, -1, 0, +1, +2],
      selectedDate: [false, false, true, false, false],
      weekDays: ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      catseaBBOX: [-1,36,9,44],
      sources: {
        'CMEMS-MED': {
          id: 'CMEMS-MED',
          attribution: "Mediterranean Sea Physics and Biogeochemistry Analysis and Forecast. Credits: E.U. Copernicus Marine Service Information",
          productURL: "https://resources.marine.copernicus.eu/product-detail/MEDSEA_ANALYSISFORECAST_PHY_006_013/INFORMATION",
          productURL2: "https://resources.marine.copernicus.eu/product-detail/MEDSEA_ANALYSISFORECAST_BGC_006_014/INFORMATION",
          productURL3: "https://resources.marine.copernicus.eu/product-detail/MEDSEA_ANALYSISFORECAST_WAV_006_017/INFORMATION",
          domainURL: "https://nrt.cmems-du.eu/thredds/wms",
          active: true
        },
        'SOCIB-WMOP': {
          id: 'SOCIB-WMOP',
          attribution: "Western Mediterranean Operational Forecasting System. Credits: ICTS SOCIB",
          productURL: "https://thredds.socib.es/thredds/catalog/operational_models/oceanographical/hydrodynamics/model_run_aggregation/wmop/catalog.html?dataset=operational_models/oceanographical/hydrodynamics/model_run_aggregation/wmop/wmop_best.ncd",
          domainURL: "https://thredds.socib.es/thredds/wms/operational_models/oceanographical/hydrodynamics/model_run_aggregation/wmop/wmop_best.ncd",
          catalog: "https://thredds.socib.es/thredds/catalog.html",
          otherURL: "https://thredds.socib.es/lw4nc2/index-menu.html",
          active: false
        },
        'SOCIB-SAPO': { // There are several forecasts: ib (illes balears), mallorca, menorca, 
          id: 'SOCIB-SAPO',
          attribution: "Wave Forecast. Credits: ICTS SOCIB",
          productURL: "https://thredds.socib.es/thredds/catalog/operational_models/oceanographical/wave/model_run_aggregation/sapo_ib/catalog.html?dataset=operational_models/oceanographical/wave/model_run_aggregation/sapo_ib/sapo_ib_best.ncd",
          domainURL: "https://thredds.socib.es/thredds/wms/operational_models/oceanographical/wave/model_run_aggregation/sapo_ib/sapo_ib_best.ncd",
          catalog: "https://thredds.socib.es/thredds/catalog.html",
          otherURL: "https://thredds.socib.es/lw4nc2/index-menu.html",
          active: false
        } // TODO HERE....  
      },
      //https://thredds.socib.es/thredds/wms/operational_models/oceanographical/wave/model_run_aggregation/sapo_ib/sapo_ib_best.ncd
      // https://thredds.socib.es/lw4nc2/index-menu.html
      // https://thredds.socib.es/thredds/wms/operational_models/oceanographical/hydrodynamics/model_run_aggregation/wmop/wmop_best.ncd?TRANSPARENT=true&FORMAT=image%2Fpng&LAYERS=salt&PROJECTION=EPSG%3A4326&ABOVEMAXCOLOR=extend&BELOWMINCOLOR=extend&STYLES=boxfill%2Frainbow&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&TIME=2021-10-18T15%3A00%3A00.000Z&SRS=EPSG%3A4326&COLORSCALERANGE=26.073683%2C38.58198&BBOX=5.625,33.75,11.25,39.375&WIDTH=256&HEIGHT=256
      // https://thredds.socib.es/thredds/wms/operational_models/oceanographical/hydrodynamics/model_run_aggregation/wmop/wmop_best.ncd?TRANSPARENT=true&FORMAT=image%2Fpng&LAYERS=temp&COLORSCALERANGE=0%2C30&PROJECTION=EPSG%3A4326&NUMCOLORBANDS=50&ABOVEMAXCOLOR=extend&BELOWMINCOLOR=extend&STYLES=boxfill%2Fsst_36&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG%3A4326&BBOX=-16.4736328125,30.161865234375,19.4736328125,50.838134765625&WIDTH=1636&HEIGHT=941
      // https://resources.marine.copernicus.eu/products
      // https://resources.marine.copernicus.eu/product-detail/MEDSEA_ANALYSISFORECAST_PHY_006_013/INFORMATION
      // https://view-cmems.mercator-ocean.fr/MEDSEA_ANALYSISFORECAST_PHY_006_013
      // https://view-cmems.mercator-ocean.fr/MEDSEA_ANALYSISFORECAST_WAV_006_017

      // ?service=WMS&version=1.3.0&request=GetCapabilities
      // LEGEND
      // TODO: ADD LEGEND. style is then transfered to legend.
      // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-qm?REQUEST=GetLegendGraphic&LAYER=sea_water_velocity&PALETTE=rainbow&COLORSCALERANGE=-0.5354787%2C0.92136043
      dataTypes: {
        "Sea surface velocity": {
          name: 'Sea surface velocity',
          url: 'med-cmcc-cur-an-fc',
          layerName: 'sea_water_velocity',
          timeScales: ['h', 'h3', 'h6', 'h12', 'd', 'd3', 'm'],
          range: [-1,1],
          style: "boxfill%2Foccam",//"vector%2Foccam",
          animation: {
            layerNames: ['uo','vo'], // East, North
            format: 'east_north',
            type: 'velocity'
          },
          active: true
        },
        "Sea temperature": {
          name: 'Sea temperature',
          url: 'med-cmcc-tem-an-fc',
          layerName: 'thetao',
          timeScales: ['h', 'h3', 'h6', 'h12', 'd', 'd3', 'm'],
          range: [10, 32],
          style: "boxfill%2Foccam",
          active: false
        },
        "Salinity": {
          name: 'Salinity',
          url: 'med-cmcc-sal-an-fc',
          layerName: 'so',
          timeScales: ['h', 'h3', 'h6', 'h12', 'd', 'd3', 'm'],
          range: [32, 41],
          style: "boxfill%2Foccam",
          active: false
        },
        "Wave significant height": {
          name: 'Wave significant height',
          url: 'med-hcmr-wav-an-fc',
          layerName: 'VHM0', // 'VMDR' for direction in degrees
          timeScales: ['h', 'h3', 'h6', 'h12'],
          range: [0, 6],
          style: "boxfill%2Foccam",
          animation: {
            layerNames: ['VHM0', 'VMDR'], // Intensity, Angle
            format: 'value_angle',
            type: 'wave'
          },
          active: false,
        },
        "Chlorophyll": {
          name: 'Chlorophyll',
          url: 'med-ogs-pft-an-fc',
          layerName: 'chl',
          timeScales: ['d', 'd3'],
          range: [0.01, 1],
          style: "boxfill%2Foccam",
          active: false,// TODO BASE URL IS DIFFERENT
          // https://nrt.cmems-du.eu/thredds/wms/med-ogs-pft-an-fc-d?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&COLORSCALERANGE=0.028321734%2C2.3005204&ELEVATION=-1.0182366371154785&LAYERS=chl&STYLES=boxfill%2Frainbow&TIME=2021-10-06T12%3A00%3A00.000Z&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4326&BBOX=28.125%2C16.875%2C33.75%2C22.5
          // https://thredds.socib.es/thredds/wms/operational_models/oceanographical/hydrodynamics/wmop_surface/2021/09/roms_wmop_surface_20210922.nc?service=WMS&version=1.3.0&request=GetCapabilities
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
      layerInfoWMS: {},
      //dataURL: "https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=sea_water_velocity&COLORSCALERANGE=-1%2C1&STYLES=boxfill%2Foccam&WIDTH=256&HEIGHT=256&CRS=CRS%3A84&BBOX=-1%2C36%2C9%2C44&TIME=2021-{MONTH}-{DAY}T12%253A00%253A00.000Z",
      //baseURL: "https://nrt.cmems-du.eu/thredds/wms/{URLdataTypes}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS={LAYERNAME}&COLORSCALERANGE={MINRANGE}%2C{MAXRANGE}&STYLES=boxfill%2Foccam&WIDTH=256&HEIGHT=256&CRS=CRS%3A84&BBOX=-1%2C36%2C9%2C44&TIME=2021-{MONTH}-{DAY}T{HOURS}%253A{MINUTES}%253A00.000Z"
                //https://nrt.cmems-du.eu/thredds/wms/med-ogs-pft-an-fc-m?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&TILED=true&COLORSCALERANGE=0.024503695%2C0.66972876&ELEVATION=-1.0182366371154785&LAYERS=chl&STYLES=boxfill%2Frainbow&TIME=2021-08-01T00%3A00%3A00.000Z&URL=https%3A%2F%2Fnrt.cmems-du.eu%2Fthredds%2Fwms%2Fmed-ogs-pft-an-fc-m&WIDTH=256&HEIGHT=256&CRS=EPSG%3A4326&BBOX=39.375%2C25.3125%2C42.1875%2C28.125
      baseURL: "{DOMAIN}/{URLdataTypes}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS={LAYERNAME}&COLORSCALERANGE={MINRANGE}%2C{MAXRANGE}&ABOVEMAXCOLOR=extend&BELOWMINCOLOR=extend&STYLES={STYLE}&WIDTH=256&HEIGHT=256&CRS=CRS%3A84&BBOX={BBOX}&TIME=2021-{MONTH}-{DAY}T{HOURS}:{MINUTES}:00.000Z"
      
   }
  },
  methods: {
    // HTML
    // Responsive html
    checkScreenRatio: function(){
      let ratio = window.innerHeight / window.innerWidth;
      if (ratio < 1)
        this.mobile = true;
      else
        this.mobile = false;
    },

    // Figure clicked
    figureClicked: function (event) {
      // Deselect date in GUI
      this.selectedDate.forEach((e, index) => {
        this.selectedDate[index] = false;
      })
      // Highlight selected date
      this.selectedDate[event.currentTarget.id] = true;
      console.log(this.selectedDate);
      this.updateWMSURL();

      // Update WMS source in map component (emit?)
      if (this.$root.$refs.map) // Reference defined in vueParser.js
        this.$root.$refs.map.$updateSourceWMS(this.getWMSURL());
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

    // Source
    sourceClicked: function(event) {
      // Select active time scale
      this.selectButtonInGroup(this.sources, event.currentTarget.id)
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

      // Get data source
      let activeSource = this.sources[Object.keys(this.sources).find(key => this.sources[key].active)];
      // Replace domain
      tmpURLData = tmpURLData.replace('{DOMAIN}', activeSource.domainURL);
      
      // Data type
      let activeDataType; // = this.dataTypes.find(el => return el.active == true)
      Object.keys(this.dataTypes).forEach(key => { if (this.dataTypes[key].active) activeDataType = this.dataTypes[key] }); // Returns active data type
      // Show/Hide available time scales
      Object.keys(this.timeScales).forEach(key => this.timeScales[key].available = activeDataType.timeScales.includes(key)); // Show/hide time scales in GUI


      // TODO HERE: define this.timeScales.available
      // HTML --> v-if: tScale.available
      // TO0DO: WIND and Other sources:
      // https://data.noaa.gov/dataset/?_tags_limit=0&sort=score+desc%2C+metadata_modified+desc&q=wind+forecast+hourly&res_format=WMS
      // https://nowcoast.noaa.gov/help/#!section=wms-layer-ids
      // https://resources.marine.copernicus.eu/product-detail/MEDSEA_ANALYSISFORECAST_BGC_006_014/INFORMATION

      // Time scale
      let activeTimeScale;
      Object.keys(this.timeScales).forEach(key => { if (this.timeScales[key].active) activeTimeScale = this.timeScales[key] }); // Returns active data type


      tmpURLData = tmpURLData.replace('{URLdataTypes}', activeDataType.url + '-' + activeTimeScale.url);
      tmpURLData = tmpURLData.replace('{LAYERNAME}', activeDataType.layerName);
      tmpURLData = tmpURLData.replace('{MINRANGE}', activeDataType.range[0]);
      tmpURLData = tmpURLData.replace('{MAXRANGE}', activeDataType.range[1]);
      tmpURLData = tmpURLData.replace('{STYLE}', activeDataType.style);

      
      // Time intervals
      for (let i = 0; i < activeTimeScale.interval.length; i++){
        let dd = new Date(this.currentDate);
        dd.setMilliseconds(0);
        dd.setSeconds(0);
        let tmpURL = tmpURLData;
        let caption = '';
        let subcaption = '';
        let dateSummary = '';

        switch (activeTimeScale.url){
          case 'qm':
            // Set minimum time interval to 15 min
            dd.setMinutes(Math.round(dd.getMinutes()/15)*15); // Rounds to closer 15min interval
            dd.setMinutes(dd.getMinutes() + activeTimeScale.interval[i]);
            caption = dd.getHours() + 'h:' + dd.getMinutes() + 'min';
            subcaption = activeTimeScale.interval[i] + 'min';
            dateSummary = caption + " " + subcaption;
            break;
          case 'h':
            dd.setHours(dd.getHours() + activeTimeScale.interval[i]);
            // Depends on data service. Again, check GetCapabilities?
            if (activeDataType.name == "Wave significant height" || activeDataType.name == "Chlorophyll") // https://nrt.cmems-du.eu/thredds/wms/med-hcmr-wav-an-fc-h?request=GetCapabilities&service=WMS
              dd.setMinutes(0)
            else
              dd.setMinutes(30); // https://nrt.cmems-du.eu/thredds/wms/med-cmcc-mld-an-fc-hts?request=GetCapabilities&service=WMS
            caption =  this.weekDays[dd.getDay()] + " " + dd.getDate() + " at " + dd.getHours() + ':00';
            subcaption = activeTimeScale.interval[i] + 'h';
            dateSummary = caption +  "h, hourly mean";
            break;
          case 'd':
            dd.setDate(dd.getDate() + activeTimeScale.interval[i]);
            dd.setHours(12);
            dd.setMinutes(0);
            caption = this.weekDays[dd.getDay()] + " " + dd.getDate();
            subcaption = 24*activeTimeScale.interval[i] + 'h';
            dateSummary = caption + " " + this.monthNames[dd.getMonth()] + ' ' + dd.getUTCFullYear() +", daily mean";
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
            dateSummary = caption + " " + subcaption;
            break;
        }
        // URL
        tmpURL = tmpURL.replace("{MONTH}", (dd.getMonth()+1).toString().padStart(2,"0"));
        tmpURL = tmpURL.replace("{DAY}", dd.getDate().toString().padStart(2,"0"));
        tmpURL = tmpURL.replace("{HOURS}", dd.getHours().toString().padStart(2,"0"));
        tmpURL = tmpURL.replace("{MINUTES}", dd.getMinutes().toString().padStart(2,"0"));

        // BBOX
        tmpURL = tmpURL.replace("{BBOX}", JSON.stringify(this.catseaBBOX).replace('[', '').replace(']', ''));

        // TODO: FIXING MONTHLY AVERAGE URL SHOULD BE DONE HERE. NOW IT IS DONE AT THE imgEl.onerror EVENT.
        // Test the image WMS URL
        // This is useful for monthyl average, because it can be on the 16th at 12h, 16th at 00h, 15th at 12h, 15th at 00h...
        /*fetch(tmpURL)
        .then((res) => {
          if(res.status == 400){
          }
        })
        .catch(console.error)*/

        // Output
        this.figureInfo[i] = {
          'id': i,
          'caption': caption,
          'subcaption': subcaption,
          'url': tmpURL,
          'active': this.selectedDate[i]//activeTimeScale.interval[i] == 0 ? true : false,
        }

        // Active source information
        if (this.selectedDate[i]){

          this.currentDataInformation = activeDataType.name + ", " + dateSummary + " (" + activeSource.id + ")";

          // Openlayers WMS source information
          // Fix hour difference (e.g. GMT+2) for ISOString function
          dd.setHours(dd.getHours() - dd.getTimezoneOffset()/60);
          // Layer source
          this.layerInfoWMS = {
            url: activeSource.domainURL + "/" + activeDataType.url + '-' + activeTimeScale.url,
            attributions: activeSource.attribution,
            params: {
              'LAYERS': activeDataType.layerName,
              'TIME': dd.toISOString(),
              'COLORSCALERANGE': activeDataType.range,
              'STYLES': activeDataType.style.replace('%2F', '/'),
              'TRANSPARENT': true
            },
            cacheSize: 500,
            zDirection: -1,
            // Information for animation
            exampleWMSURL: tmpURL, // TODO: remove without consequences?
            animation: activeDataType.animation,
          }
        }

      }

      return this.figureInfo;
    },


    // Image not found (usually monthly mean)
    onWMSImageNotFound: function(event){
      let imgEl = event.currentTarget;
      let url = imgEl.src;
      console.log(url);
      let time = this.getWMSParameter(url, 'TIME');
      let date = new Date(time);
      // Go back in time 12h
      date.setHours(date.getHours() - 12); // Default date is 16th at 12h. Other possible dates are in the past (16th at 00h, 15th at 12h...)
      // Replace img source. If it fails, it is recursive
      imgEl.src = this.setWMSParameter(url, 'TIME', date.toISOString());
      // Update consequent information
      let figIndex = imgEl.id;
      this.figureInfo[figIndex].url = imgEl.src;
      if (this.selectedDate[figIndex]){
        // Fix hour difference (e.g. GMT+2) for ISOString function
        date.setHours(date.getHours() - date.getTimezoneOffset()/60);
        this.layerInfoWMS.params['TIME'] = date.toISOString();
      }
    },
    // Set WMS parameter
    setWMSParameter: function(wmsURL, paramName, paramContent) {
      // If parameter does not exist
      if (wmsURL.indexOf(paramName + "=") == -1) {
        console.log("Parameter ", paramName, " does not exist in WMS URL");
        return wmsURL + '&' + paramName + '=' + paramContent;
      }
      let currentContent = this.getWMSParameter(wmsURL, paramName);
      return wmsURL.replace(currentContent, paramContent);
    },
    // Get WMS parameter
    getWMSParameter: function(wmsURL, paramName) {
      // If parameter does not exist
      if (wmsURL.indexOf(paramName + "=") == -1) {
        console.log("Parameter ", paramName, " does not exist in WMS URL");
        return '';
      }
      let tmpSTR = wmsURL.substr(wmsURL.indexOf(paramName + "="));
      // If time is not the last parameter
      if (tmpSTR.indexOf('&') != -1)
        return tmpSTR.substring(paramName.length + 1, tmpSTR.indexOf('&'));
      else
        return tmpSTR.substring(paramName.length + 1, tmpSTR.length);
    },

    // Return WMS info for OpenLayers layer
    getWMSURL: function(){
      return this.layerInfoWMS;
    }

    

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
      for (let i = 0; i < keys.length; i++){
        if (avTimeScales[keys[i]].active)
          break;
        else if (i == keys.length-1){
          avTimeScales[keys[0]].active = true; // First time scale is active
          this.selectButtonInGroup(this.timeScales, keys[i]); // Update timeScales
          this.updateWMSURL(); // Update URLs
        }
      }
      return avTimeScales;
    },
    
  }
}
</script>





<style scoped>

.accordion-item {
  background-color: rgba(255, 255, 255, 0.8);
}
.figure-img {
  max-height: 16em
}

.fig-col.active {
  background-color: rgba(255, 255, 255, 0.6);
  transform: 0.5s ease all;
}

.fig-col:not(active) {
  border-color: rgba(0, 0, 0, 0.1);
}

.btn-outline-dark :not(active) {
  background-color: rgba(255, 255, 255, 0.6);
}

</style>
