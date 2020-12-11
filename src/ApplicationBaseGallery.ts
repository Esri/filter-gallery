import { subclass } from "esri/core/accessorSupport/decorators";

import ApplicationBase = require("@esri/application-base-js");
import { ApplicationConfig } from "ApplicationBase/interfaces";

import Telemetry, { TelemetryInstance } from "./telemetry/telemetry";
import Alert = require("./components/ui/Alert");

import { eachAlways } from "esri/core/promiseUtils";
import { watch, whenDefinedOnce } from "esri/core/watchUtils";

import ConfigurationSettings from './ConfigurationSettings';

@subclass("app.ApplicationBaseGallery")
class ApplicationBaseGallery extends ApplicationBase {

    config: ApplicationConfig;
    configSettings: ConfigurationSettings;

    constructor(params?: any) {
        super(params);
    }

    async loadConfig() { 
        if (this.configSettings === undefined) {
            this.configSettings = new ConfigurationSettings(this.config);
            _handleTelemetry(this.configSettings, this.portal);
        }
        await this.configSettings.applyDraft();
        let configObj = this.configSettings.toObjectLiteral();
        configObj = this.parseApplicationConfig(configObj);
        this.config = {...this.config, ...configObj};
        return Promise.resolve();
    }

    // ensure all config options parsed correctly
    parseApplicationConfig(config: any) {
        if (typeof config.allowedItemTypes === "string") {
            let types = 
                config.allowedItemTypes
                    .replace("[\"", "").replace("[\'", "")
                    .replace("\"]", "").replace("\']", "");
            if (types === "all") {
                types = "'Web Map', 'CityEngine Web Scene', 'Web Scene', '360 VR Experience', 'Pro Map', 'Feature Service', 'Map Service', 'Image Service', 'KML', 'KML Collection', 'WFS', 'WMTS', 'Feature Collection', 'Feature Collection Template', 'Vector Tile Service', 'Scene Service', 'Relational Database Connection', 'Web Mapping Application', 'StoryMap', 'Mobile Application', 'Operations Dashboard Add In', 'Native Application', 'Native Application Template', 'Native Application Installer', 'Workforce Project', 'Form', 'Insights Workbook', 'Insights Model', 'Insights Page', 'Dashboard', 'Hub Initiative', 'Hub Site Application', 'Hub Page', 'AppBuilder Widget Package', 'Symbol Set', 'Color Set', 'Shapefile', 'File Geodatabase', 'CSV', 'CAD Drawing', 'Service Definition', 'Microsoft Word', 'Microsoft Powerpoint', 'Microsoft Excel', 'PDF', 'Image', 'Visio Document', 'iWork Keynote', 'iWork Pages', 'iWork Numbers', 'Report Template', 'Statistical Data Collection', 'Map Document', 'Map Package', 'Mobile Basemap Package', 'Mobile Map Package', 'Tile Package', 'Vector Tile Package', 'Project Package', 'Task File', 'ArcPad Package', 'Explorer Map', 'Document Link', 'Globe Document', 'Scene Document', 'Published Map', 'Map Template', 'Windows Mobile Package', 'Pro Map', 'Layout', 'Project Template', 'Layer', 'Layer Package', 'Explorer Layer', 'Scene Package', 'Image Collection', 'Desktop Style', 'Geoprocessing Package', 'Geoprocessing Package (Pro version)', 'Geoprocessing Sample', 'Locator Package', 'Rule Package', 'Raster function template', 'ArcGIS Pro Configuration', 'Workflow Manager Package', 'Desktop Application', 'Desktop Application Template', 'Code Sample', 'Desktop Add In', 'Explorer Add In', 'ArcGIS Pro Add In', 'Geometry Service', 'Geocoding Service', 'Network Analysis Service', 'Geoprocessing Service', 'Workflow Manager Service', 'Application', 'Big Data File Share', 'Web Tool', 'Notebook', 'Deep Learning Package', 'Web Experience', 'Web Experience Template', 'Feed'";
            }
            const split = types.split("\", \"");
            config.allowedItemTypes = split.length > 1 ? split : types.split("\', \'") as any;
        }
        return config;
    }

}
export default ApplicationBaseGallery;

async function createTelemetry(config, portal) {
    // add alert to container
    const appName = config.telemetry?.name || "filter-gallery";
    const _telemetry = await Telemetry.init({ portal, config, appName });
    _telemetry?.logPageView();
}
function _handleTelemetry(appConfig, portal) {
    // Wait until both are defined 
    eachAlways([
        whenDefinedOnce(appConfig, "googleAnalytics"),
        whenDefinedOnce(appConfig, "googleAnalyticsKey"),
        whenDefinedOnce(appConfig, "googleAnalyticsConsentMsg"),
        whenDefinedOnce(appConfig, "googleAnalyticsConsent")
    ]).then(() => {
        const alertContainer = document.createElement("container");
        document.body.appendChild(alertContainer);
        new Alert({ config: appConfig, container: alertContainer });

        createTelemetry(appConfig, portal);
        watch(appConfig, ["googleAnalytics", "googleAnalyticsConsent", "googleAnalyticsConsentMsg", "googleAnalyticsKey"], (newValue, oldValue, propertyName) => {
            createTelemetry(appConfig, portal);
        });

    });
}