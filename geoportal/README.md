The geojsons are limited to the Catalan Sea and the Western Mediterranean. The information coming from third parties has been often modified and reduced in this repository. If you want full datasets, you can find the source in the header or ask the BlueNetCat organization (email in the header).

This site should provide information about how to download/access the data.

## Measurements
### [Buoys](data/buoys.geojson)
Most of the buoys come from Puertos del Estado. The data can be downloaded through their visualizer: http://www.puertos.es/es-es/oceanografia/Paginas/portus.aspx. I don't know if there is a service to do queries for real-time data. The data from the buoy of l'Estartit can be seen and accessed here: https://estartit.icm.csic.es/. The buoys from the southern Western Mediterrean need to be included.

Could complete by adding info from: https://www.emodnet-physics.eu/Map/. French buoys: http://candhis.cetmef.developpement-durable.gouv.fr/carte/

### [Tide gauges (mareogràfs)](data/tide_gauges.geojson)
Same as the buoys from Puertos del Estado for Spain. For France, the information can be found here: https://data.shom.fr/donnees/catalogue/observation. The data can also be accessed from here: https://www.emodnet-physics.eu/Map/

### [Weather stations](data/weather_stations_med.geojson)
In principle you should be able to get the data from https://opendata.aemet.es/centrodedescargas/inicio. An API key is needed to access it. You can use the id of each station in the geojson to find the data in the AEMET website. In our geojson, four different kinds of weather stations are mixed: complete stations, automatic stations, rain gauges and thermometric.

### [Webcams](data/webcams.geojson)
Not much to say here, the data can be found on each geojson feature. Some webcams are real-time and others provide a picture of the last hour or so. I still need to collect webcams from outside Catalunya.

### [Stream gauges (aforament rius)](data/stream_gauges_med_coast.geojson)
- SAIH (Sistemas Automáticos de Información Hidrológica): only the stations close to the coast have been kept. In the original dataset there are many more locations. The data can be accessed two ways. The first way is in the MITECO (Ministerio para la Transición Ecológica) webpage: https://www.miteco.gob.es/es/agua/temas/evaluacion-de-los-recursos-hidricos/saih/. Here you can access the different drainage basins and find the data of each stream gauge. Also information about rain gauges can be found. The second way is to use the file "stream_gauges_med_coast.geojson". Each stream gauge has a property called "ficha" that directs to the data. This link seems to be a deprecated service that is still working.
- ACA (Agència Catalana d'Aigües): the data can be accessed in their website: http://aca.gencat.cat/ca/laigua/consulta-de-dades/dades-obertes/dades-obertes-temps-real/. The data can be seen in their visualizer: http://aca-web.gencat.cat/aetr/vishid. Even rain in real-time can be seen there.

## Human activities
EMODnet is a great source to find information about human activities. From the visualizer (https://www.emodnet-humanactivities.eu/view-data.php) the data can be found and downloaded. Additionally, for each dataset there is a contact email for each country, thus the original source can be contacted.

In some cases, I could only find information about Spain in EMODnet. For example, in EMODnet the data about dredging could not be found in the sources that it references (MITECO, OSPAR). Similarly, the information about discharge points found in EMODnet comes from the European Environment Agency (EEA), but it can also be found in MITECO.

### [Discharge points of urban treatment plants](data/discharge_urban_treatment_plants.geojson)
There is some disparity between the data from EMODnet and MITECO. The [data from EMODnet](data/discharge_urban_treatment_plants_EMODnet.geojson) is more complete (more points), but some of the discharge points are in the coast seem to be missing in comparison to the MITECO dataset. Only the discharge points close to the coast have been kept. Question: is this related to marine outfalls (emissaris submarins)?

## Cartography
### [National Parks](data/national_parks.geojson)
There are more types of natural parks or reserves, like Natura 2000 which are not considered in this geojson. This geojson is orientative. You can find these extra protected areas here: https://www.medpan.org/SIG/MAPAMEDvisualisation.html. 

### [Rivers](data/rivers_westmed.geojson)
The river data was taken from http://www.fao.org/geonetwork/srv/en/main.home?uuid=e0243940-e5d9-487c-8102-45180cf1a99f. Other shape files of Spain can also be found here: https://www.miteco.gob.es/es/cartografia-y-sig/ide/descargas/agua/red-hidrografica.aspx. This information can also be served with a WMS service.


### In progress...
- Emissaris submarins (marine outfalls) - http://www.aiguescb.com/web/emissaris-submarins.html, 
- Radars VHF - https://bancodatos.puertos.es/BD/informes/INT_6.pdf (puertos del estado)
- Perfiladors ARGO (temps real): http://www.physocean.icm.csic.es/vado/argo/argo.geojson, http://www.physocean.icm.csic.es/vado/argo/R3901975.geojson. També es pot trobar info aquí: https://www.ocean-ops.org/board
- Vaixells de la UTM: http://data.utm.csic.es/rtp/udp/ (XXXPOS)
- Sentinels?


### Useful standards:
Open Geospatial Consortium
https://www.ogc.org/standards/eo-geojson

BlueNetCat standard
https://github.com/BlueNetCatAccio4/BlueNetCatAccio4.github.io/blob/main/geoportal/standardBlueNetCat.md

### Useful links
Emissaris submarins
Cabal del rius
http://www.ccbgi.org/ - Consorcio de la Costa Brava gestiona un total de 19 EDAR, 118 estaciones de bombeo, 20 emisarios submarinos y más de 180 Km de tuberías en alta. (https://www.aguasresiduales.info/instituciones/organismos/consorci-costa-brava)
http://www.aiguescb.com/web/emissaris-submarins.html - 12 emissaris

Parcs naturals
https://www.medpan.org/SIG/MAPAMEDvisualisation.html

Mapa OL amb rius i nuvols (catalunya només, sense província de lleida)
http://aca-web.gencat.cat/aetr/vishid

Fishing
http://www.fao.org/gfcm/data

EMODnet data petitions
https://ows.emodnet-humanactivities.eu/wfs?SERVICE=WFS&VERSION=1.1.0&request=getFeature&typeName=shellfish&bbox=-1.3,0.3,49.2,49.9&outputFormat=application/json
https://www.emodnet.eu/en/data
Service features:
https://ows.emodnet-humanactivities.eu/wfs?SERVICE=WFS&VERSION=1.1.0&request=GetCapabilities
Data visualizer:
https://www.emodnet-humanactivities.eu/view-data.php

AEMET - estacions meteo
https://www.mapama.gob.es/ide/metadatos/index.html?srv=metadata.show&uuid=f334572d-8516-4bbd-8810-6660d4018652

https://sig.mapama.gob.es/Docs/PDFServicios/AEMET_Estaciones.pdf

https://sig.mapama.gob.es/Docs/PDFServicios/SAIHCaudales.pdf

https://www.miteco.gob.es/es/cartografia-y-sig/ide/catalogo_metadatos/default.aspx

https://www.mapa.gob.es/es/cartografia-y-sig/default.aspx

Ministerios
https://www.miteco.gob.es/es/cartografia-y-sig/ide/descargas/agua/capas-saih.aspx
https://www.miteco.gob.es/es/cartografia-y-sig/ide/descargas/agua/red-hidrografica.aspx

