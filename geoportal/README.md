The geojsons are limited to the Catalan Sea and the Western Mediterranean. The information coming from third parties has been often modified and reduced in this repository. If you want full datasets, you can find the source in the header or ask the BlueNetCat organization (email in the header).

## Items
### [Buoys](data/buoys.geojson)
Most of the buoys come from Puertos del Estado. The data can be downloaded through their visualizer: http://www.puertos.es/es-es/oceanografia/Paginas/portus.aspx. I don't know if there is a service to do queries for real-time data. The data from the buoy of l'Estartit can be seen and accessed here: https://estartit.icm.csic.es/
### [Tide gauges (mareogràfs)]((data/tide_gauges.geojson))
Same as the buoys.

### Stream gauges (aforament rius) ([ACA](data/stream_gauges_ACA.geojson) and [SAIH](data/stream_gauges_med_coast.geojson))
- ACA (Agència Catalana d'Aigües): the data can be accessed in their website: http://aca.gencat.cat/ca/laigua/consulta-de-dades/dades-obertes/dades-obertes-temps-real/. The data can be seen in their visualizer: http://aca-web.gencat.cat/aetr/vishid. Even rain in real-time can be seen there.
- SAIH (Sistemas Automáticos de Información Hidrológica): the data can be accessed two ways. The first way is in this webpage: https://www.miteco.gob.es/es/agua/temas/evaluacion-de-los-recursos-hidricos/saih/. Here you can access the different drainage basins and find the data of each stream gauge. Also other information about rain gauges can be found. The second way is to use the file "stream_gauges_med_coast.geojson". Each stream gauge has a property called "ficha" that directs to the data. This seems to be a deprecated service that is still working.

### [Webcams](data/webcams.geojson)
Not much to say here, the data can be found on each geojson feature. Some webcams are real-time and others provide a picture of the last hour or so. I still need to collect webcams from outside Catalunya.

### Rivers
- Rivers: aquesta informació també es pot obtenir a partir d'un servei de Tiles WMS
- Natural parks (MAPAMED)
- Weather stations (AEMET)

### In progress...
- Emissaris submarins (marine outfalls) - http://www.aiguescb.com/web/emissaris-submarins.html, 
- Instal·lacions d'aqüicultura (aquaculture)- EMODnet https://www.emodnet-humanactivities.eu/view-data.php
- Radars VHF - https://bancodatos.puertos.es/BD/informes/INT_6.pdf (puertos del estado)
- Cabal de rius - Aquí també hi ha info: http://aca-web.gencat.cat/aetr/vishid
- Pluviometres - (Estan inclosos a Weather stations) info aquí, s'ha de reformatejar: http://aca.gencat.cat/ca/laigua/consulta-de-dades/dades-obertes/dades-obertes-temps-real/
- Perfiladors ARGO (temps real): http://www.physocean.icm.csic.es/vado/argo/argo.geojson, http://www.physocean.icm.csic.es/vado/argo/R3901975.geojson
- Vaixells de la UTM: http://data.utm.csic.es/rtp/udp/ (XXXPOS)
- Sentinels?
- Aforament rius


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

