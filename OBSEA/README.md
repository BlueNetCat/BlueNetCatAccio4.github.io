# OBSEA Data
The underwater observatory collects data in real-time. It has been collecting data since around 2000. Currently their dashboard only shows data from the last 48h. The objective is to visualize and download historical data. The old database was not indexed and some of the streams had samples every 15 seconds. When asking data for a long period of time, the query took too long and the data had too much resolution.

## Backend
Enoc has been testing different tecnologies to speed up and organize the database and backend. The data can be served and visualized now from SensorThings API, PostgreSQL, ERDDAP, CKAN and Graphana. He wrote scripts that resample the datastreams with a lower temporal resolution (e.g., a sample every 15min) in order to reduce the size, transmission and handling of the data files.

## Pending decisions
- Front-end design
- Login required?
- API security, performance and access
- Graphana or Highcharts for front-end
- Additional visualizations to datastreams, such as average and std of measurement per day/week

## TODO
- [ ] Visualization of historical data, e.g. annual with the new backend (SensorThings API)
- [ ] Visualize per instrument (buoy) or unit (temperature)
- [ ] Download data from ERDDAP, SensorThings, CKAN, Graphan or Highcharts?
- [ ] Download and print charts?
- [ ] Visualize metadata?

## Similar projects and observatories
