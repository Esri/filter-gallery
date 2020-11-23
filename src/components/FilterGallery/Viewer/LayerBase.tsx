import i18n = require("dojo/i18n!../../../nls/resources");
import { Component, H, connect } from "../../../Component";

import promiseUtils = require("esri/core/promiseUtils");
import LoaderBars from "../../Loaders/LoaderBars";
import { FilterGalleryStore } from "../../..";
import widgetMapping from "./_utils/widgetMapping"; //Widget 1 of 2

interface LayerBaseProps {
    key: string;
    mapModule: string;
    viewModule: string;
    layerModule: string;
    widgets: { [propName: string]: string };
    defaultBasemap: string;
    layerUrl: string;
    containerId: string;
    closing: boolean;
}

interface LayerBaseState {
    status: string;
    loadText: string;
}

export class LayerBase extends Component<LayerBaseProps, LayerBaseState> {
    private map: __esri.Map;
    private view: __esri.MapView | __esri.SceneView;
    private layer: __esri.Layer;

    constructor(props: LayerBaseProps) {
        super(props);

        this.state = {
            status: "loading",
            loadText: "scripts"
        };

        this.loadScripts = this.loadScripts.bind(this);
        this.loadMap = this.loadMap.bind(this);
        this.loadWidgets = this.loadWidgets.bind(this);
    }

    public componentWillReceiveProps(nextProps: LayerBaseProps) {
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
        let constructorKey: object;
        promiseUtils.create(
            (resolve, reject) => { 
                require(
                    ["esri/Map", // Map
                    "esri/views/MapView", "esri/views/SceneView", // Views
                    // tslint:disable-next-line: max-line-length
                    "esri/layers/FeatureLayer", "esri/layers/VectorTileLayer", "esri/layers/MapImageLayer", "esri/layers/ImageryLayer", "esri/layers/SceneLayer"],  // Layers
                    (Map, 
                     MapView, SceneView, 
                     FeatureLayer, VectorTileLayer, MapImageLayer, ImageryLayer, SceneLayer) => {
                            constructorKey = {
                                "esri/layers/FeatureLayer": FeatureLayer, 
                                "esri/layers/VectorTileLayer": VectorTileLayer, 
                                "esri/layers/MapImageLayer": MapImageLayer, 
                                "esri/layers/ImageryLayer": ImageryLayer, 
                                "esri/layers/SceneLayer": SceneLayer
                            };
                            return resolve([Map, MapView, SceneView]);
                        }
                ); 
            }
        ).then(
            ([Map, MapView, SceneView, FeatureLayer, VectorTileLayer, MapImageLayer, ImageryLayer, SceneLayer]) => {
                const viewModule = this.props.viewModule === "esri/views/MapView" ? MapView :
                                this.props.viewModule === "esri/views/SceneView" ? SceneView :
                                MapView; // default to MapView
                const layerModule: any = constructorKey ? 
                                            constructorKey[this.props.layerModule] : 
                                            FeatureLayer; // default to FeatureLayer
                this.setState({ loadText: "map" });
                this.loadMap(Map, viewModule, layerModule);  
            },
            (err) => {
                this.setState({ status: "failed" });
            }
        );
    }

    private loadMap(
        MapConstructor: __esri.MapConstructor,
        ViewConstructor: __esri.MapViewConstructor,
        LayerConstructor: __esri.LayerConstructor
    ) {
        this.map = new MapConstructor({
            basemap: this.props.defaultBasemap
        });
        this.setState({ loadText: "layers" });
        this.layer = new LayerConstructor({ url: this.props.layerUrl } as __esri.LayerProperties);
        this.layer.load().then((layers: any) => {
            this.setState({ loadText: "widgets" });
            this.view = new ViewConstructor({
                container: this.props.containerId,
                map: this.map
            });
            this.view.popup.defaultPopupTemplateEnabled = true;
            this.map.add(this.layer);
            this.view.extent = this.layer.fullExtent;
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
                require(["esri/widgets/Compass", "esri/widgets/Home", "esri/widgets/Legend", "esri/widgets/Locate", "esri/widgets/Search", "esri/widgets/BasemapGallery", "esri/widgets/Expand"], 
                        (Compass, Home, Legend, Locate, Search, BasemapGallery, Expand) => {
                            constructorKey = {
                                "esri/widgets/Compass": Compass, 
                                "esri/widgets/Home": Home, 
                                "esri/widgets/Legend": Legend, 
                                "esri/widgets/Locate": Locate, 
                                "esri/widgets/Search": Search, 
                                "esri/widgets/BasemapGallery": BasemapGallery, 
                                "esri/widgets/Expand": Expand
                            };
                            return resolve([Compass, Home, Legend, Locate, Search, BasemapGallery, Expand]);
                        }
                ); 
            }).then(([Compass, Home, Legend, Locate, Search, BasemapGallery, Expand]) => {
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
    defaultBasemap: string;
}

export default connect<LayerBaseProps, FilterGalleryStore, StateProps, {}>(
    (state) => ({
        widgets: state.settings.config.widgets,
        defaultBasemap: state.settings.config.defaultBasemap
    }),
    () => ({})
)(LayerBase);
