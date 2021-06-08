# OBSEA Data
The underwater observatory collects data in real-time. It has been collecting data since around 2000. Currently their dashboard only shows data from the last 48h. The objective is to visualize and download historical data. The old database was not indexed and some of the streams had samples every 15 seconds. When asking data for a long period of time, the query took too long and the data had too much resolution.

## Backend
Enoc has been testing different tecnologies to speed up and organize the database and backend. The data can be served and visualized now from SensorThings API, PostgreSQL, ERDDAP, CKAN and Grafana. He wrote scripts that resample the datastreams with a lower temporal resolution (e.g., a sample every 15min) in order to reduce the size, transmission and handling of the data files.

### Issues
SensorThings API in Grafana has a bug when plotting lines (end of line is connected to beginning of line, creating strange horizontal lines on the plot).

### How to publish visualizations with [Grafana](https://grafana.com/)
Three different levels of access: Editor, Admin, Viewer.
Viewer: a user with Viewer role can still issue any possible query to a data source, not just those queries that exist on dashboards he/she has access to. [ref](https://grafana.com/docs/grafana/latest/permissions/)

You can give access to anyone as viewer, but they will be able to query to a data source, i.e. PostgreSQL. [ref](https://grafana.com/docs/grafana/latest/auth/grafana/#anonymous-authentication) :
- Anyone with the URL can access the dashboard.
- Anyone can make view calls to the API and list all folders, dashboards, and data sources.
- Anyone can make arbitrary queries to any data source that the Grafana instance is configured with.
[ref](https://grafana.com/docs/grafana/latest/administration/security/)

#### Grafana Snapshots
When you share a panel or dashboard as a snapshot, a snapshot (of the panel or the dashboard at that moment in time) is publicly available on the web. Anyone with a link to it can access it. Since snapshots do not need any authorization to view, Grafana strips information related to the account it came from, as well as any sensitive data from the snapshot. [ref](https://grafana.com/docs/grafana/latest/sharing/)

#### Grafana embedding
You can embed a panel using an iframe on another web site. Unless anonymous access permission is enabled, the viewer must be signed into Grafana to view the graph. [ref](https://grafana.com/docs/grafana/latest/sharing/share-panel/)



## Pending decisions
- Front-end design
- Login required?
- API security, performance and access
- Graphana or Highcharts for front-end
- Additional visualizations to datastreams, such as average and std of measurement per day/week

## TODO
- [x] Visualization of historical data, e.g. annual with the new backend (SensorThings API)
- [x] Visualize per instrument (buoy) or unit (temperature)
- [ ] Download data from ERDDAP, SensorThings, CKAN, Graphan or Highcharts?
- [ ] Download and print charts?
- [ ] Visualize metadata?

## Similar projects and observatories
- Marine Institute: http://smartbay.marine.ie/

- Canada ocean networks:
https://oceannetworks.ca/science
https://data.oceannetworks.ca/home?TREETYPE=1&LOCATION=1052&DEVICECATEGORY=20&SENSORCODE=380&TIMECONFIG=3


- EMSO
http://emso.eu/data/
http://emso.eu/observatories/#map

https://data.emso.eu/home
https://data.emso.eu/general_dashboard

- EMODNET
https://www.emodnet-physics.eu/map/DefaultMap.aspx?sessionid=636662147564970891
