import * as i18n from "dojo/i18n!../../../nls/resources";
import { Component, H, connect } from "../../../Component";

import * as promiseUtils from "esri/core/promiseUtils";
import * as requireUtils from "esri/core/requireUtils";
import LoaderBars from "../../Loaders/LoaderBars";
import { FilterGalleryStore } from "../../..";
import widgetMapping from "./_utils/widgetMapping"; //Widget 1 of 2
import * as Expand from "esri/widgets/Expand";

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
    private view: __esri.View;
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
        requireUtils.when(window["require"], [this.props.mapModule, this.props.viewModule, this.props.layerModule])
            .then(
                ([MapConstructor, ViewConstructor, LayerConstructor]) => {
                    this.setState({ loadText: "map" });
                    this.loadMap(MapConstructor, ViewConstructor, LayerConstructor);
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
        this.layer = new LayerConstructor({ url: this.props.layerUrl } as __esri.LayerProperties);
        this.map = new MapConstructor({
            basemap: this.props.defaultBasemap, 
            layers: [this.layer]
        });
        this.setState({ loadText: "layers" });
        this.layer.load().then(
            () => {
                this.setState({ loadText: "widgets" });
                this.view = new ViewConstructor({
                    container: this.props.containerId,
                    map: this.map, 
                    extent: this.layer.fullExtent
                });
                this.view.popup.defaultPopupTemplateEnabled = true;
                this.view.when(() => {
                    this.loadWidgets(this.view as any).then(
                        () => {
                            this.view.container = this.props.containerId as any;
                            this.setState({ status: "loaded" });
                        },
                        (err) => {
                            this.setState({ status: "failed" });
                        }
                    );
                });
            },
            (err) => {
                this.setState({ status: "failed" });
            }
        );
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
        }, []);
        return requireUtils.when(window["require"], modules.map((item) => item["module"]))
            .then((constructors) => {
                constructors.forEach((Constructor: any, i: number) => {
                    const widget = new Constructor({ view });
                    //only collapse if BasemapGallery or Legend
                    if( (modules[i]["module"]==="esri/widgets/Legend") || (modules[i]["module"]==="esri/widgets/BasemapGallery") ) {
                        let tooltip = widget.label;
                        let group = ( (modules[i]["position"] as string).indexOf('left') < 0 ) ? "right" : "left";
                        const widgetExpand = new Expand({
                            expandTooltip: tooltip,
                            view: view,
                            content: widget,
                            group: group
                        });
                        if (widget.activeLayerInfos) {
                            widget.watch("activeLayerInfos.length", () => {
                                view.ui.add(widgetExpand, modules[i]["position"]);
                            });
                            return;
                        }
                        view.ui.add(widgetExpand, modules[i]["position"]);
                        return;
                    }
                    if (widget.activeLayerInfos) {
                        widget.watch("activeLayerInfos.length", () => {
                            view.ui.add(widget, modules[i]["position"]);
                        });
                        return;
                    }
                    view.ui.add(widget, modules[i]["position"]);
                });
                return promiseUtils.resolve();
            });
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
