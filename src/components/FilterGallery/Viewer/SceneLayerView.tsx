import { Component, H, Pojo } from "../../../Component";
import LayerBase from "./LayerBase";
import layerMapping from "./_utils/layerMapping";

export interface SceneLayerViewProps {
    key: string;
    item: Pojo;
    closing: boolean;
}

export default class SceneLayerView extends Component<SceneLayerViewProps> {
    public render(tsx: H) {
        return (
            <LayerBase
                key={`scene-layer-${this.props.item.id}`}
                layerModule={layerMapping[this.props.item.type]}
                mapModule="esri/Map"
                viewModule="esri/views/SceneView"
                containerId="fg-map-view"
                layerUrl={this.props.item.url}
                closing={this.props.closing}
            />
        );
    }
}