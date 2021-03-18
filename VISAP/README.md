# VISAP
A [temporary dashboard](https://bluenetcataccio4.github.io/VISAP/) has been created to show the visualizations.
## Information to visualize
### Pesca d'arrossegament (Trawling)
#### Checkpoints
A [pie chart](https://bluenetcataccio4.github.io/VISAP/piechart/) is in development. Checklist of milestones:
- [x] Server
  - [x] Nodejs server with queries to the database and REST API for web client requests
  - [x] Backup method for providing (static) data if server and database are down
  - [ ] Automatically upload of static data to github's visualizer repository
  - [ ] Install in production server
  - [ ] Set up with a daemon
- [x] Basic pie chart visualization of biomass per port
  - [x] Preprocess data from server to be used in visualizer
  - [x] Discuss color palette (custom or as in report)
  - [x] Species with small biomass in "Altres" group
  - [ ] Add tab location in pie chart (Sud/L'Ametlla de Mar/Comercial)
  - [ ] Fix long names
  - [x] Ability to select/deselect species
  - [ ] More info about each species when clicked?
  - [ ] Add fishing per stratum (requires new query from J. Ribera)
- [ ] Query for data organized per season (requires new query)

Regarding the map visualization, here is the checklist:
- [ ] Server
  - [ ] GeoServer for WMS
  - [ ] Nodejs for static files (csv-like)
- [ ] Map visualizer
  - [x] Openlayers WMS color filter with SVG
  - [ ] Tile cache client side
  - [ ] Visualize tracks of the hauls and clickon events
  - [ ] Pie charts of the samples collected by each haul when clicked

A simple dashboard made with bootstrap
 - [x] Basic dashboard

#### Catches Pie charts
Catches (Captures) are shown as a [pie chart](https://bluenetcataccio4.github.io/VISAP/test/trawling_test.html).
##### Options available in the given report
These options will probably require new queries to the server/BBDD. For example, the aforementioned pie chart is divided in areas/harbours.
- Per area/harbour (Roses, l'Escala, Palamós...)
- Per season (Autumn, Winter, Spring...)

##### Other thoughts
This pie chart could be used when checking at individual sampling of trawling (mostreig) on the map.

#### Routes Map
A map where the routes of the fishing vessels could be checked, as in the given report.

##### Density (fishing effort, catches, economic performance)
As shown in the report. This could be served with a WMS from a GeoServer. We have to agree on the temporal resolution (and projection).

##### Individual sampled boats (mostreig)
As shown in the report. The routes could be served with a GeoJSON. Other info could pop up, like the date and a pie chart of the catches of that boat on that sampling day.


### Pesca d'encerclament

### Pesca sonsera

### Pesca de pop roquer
