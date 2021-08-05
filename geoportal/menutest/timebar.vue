<template>
  <div id="app">

    <div class="accordion" id="accordionExample">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">

          </button>
        </h2>
        <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div class="accordion-body">

            <div class="container">
              <div class="row align-items-end">
                <div class="col" v-for="date in getDates">
                  <figure class="figure">
                    <img v-bind:src="date.imgURL" class="figure-img img-fluid rounded" :alt="date.dateName">
                    <figcaption class="figure-caption">{{date.dateName}}</figcaption>
                  </figure>

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
// https://www.youtube.com/watch?v=6noJ0dlG7jM&ab_channel=Academind
// https://www.youtube.com/watch?v=FWQSuskE5UA&ab_channel=Academind
export default {
  name: 'app',
  data () {
    return {
      msg: "vue component test",
      days: [ -2, -1, 0, +1, +2],
      weekDays: ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dataURL: "https://nrt.cmems-du.eu/thredds/wms/med-cmcc-cur-an-fc-d?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=sea_water_velocity&COLORSCALERANGE=-1%2C1&STYLES=boxfill%2Foccam&WIDTH=256&HEIGHT=256&CRS=CRS%3A84&BBOX=-1%2C36%2C9%2C44&TIME=2021-{MONTH}-{DAY}T12%253A00%253A00.000Z"
    }
  },
  computed: {
    getDates: function () {
      let dates = [];
      this.days.forEach((day, index) => {
        let dd = new Date();
        dd.setDate(dd.getDate() + day); // One day before/after

        let url = this.dataURL.replace("{MONTH}", dd.getMonth().toString().padStart(2,"0"));
        url = url.replace("{DAY}", dd.getDate().toString().padStart(2,"0"));
        console.log(url);
        url = url.replace("%20", "");
        dates[index] = {
          dateName: this.weekDays[dd.getDay()] + " " + dd.getDate(),
          imgURL: url
        }
      });
      return dates;
    }
  }
}
</script>


<style scoped>
</style>
