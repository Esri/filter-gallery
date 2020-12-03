import { subclass, property } from "esri/core/accessorSupport/decorators";
import Widget = require("esri/widgets/Widget");
import AppConfig from "../../ConfigurationSettings";
import i18n = require("dojo/i18n!../nls/resources");
import { renderable, storeNode, tsx } from "esri/widgets/support/widget";
import { esriWidgetProps } from "ApplicationBase/support/widgetConfigUtils/widgetConfigUtils";

@subclass("Alert")
class Alert extends Widget {

    constructor(params: esriWidgetProps) {
        super(params);
    }
    alertNode: any = null;
    @property()
    portal: __esri.Portal = null;
    @property()
    @renderable(["config.theme", "config.googleAnalyticsConsent", "config.googleAnalyticsConsentMsg",
        "config.googleAnalytics", "config.googleAnalyticsKey", "config.theme"])
    config: AppConfig;


    render() {
        const enableGA = localStorage.getItem("analytics-opt-in-filter-gallery") || false;
        const { googleAnalytics, googleAnalyticsKey, theme, googleAnalyticsConsent, googleAnalyticsConsentMsg } = this.config;
        const isActive = googleAnalytics && googleAnalyticsKey !== null && googleAnalyticsConsent && !enableGA ? true : false;
        return (
            <div bind={this} >
                <calcite-alert afterCreate={storeNode} bind={this} data-node-ref="alertNode" intl-close={i18n.close} scale="s" theme={theme} active={isActive}>
                    <div slot="alert-message" innerHTML={googleAnalyticsConsentMsg} ></div>
                    <calcite-button scale="s" slot="alert-link" bind={this} afterCreate={this.handleClick} >{i18n.analyticsOptIn}</calcite-button>
                </calcite-alert>
            </div>
        );
    };
    handleClick(element) {
        element.addEventListener("click", () => {
            // Add opt-in value to local storage 
            localStorage.setItem(`analytics-opt-in-filter-gallery`, "true");
            // update config setting to trigger GA reset and 
            // prevent dialog from showing
            this.config.googleAnalyticsConsent = false;
        });
    }
}

export = Alert;