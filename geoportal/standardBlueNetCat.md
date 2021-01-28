# BlueNetCat GeoJSON standard
```javascript

{
    "type": "FeatureCollection", // GeoJSON standard
    "name": "Finfish aquaculture locations", // Name of the dataset (human readable)
    "attribution": "Data from EMODNet, modified by Gerard Llorach (gllorach@fbg.ub.edu) 2021, licensed under CC BY 2.0", // Describe author, license and attribution. BlueNetCat standard
    "source": { // Where the data comes from. BlueNetCat standard (optional)
        "href": "", // link (can be WMS)
        "type": "application/json", // text/html, application/pdf, application/json, application/xml, application/zip 
        "homepage": "", // Homepage of the source institution or the data source
        "name": "" // Name of the hosting institution
    },
    "features": [{ // GeoJSON standard
        "type": "Feature", // GeoJSON standard
        "geometry": { // GeoJSON standard
            "type": "Point",
            "coordinates": [-6.1744428, 36.441195]
        },
        "properties": { // Properties depend on the kind of data (measurement equipment, aquaculture, natural parks, marine outfalls...)
            ...
        }
    },

```

## Properties for Measurement Equipment Data (buoys, meteo-stations...) (BlueNetCat standard)
```javascript
"properties": { // Properties depend on the kind of data (measurement equipment, aquaculture, natural parks, marine outfalls...)
    "name": "Webcam de l'Estartit", // Human readable name
    "time_of_data": ["historical", "real-time", "prediction"], // Mandatory (BlueNetCat standard)
    "start_date": "1978-04-01", // Date of first measurement YYYY-MM-DD (BlueNetCat standard)
    "measures": ["",""], // What does the equipment measure (waves, pressure, images...) (BlueNetCat standard)
    "links": { // OGC EO standard (https://docs.ogc.org/is/17-003r2/17-003r2.html#26)
        "data": [
            {
                "href": "http://tpm-ds.eo.esa.int/products/SEA_GEC_1P/1978/09/27/SE1_OPER_SEA_GEC_1P_19780927T010430_19780927T010445_001316_0000_2267_9B4F.ZIP",
                "type": "application/binary",
                "title": "Download"
            }
        ],
        "previews": [
           {
               "href": "http://tpm-ds.eo.esa.int/metadata/SEA_GEC_1P/1978/09/27/SE1_OPER_SEA_GEC_1P_19780927T010430_19780927T010445_001316_0000_2267_9B4F.BI.PNG",
               "type": "image/png",
               "title": "Quicklook"
           }
        ],
        "alternates": [
            {
                "href": "http://fedeo.esa.int/opensearch/request/?httpAccept=application/atom%2Bxml&amp;parentIdentifier=SEA_GEC_1P&amp;uid=SE1_OPER_SEA_GEC_1P_19780927T010430_19780927T010445_001316_0000_2267_9B4F",
                "type": "application/atom+xml",
                "title": "Atom format"
            }
        ]
        // "qualityReport", "related", "via"
    }
}
```




## Properties Aquaculture (EMODnet standard)
```javascript
"properties": { // Properties depend on the kind of data (measurement equipment, aquaculture, natural parks, marine outfalls...)
    "country": "Spain",
    "owner_name": "ESTEROS MANGUITA, S.L.",
    "production": "Grow out for human consumption",
    "purpose": "n.a.",
    "species_detailed": "Eel (Anguilla anguilla), European seabass (Dicentrarchus labrax), Gilthead seabream (Sparus aurata), Mullet (Mugil spp.), Senegalese sole (Solea senegalensis), Spotted seabass (Dicentrarchus punctatus), White seabream (Diplodus sargus)",
    "finid": "ES_0001",
    "distance_to_coast_m": "585.283754",
    "position_coastline": "Within the coastline",
    "status": "n.a.",
    "point_info": "Original",
    "cod": "No",
    "halibut": "No",
    "lumpfish": "No",
    "eel": "Yes",
    "salmon": "No",
    "seabass": "Yes",
    "seabream": "Yes",
    "trout": "No",
    "tuna": "No",
    "tubot": "No",
    "sole": "Yes",
    "other_species": "Yes",
    "farm_type": "Diversified farm",
    "production_meth": "Saltwater ponds"
}
```
