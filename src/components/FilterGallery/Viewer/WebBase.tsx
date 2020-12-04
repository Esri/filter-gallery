import i18n = require("dojo/i18n!../../../nls/resources");
import { Component, H, connect } from "../../../Component";

import all = require("dojo/promise/all");
import promiseUtils = require("esri/core/promiseUtils");
import LoaderBars from "../../Loaders/LoaderBars";
import { FilterGalleryStore } from "../../..";
import widgetMapping from "./_utils/widgetMapping"; //Widget 2 of 2

interface WebBaseProps {
    key: string;
    webModule: string;
    viewModule: string;
    widgets: { [propName: string]: string };
    itemId: string;
    containerId: string;
    closing: boolean;
}

interface WebBaseState {
    status: string;
    loadText: string;
}

export class WebBase extends Component<WebBaseProps, WebBaseState> {
    private map: __esri.WebMap | __esri.WebScene;
    private view: __esri.View;

    constructor(props: WebBaseProps) {
        super(props);

        this.state = {
            status: "loading",
            loadText: "scripts"
        };

        this.loadScripts = this.loadScripts.bind(this);
        this.loadMap = this.loadMap.bind(this);
        this.loadWidgets = this.loadWidgets.bind(this);
    }

    public componentWillReceiveProps(nextProps: WebBaseProps) {
        if (!this.props.closing && nextProps.closing && this.view && this.view.container) {
            this.view.container = null as any;
        }
    }
    
    public componentDidConnect() {
        this.loadScripts();
    }

    public render(tsx: H) {
        if (this.state.status === "loaded") {
            return <div key={this.props.key} />;
        } else if (this.state.status === "loading") {
            return (
                <div key={this.props.key}>
                    <LoaderBars
                        key="loading-map"
                        text={i18n.viewer.viewLoading[this.state.loadText]}
                    />
                </div>
            );
        }
        return (
            <div key={this.props.key}>
                <h3 class="fg-viewer__center">{i18n.viewer.viewLoading.failed}</h3>
            </div>
        );
    }

    private loadScripts() {
        promiseUtils.create(
            (resolve, reject) => { 
                require(["esri/WebMap", "esri/WebScene", "esri/views/MapView", "esri/views/SceneView"], 
                        (WebMap, WebScene, MapView, SceneView) => {
                            return resolve([WebMap, WebScene, MapView, SceneView]);
                        }
                ); 
            }
        ).then(
            ([WebMap, WebScene, MapView, SceneView]) => {
                const webModule = this.props.webModule === "esri/WebMap" ? WebMap :
                        this.props.webModule === "esri/WebScene" ? WebScene : 
                        WebMap; // default to WebMap
                const viewModule = this.props.viewModule === "esri/views/MapView" ? MapView :
                                this.props.viewModule === "esri/views/SceneView" ? SceneView :
                                MapView; // default to MapView
                this.setState({ loadText: "map" });
                this.loadMap(webModule, viewModule);  
            },
            (err) => {
                this.setState({ status: "failed" });
            }
        );
    }

    private loadMap(
        WebConstructor: __esri.WebMapConstructor,
        ViewConstructor: __esri.MapViewConstructor
    ) {
        this.map = new WebConstructor({
            portalItem: {
                id: this.props.itemId
            }
        });
        this.map.load().then(() => {
            this.setState({ loadText: "basemap" });
            return this.map.basemap.load();
        }).then(() => {
            this.setState({ loadText: "layers" });
            const allLayers = this.map.allLayers;
            const promises = allLayers.map((layer) => layer.load());
            return all(promises.toArray() as any) as any;
        }).then((layers: any) => {
            this.setState({ loadText: "widgets" });
            this.view = new ViewConstructor({
                container: this.props.containerId,
                map: this.map
            });
            return this.loadWidgets(this.view as any);
        }).then(() => {
            this.view.container = this.props.containerId as any;
            this.setState({ status: "loaded" });
        }).catch((err: any) => {
            this.setState({ status: "failed" });
        });
    }

    private loadWidgets(view: __esri.MapView) {
        const positions = {
            "bottom-left": true,
            "bottom-right": true,
            "top-left": true,
            "top-right": true
        };
        const modules = Object.keys(this.props.widgets).reduce((p, c, i) => {
            if (positions[this.props.widgets[c]]) {
                p.push({
                    module: widgetMapping[c],
                    position: this.props.widgets[c]
                } as never); // typescript is weird
            }
            return p;
        },                                                     []);
        let constructorKey: object = {};
        return promiseUtils.create(
            (resolve, reject) => { 
                // tslint:disable-next-line: max-line-length
                require(["esri/widgets/Compass", "esri/widgets/Home", "esri/widgets/Legend", "esri/widgets/Locate", "esri/widgets/Search", "esri/widgets/BasemapGallery", "esri/widgets/Expand", "esri/widgets/BasemapToggle"], 
                        (Compass, Home, Legend, Locate, Search, BasemapGallery, Expand, BasemapToggle) => {
                            constructorKey = {
                                "esri/widgets/Compass": Compass, 
                                "esri/widgets/Home": Home, 
                                "esri/widgets/Legend": Legend, 
                                "esri/widgets/Locate": Locate, 
                                "esri/widgets/Search": Search, 
                                "esri/widgets/BasemapGallery": BasemapGallery, 
                                "esri/widgets/Expand": Expand,
                                "esri/widgets/BasemapToggle": BasemapToggle
                            };
                            return resolve([Compass, Home, Legend, Locate, Search, BasemapGallery, Expand, BasemapToggle]);
                        }
                ); 
            }).then(([Compass, Home, Legend, Locate, Search, BasemapGallery, Expand, BasemapToggle]) => {
                modules.forEach((mod) => {
                    const constructor: any = constructorKey[mod["module"]];
                    let widget = new constructor({ view });
                    if ( mod["module"] === "esri/widgets/Legend" || mod["module"] === "esri/widgets/BasemapGallery" ) {
                        const tooltip = widget.label;
                        const group = ( (mod["position"] as string).indexOf('left') < 0 ) ? "right" : "left";
                        // create expand widget to go around legend
                        widget = new Expand({
                            expandIconClass: widget.iconClass || "esri-icon-layer-list",
                            expandTooltip: tooltip,
                            view: view,
                            content: widget,
                            group: group
                        });
                    }
                    if ( mod["module"] === "esri/widgets/BasemapToggle" ) {
                        widget = new BasemapToggle({
                            view,
                            nextBasemap: this.props.widgets.basemapToggleWidgetNext
                        });
                    }
                    if (widget.activeLayerInfos) {
                        widget.watch("activeLayerInfos.length", () => {
                            view.ui.add(widget, mod["position"]);
                        });
                        return;
                    }
                    view.ui.add(widget, mod["position"]);

                });
                return promiseUtils.resolve();
            },      (err) => {
                console.error("Widget Loading Error: \n", err);
            }
        );
    }
}

interface StateProps {
    widgets: {
        [propName: string]: string;
    };
}

export default connect<WebBaseProps, FilterGalleryStore, StateProps, {}>(
    (state) => ({
        widgets: state.settings.config.widgets
    }),
    () => ({})
)(WebBase);
