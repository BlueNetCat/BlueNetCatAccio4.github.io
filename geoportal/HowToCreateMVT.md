# Guide to create Mapbox Vector Tiles
One of the issues of vector data contained in a static file (e.g. geojson) is that high resolution is not often recommended because the file will be large and heavy to visualize. Mapbox already addressed this issue and proposed the Mapbox Vector Tiles (MVT), which serves vector data in a similar way as Web Map Tile Service (WMTS). It is fast and lightweight (a geojson of 800MB is reduced to 150MB of multiple .pbf files).

It is possible to convert shapefiles or geojson to MVT and to provide the data to the client even without a server. In this document the steps to do so are described.

## Requirements
You need to work with Linux and install these packages:
- [tipppecanoe](https://github.com/mapbox/tippecanoe)
- [mbutil](https://github.com/mapbox/mbutil)

## Steps
### 0. Transform your data to geojson if it isn't
Install gdal and transform the data
```
brew install gdal
or
conda install -c conda-forge gdal
conda create -n mygdal gdal
source activate mygdal

ogr2ogr -f GeoJSON in.geojson -t_srs EPSG:4326 your_data.shp
```
### 1. Create a .mbtiles file with tippecanoe
```
tippecanoe -zg -o out.mbtiles --drop-densest-as-needed in.geojson
```
The .mbtiles file can be decompressed into .pbf files, which contain the final vector data but gzipped. The .mbtiles file is the recommended option if you want to have a service to provide MVTs.
### 2. Decompress the .mbtiles file with mb-util
```
mb-util --image_format=pbf out.mbtiles outDirectory
```
### 3. Unzip the .pbf files
```
gzip -d -r -S .pbf *
```
### 4. Add the .pbf extension (it was removed in the previous step)
```
find . -type f -exec mv '{}' '{}'.pbf \;
```

## Example with Openlayers
You should be able to visualize your MVT with this code
```
var map = new ol.Map({
        layers: [
          new ol.layer.VectorTile({
            source: new ol.source.VectorTile({
              attributions:
                '© <your attributions>',
              format: new ol.format.MVT(),
              url: 'outDirectory/{z}/{x}/{y}.pbf',
              maxZoom: 5, // Largest folder num in outDirectory
              zDirection: -1 // Higher quality
            }),
          }) ],
        target: 'my-html-container-id',
        view: new ol.View({
          center: [0, 0],
          zoom: 2,
        }),
      });
```

## Full pipeline
Download the shoreline from:
https://shoreline.noaa.gov/data/datasheets/pgs.html

Unzip all files
```
unzip *.zip -d extratedFiles
```
Merge files with ogrmerge.py
```
conda create -n mygdal gdal
source activate mygdal
ogrmerge.py -single -o merge.shp 01.shp 02.shp
ogrmerge.py -single -o merge.shp 03.shp 04.shp -append
...
```
You can visualize the shapefile in https://mapshaper.org/
```
# Transform to GeoJSON
ogr2ogr -f GeoJSON shoreline.geojson -t_srs EPSG:4326 merge.shp

tippecanoe -zg -o shoreline.mbtiles --drop-densest-as-needed shoreline.geojson

# Get pbf tiles
mb-util --image_format=pbf shoreline.mbtiles shoreline-tiles

# Decompress and rename
cd shoreline-tiles
gzip -d -r -S .pbf *
find . -type f -exec mv '{}' '{}'.pbf \;
mv metadata.json.pbf metadata.json
```
