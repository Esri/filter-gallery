# Filter Gallery Application

This is a group gallery built with the Esri [ArcGIS API for JavaScript v4.10](https://developers.arcgis.com/javascript/) and the Esri [Application-Base](https://github.com/Esri/application-base-js)

## Configuration

`src/config/application.json` contains settings that may be altered to change the appearance and behavior of the application. The configurable options included with this application (in addition to the existing boilerplate options) are as follows:

- `"group"`: The ID of the group that the gallery should point to.
- `"portalUrl"`: The URL for the portal that the gallery should point to.
- `"title"`: The title of the gallery (only shown if `headHTML` option is not set)
- `"allowedItemTypes"`: Array of all item types permitted in the gallery. Item types must be listed as the exact name corresponding with the REST API: https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm . By default all item types are included.
- `"compassWidget"`: Controls the rendering of a [Compass](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Compass.html) widget on gallery-embedded in maps and scenes.
- `"homeWidget"`: Controls the rendering of a [Home](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Home.html) widget in maps and scenes.
- `"legendWidget"`: Controls the rendering of a [Legend](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Legend.html) widget in maps and scenes.
- `"locateWidget"`: Controls the rendering of a [Locate](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Locate.html) widget in maps and scenes.
- `"searchWidget"`: Controls the rendering of a [Search](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Search.html) widget in maps and scenes.
- `"basemapGalleryWidget"`: Controls the rendering of a [Basemap Gallery](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-BasemapGallery.html) widget in maps and scenes.
- `"resultsPerQuery"`: Controls how many results are returned per query to the portal Search API. This is equivalent to how many items are shown per page.
- `"useOrgCategories"`: If set to true, will use the organization's categories instead of those associated with the group. Note that organization categories are only available for signed-in organizational users. They will not be visible for public users.
- `"filters"`: Array of filters to show in the gallery. Options are `categories`, `itemType`, `created`, `modified`, `shared`, `status`, and `tags`. If no filters are included in this array, then the button to open the "filter" panel will not be shown.
- `"sortOptions"`: Array of sort options available in the gallery. Options are `relevance`, `title`, `owner`, `created`, `modified`, and `numviews`. If no sort options are included in this array, then the button to open the "sort" dropdown will not be shown.
- `"availableItemTypeFilters"`: Array of item type filters to show in the gallery. Options are `maps`, `webMaps`, `mapFiles`, `layers`, `featureLayers`, `tileLayers`, `mapImageLayers`, `imageryLayers`, `sceneLayers`, `tables`, `layerFiles`, `scenes`, `apps`, `webApps`, `mobileApps`, `desktopApps`, `tools`, `locators`, `geodatabaseAccess`, `geometricOperations`, `geoprocessingTasks`, `networkAnalysis`, `files`, `documents`, `images`, `pdfs`, and `notebooks`. By default all item type filters are available.
- `"headHTML"`: String of HTML to render instead of the default header. This can be used to customize the content in the header of the gallery.
- `"customCSS"`: String of custom CSS to inject into the application. This can be used to customize the appearance of the gallery. 

*For the widget options, setting to an empty string or null will disable the widget. Setting to `"top-left"`, `"top-right"`, `"bottom-right"` or `"bottom-left"` will render the widget in the corresponding position of the map.*


## Development

If you wish to build additional functionality into the application, development dependencies, unit tests, and convenient npm scripts are available in this repository. First, clone the repository and install the dependencies using `npm i`.

Once the operation is complete, `npm start` will compile the TypeScript to JavaScript in the `/dist/` directory. It will also watch the `/src/` directory for changes to the source TypeScript files, and transpile them to JavaScript in the `/dist/` directory as you edit.

You can run the test suite with `npm test` to help determine if the basic functionality of the application is intact.

## Deployment

When ready to deploy the application, serve the contents of the `/dist/` directory from your favorite web server.

## Issues

Found a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing

Anyone and everyone is welcome to contribute.

## Licensing

Copyright 2018 Esri

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.​

A copy of the license is available in the repository's [LICENSE](./LICENSE) file.