import { Component, H, Pojo } from "../../../Component";
import LayerBase from "./LayerBase";
import layerMapping from "./_utils/layerMapping";

export interface MapLayerViewProps {
    key: string;
    item: Pojo;
    closing: boolean;
}

export default class MapLayerView extends Component<MapLayerViewProps> {
    public render(tsx: H) {
        return (
            <LayerBase
                key={`map-layer-view-${this.props.item.id}`}
                layerModule={layerMapping[this.props.item.type]}
                mapModule="esri/Map"
                viewModule="esri/views/MapView"
                containerId="fg-map-view"
                layerUrl={this.props.item.url}
                closing={this.props.closing}
            />
        );
    }
}