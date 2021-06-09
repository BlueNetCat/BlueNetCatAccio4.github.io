The geojsons are limited to the Catalan Sea and the Western Mediterranean. The information coming from third parties has been often modified and reduced in this repository. If you want full datasets, you can find the source in the header or ask the BlueNetCat organization (email in the header).

This site should provide information about how to download/access the data.

## Measurements
Most information can be found in https://www.emodnet-physics.eu/Map/. Even the data can be downloaded from there.

### [Buoys](data/buoys.geojson)
Most of the buoys come from Puertos del Estado. The data can be downloaded through their visualizer: http://www.puertos.es/es-es/oceanografia/Paginas/portus.aspx. I don't know if there is a service to do queries for real-time data. The data from the buoy of l'Estartit can be seen and accessed here: https://estartit.icm.csic.es/. The data from the OBSEA buoy can be found here: https://obsea.es/dashboard/. The French buoys can be found here: http://candhis.cetmef.developpement-durable.gouv.fr/carte/.

What about Besos-SARTI? https://sarti.webs.upc.edu/web/?p=2788

Other observatories (OBSEA included): http://www.fixo3.eu/observatory/, http://earthvo.fixo3.eu/

### [Tide gauges (mareogràfs)](data/tide_gauges.geojson)
Same as the buoys from Puertos del Estado for Spain. For France, the information can be found here: https://data.shom.fr/donnees/catalogue/observation.

### [Weather stations (Spain)](data/weather_stations_med.geojson)
In principle you should be able to get the data from https://opendata.aemet.es/centrodedescargas/inicio for the Spanish weather stations. An API key is needed to access it. You can use the id of each station in the geojson to find the data in the AEMET website. In our geojson, four different kinds of weather stations are mixed: complete stations, automatic stations, rain gauges and thermometric.

### [Radars HF for currents](data/radars.geojson)
For the radars coming from Puertos del Estado, you can check http://www.puertos.es/es-es/oceanografia/Paginas/portus.aspx. There is even a forecast system for currents. For the currents in Ibiza, you can check the SOCIB website: https://www.socib.es/?seccion=observingFacilities&facility=radar. For the French Med coast, you can find info here: http://hfradar.univ-tln.fr/

### [Webcams](data/webcams.geojson)
Not much to say here, the data can be found on each geojson feature. Some webcams are real-time and others provide a picture of the last hour or so. I still need to collect webcams from outside Catalunya.

### [Stream gauges (aforament rius)](data/stream_gauges_med_coast.geojson)
- SAIH (Sistemas Automáticos de Información Hidrológica): only the stations close to the coast have been kept. In the original dataset there are many more locations. The data can be accessed two ways. The first way is in the MITECO (Ministerio para la Transición Ecológica) webpage: https://www.miteco.gob.es/es/agua/temas/evaluacion-de-los-recursos-hidricos/saih/. Here you can access the different drainage basins and find the data of each stream gauge. Also information about rain gauges can be found. The second way is to use the file "stream_gauges_med_coast.geojson". Each stream gauge has a property called "ficha" that directs to the data. This link seems to be a deprecated service that is still working.
- ACA (Agència Catalana d'Aigües): the data can be accessed in their website: http://aca.gencat.cat/ca/laigua/consulta-de-dades/dades-obertes/dades-obertes-temps-real/. The data can be seen in their visualizer: http://aca-web.gencat.cat/aetr/vishid. Even rain in real-time can be seen there.

### [Air quality stations](data/air_quality_stations_spain.geojson)
The data from Spain comes from MITECO (Ministerio para la Transición Ecológica y el Reto Demográfico). The values can be seen in real-time here: https://sig.mapama.gob.es/calidad-aire/. TODO: france

### Ocean Color (AERONETC CASABLANCA)
https://aeronet.gsfc.nasa.gov/cgi-bin/data_display_inv_v3?site=Casablanca_Platform&nachal=2&level=2&place_code=10&DATA_TYPE=76


## Human activities
EMODnet is a great source to find information about human activities. From the visualizer (https://www.emodnet-humanactivities.eu/view-data.php) the data can be found and downloaded. Additionally, for each dataset there is a contact email for each country, thus the original source can be contacted. Also the original sources are referenced: https://www.emodnet-humanactivities.eu/sources.php

In some cases, I could only find information about Spain in EMODnet. For example, in EMODnet the data about dredging could not be found in the sources that it references (MITECO, OSPAR). Similarly, the information about discharge points found in EMODnet comes from the European Environment Agency (EEA), but it can also be found in MITECO.

### [Discharge points of urban treatment plants](data/discharge_urban_treatment_plants.geojson)
There is some disparity between the data from EMODnet and MITECO. The [data from EMODnet](data/discharge_urban_treatment_plants_EMODnet.geojson) is more complete (more points), but some of the discharge points that are in the coast seem to be missing in comparison to the MITECO dataset. Only the discharge points close to the coast have been kept.

A better source for discharge points is the [Urban Waste Water Treatment Directive (UWWTD) site for Europe](https://uwwtd.eu/). For example, information about compliance with the EU directive and linked treatment plants is given. Unfortunatelly, the download links do not work at this moment (10 Febraury 2021) (https://uwwtd.eu/Spain/download) and getting the data required a bit of processing from the web interface. For France, we used the UWWTD source to find the [discharge points in the region](data/discharge_urban_treatment_plants_france.geojson).

### Aquaculture installations
Regarding Spanish aquaculture, the best source is here: https://servicio.pesca.mapama.es/acuivisor/. Aquaculture installations can be found in EMODnet: https://www.emodnet-humanactivities.eu/view-data.php. TODO: France?

## Cartography
### [National Parks](data/national_parks.geojson)
There are more types of natural parks or reserves, like Natura 2000 which are not considered in this geojson. This geojson is orientative. You can find these extra protected areas here: https://www.medpan.org/SIG/MAPAMEDvisualisation.html. 

### [Rivers](data/rivers_westmed.geojson)
The river data was taken from the Food and Agriculture Organization of the United Nations (http://www.fao.org/geonetwork/srv/en/main.home?uuid=e0243940-e5d9-487c-8102-45180cf1a99f). Other shape files of Spain can also be found here: https://www.miteco.gob.es/es/cartografia-y-sig/ide/descargas/agua/red-hidrografica.aspx. This information can also be served with a WMS service.

### [Shoreline](data/shoreline_spain.geojson)
A highly detailed Spanish shoreline can be found in the Instituto Geográfico Nacional (http://www.ign.es/web/ign/portal/ide-area-nodo-ide-ign). Another option is the shoreline provided by NOAA: https://shoreline.noaa.gov/data/datasheets/pgs.html. It has high resolution but it lacks straight lines (the coast looks bumpy sometimes). The shoreline provided by the European Environment Agency (EEA) has lower quality, at least in Spain. Here is the link: https://www.eea.europa.eu/data-and-maps/data/eea-coastline-for-analysis-1/gis-data/europe-coastline-shapefile

### In progress...
- Perfiladors ARGO (temps real): http://www.physocean.icm.csic.es/vado/argo/argo.geojson, http://www.physocean.icm.csic.es/vado/argo/R3901975.geojson. També es pot trobar info aquí: https://www.ocean-ops.org/board
- Vaixells de la UTM: http://data.utm.csic.es/rtp/udp/ (XXXPOS)
- Sentinels?
- Underwater acoustics: Is there anything in Western Mediterranean? Nothing on EMODnet-Physics... OBSEA seems to be doing something. Here is a compilation: http://listentothedeep.com/acoustics/index.php
- Macroalgae quality (heavy metals)?
- Discharge channels to sea
- Water contamination map?
- Plastics contamination map?
- MOOSE (Lyon mooring) https://www.moose-network.fr/
- Oil spill reponse vessels (almost none in WestMed) (http://emsa.europa.eu/we-do/sustainability/pollution-response-services/oil-recovery-vessels.html)

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

