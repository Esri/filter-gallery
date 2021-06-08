export type ItemTypeFilter = keyof ItemTypeMap;

/**
 * Mapping of item display types used in most client apps to their corresponding Q
 */
export const itemTypeMap: ItemTypeMap = {
  maps: `(type:("Project Package" OR "Windows Mobile Package" OR "Map Package" OR "Basemap Package" OR "Mobile Basemap Package" OR "Mobile Map Package" OR "Pro Map" OR "Project Package" OR "Web Map" OR "CityEngine Web Scene" OR "Map Document" OR "Globe Document" OR "Scene Document" OR "Published Map" OR "Explorer Map" OR "ArcPad Package" OR "Map Template") -type:("Web Mapping Application" OR "Layer Package"))`,
  webMaps: `(type:("Web Map" OR "CityEngine Web Scene") -type:("Web Mapping Application"))`,
  mapFiles: `(type:("Map Document" OR "Windows Mobile Package" OR "Globe Document" OR "Scene Document" OR "Published Map" OR "Explorer Map" OR "ArcPad Package" OR "Map Package" OR "Basemap Package" OR "Mobile Basemap Package" OR "Mobile Map Package" OR "Pro Map" OR "Project Package" OR "Map Template"))`,
  layers: `(type:("Scene Service" OR "Feature Collection" OR "Route Layer" OR "Layer" OR "Explorer Layer" OR "Tile Package" OR "Vector Tile Package" OR "Scene Package" OR "Layer Package" OR "Feature Service" OR "Stream Service" OR "Map Service" OR "Vector Tile Service" OR "Image Service" OR "WMS" OR "WFS" OR "WMTS" OR "KML" OR typekeywords:"OGC" OR typekeywords:"Geodata Service" OR "Globe Service" OR "CSV" OR "Shapefile" OR "GeoJson" OR "Service Definition" OR "File Geodatabase" OR "CAD Drawing" OR "Relational Database Connection") -type:("Web Mapping Application" OR "Geodata Service"))`,
  featureLayers: `(type:("Feature Collection" OR "Feature Service" OR "Stream Service" OR "WFS") -typekeywords:"Table")`,
  tileLayers: `(type:("WMTS" OR "Map Service" OR "Vector Tile Service") typekeywords:("Hosted" OR "Tiled"))`,
  mapImageLayers: `(type:("Map Service" OR "WMS") -typekeywords:("Tiled") -type:("Web Map" OR "Web Mapping Application" OR "Shapefile"))`,
  imageryLayers: `(type:"Image Service")`,
  sceneLayers: `(type:"Scene Service")`,
  tables: `(typekeywords:Table)`,
  layerFiles: `(type:("Layer" OR "Explorer Layer" OR "Tile Package" OR "Vector Tile Package" OR "Scene Package" OR "Layer Package" OR "CSV" OR "Shapefile" OR "GeoJson" OR "Service Definition" OR "File Geodatabase" OR "CAD Drawing" OR "Microsoft Excel") -type:("Explorer Maps" OR "Map Documents"))`,
  scenes: `(-type:"CityEngine Web Scene" type:"Web Scene")`,
  apps: `(type:("Code Sample" OR "Web Mapping Application" OR "StoryMap" OR "Mobile Application" OR "Application" OR "Desktop Application Template" OR "Desktop Application" OR "Operation View" OR "Dashboard" OR "Operations Dashboard Extension" OR "Workforce Project" OR "Insights Workbook" OR "Insights Page" OR "Insights Model" OR "Hub Page" OR "Hub Initiative" OR "Hub Site Application" OR "Web Experience" OR "Web Experience Template" OR "Form"))`,
  webApps: `(type:("Web Mapping Application" OR "Dashboard"))`,
  storyMaps: `(type:"StoryMap")`,
  experienceApps: `(type:("Web Experience" OR "Web Experience Template"))`,
  mobileApps: `(type:"Mobile Application")`,
  desktopApps: `(type:"Desktop Application" -type:"Desktop Application Template")`,
  tools: `((typekeywords:"tool" OR type:"Raster function template" OR type:"Geodata Service" OR type:"Workflow Manager Package" OR type:"Rule Package" OR type:"Operations Dashboard Add In" OR type:"Workflow Manager Service" OR type:"ArcGIS Pro Configuration"  OR (type:"Geoprocessing Service" AND typekeywords: "Web Tool")) -type:"KML")`,
  locators: `(type:("Geocoding Service" OR "Locator Package"))`,
  geodatabaseAccess: `(type:"Geodata Service")`,
  geometricOperations: `(type:"Geometry Service")`,
  geoprocessingTasks: `(type:("Geoprocessing Service" OR "Geoprocessing Package" OR "Geoprocessing Sample"))`,
  networkAnalysis: `(type:"Network Analysis Service")`,
  files: `((typekeywords:"Document" OR "Document Link" OR type:"CSV" OR type:"Image" OR type:"Layout" OR type:"Desktop Style" OR type:"Project Template" OR type:"Report Template" OR type:"Statistical Data Collection" OR type:"360 VR Experience" OR type:"netCDF") -type:("Map Document" OR "Image Service" OR "Explorer Document" OR "Explorer Map" OR "Globe Document" OR "Scene Document" OR "Microsoft Excel"))`,
  documents: `(typekeywords:"Document" -type:"PDF")`,
  images: `(type:("Image" OR "360 VR Experience") -type:"Image Service")`,
  pdfs: `(type:"PDF")`,
  csvs: `(type:"CSV")`,
  webTools: '(type:"Geoprocessing Service" AND typekeywords: "Web Tool")',
  notebooks:
    '(type:("Notebook") OR typekeywords:("Notebook" OR "Jupyter Notebook"))',
  bigDataFileShares: 'type:("Big Data File Share")',
  rasterFunctionTemplates: 'type:("Raster function template")',
  deepLearningPackages: 'type:("Deep Learning Package")'
};

/**
 * Array of all supported item types
 */
export const allItemTypes: ItemType[] = [
  "Web Map",
  "CityEngine Web Scene",
  "Web Scene",
  "360 VR Experience",
  "Pro Map",
  "Feature Service",
  "Map Service",
  "Image Service",
  "KML",
  "KML Collection",
  "WFS",
  "WMTS",
  "Feature Collection",
  "Feature Collection Template",
  "Vector Tile Service",
  "Scene Service",
  "Relational Database Connection",
  "Web Mapping Application",
  "Mobile Application",
  "Operations Dashboard Add In",
  "Native Application",
  "Native Application Template",
  "Native Application Installer",
  "Workforce Project",
  "Form",
  "Insights Workbook",
  "Insights Model",
  "Insights Page",
  "Dashboard",
  "Hub Initiative",
  "Hub Site Application",
  "Hub Page",
  "AppBuilder Widget Package",
  "Symbol Set",
  "Color Set",
  "Shapefile",
  "File Geodatabase",
  "CSV",
  "CAD Drawing",
  "Service Definition",
  "Microsoft Word",
  "Microsoft Powerpoint",
  "Microsoft Excel",
  "PDF",
  "Image",
  "Visio Document",
  "iWork Keynote",
  "iWork Pages",
  "iWork Numbers",
  "Report Template",
  "Statistical Data Collection",
  "Map Document",
  "Map Package",
  "Mobile Basemap Package",
  "Mobile Map Package",
  "Tile Package",
  "Vector Tile Package",
  "Project Package",
  "Task File",
  "ArcPad Package",
  "Explorer Map",
  "Globe Document",
  "Scene Document",
  "Published Map",
  "Map Template",
  "Windows Mobile Package",
  "Pro Map",
  "Layout",
  "Project Template",
  "Layer",
  "Layer Package",
  "Explorer Layer",
  "Scene Package",
  "Image Collection",
  "Desktop Style",
  "Geoprocessing Package",
  "Geoprocessing Package (Pro version)",
  "Geoprocessing Sample",
  "Locator Package",
  "Rule Package",
  "Raster function template",
  "Deep Learning Package",
  "ArcGIS Pro Configuration",
  "Workflow Manager Package",
  "Desktop Application",
  "Desktop Application Template",
  "Code Sample",
  "Desktop Add In",
  "Explorer Add In",
  "ArcGIS Pro Add In",
  "Geometry Service",
  "Geocoding Service",
  "Network Analysis Service",
  "Geoprocessing Service",
  "Workflow Manager Service",
  "Big Data File Share",
  "Web Tool",
  "Notebook",
  "Web Experience",
  "Web Experience Template",
  "Feed",
  // "Document Link"
];

/**
 * Typings copied from arcgis-components typemap
 */


/**
 * Item type as listed in the sharing API documentation:
 * https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm
 */
export declare type ItemType = "WMS" | "Web Map" | "CityEngine Web Scene" | "Web Scene" | "360 VR Experience" | "Pro Map" | "Feature Service" | "Map Service" | "Image Service" | "KML" | "KML Collection" | "WFS" | "WMTS" | "Feature Collection" | "Feature Collection Template" | "Vector Tile Service" | "Scene Service" | "Relational Database Connection" | "Web Mapping Application" | "StoryMap" | "Mobile Application" | "Code Attachment" | "Operations Dashboard Add In" | "Native Application" | "Native Application Template" | "Native Application Installer" | "Workforce Project" | "Form" | "Insights Workbook" | "Insights Model" | "Insights Page" | "Dashboard" | "Hub Initiative" | "Hub Site Application" | "Hub Page" | "AppBuilder Widget Package" | "Symbol Set" | "Color Set" | "Shapefile" | "File Geodatabase" | "CSV" | "CAD Drawing" | "Service Definition" | "Microsoft Word" | "Microsoft Powerpoint" | "Microsoft Excel" | "PDF" | "Image" | "Visio Document" | "iWork Keynote" | "iWork Pages" | "iWork Numbers" | "Report Template" | "Statistical Data Collection" | "Map Document" | "Map Package" | "Mobile Basemap Package" | "Mobile Map Package" | "Tile Package" | "Vector Tile Package" | "Project Package" | "Task File" | "ArcPad Package" | "Explorer Map" | "Globe Document" | "Scene Document" | "Published Map" | "Map Template" | "Windows Mobile Package" | "Pro Map" | "Layout" | "Project Template" | "Layer" | "Layer" | "Layer Package" | "Explorer Layer" | "Scene Package" | "Image Collection" | "Desktop Style" | "Geoprocessing Package" | "Geoprocessing Package (Pro version)" | "Geoprocessing Sample" | "Locator Package" | "Rule Package" | "Raster function template" | "Deep Learning Package" | "ArcGIS Pro Configuration" | "Workflow Manager Package" | "Desktop Application" | "Desktop Application Template" | "Code Sample" | "Desktop Add In" | "Explorer Add In" | "ArcGIS Pro Add In" | "Geometry Service" | "Geocoding Service" | "Network Analysis Service" | "Geoprocessing Service" | "Workflow Manager Service" | "Stream Service" | "Big Data File Share" | "Web Tool" | "Notebook" | "Web Experience" | "Web Experience Template" | "Feed";

export interface ItemTypeMap {
    maps: string;
    webMaps: string;
    mapFiles: string;
    layers: string;
    featureLayers: string;
    tileLayers: string;
    mapImageLayers: string;
    imageryLayers: string;
    sceneLayers: string;
    tables: string;
    layerFiles: string;
    scenes: string;
    apps: string;
    webApps: string;
    storyMaps: string;
    experienceApps: string;
    mobileApps: string;
    desktopApps: string;
    tools: string;
    locators: string;
    geodatabaseAccess: string;
    geometricOperations: string;
    geoprocessingTasks: string;
    networkAnalysis: string;
    files: string;
    documents: string;
    images: string;
    pdfs: string;
    csvs: string;
    webTools: string;
    notebooks: string;
    bigDataFileShares: string;
    rasterFunctionTemplates: string;
    deepLearningPackages: string;
}