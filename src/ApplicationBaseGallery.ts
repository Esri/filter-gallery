import { subclass } from "esri/core/accessorSupport/decorators";

import ApplicationBase = require("@esri/application-base-js");
import { ApplicationConfig } from "ApplicationBase/interfaces";

import ConfigurationSettings from "./ConfigurationSettings";

@subclass("app.ApplicationBaseGallery")
class ApplicationBaseGallery extends ApplicationBase {

    config: ApplicationConfig;

    constructor(params?: any) {
        super(params);
    }

    loadConfig() {
        let config = new ConfigurationSettings(this.config);
        let configObj = config.toObjectLiteral();
        this.config = {...this.config, ...configObj};
    }

}
export default ApplicationBaseGallery;