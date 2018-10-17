import { Component, H, Pojo } from "../../../Component";
import WebBase from "./WebBase";

export interface SceneViewProps {
    key: string;
    item: Pojo;
}

export default class SceneView extends Component<SceneViewProps> {
    public render(tsx: H) {
        return (
            <WebBase
                key={`map-view-${this.props.item.id}`}
                widgets={{}}
                viewModule="esri/views/SceneView"
                webModule="esri/WebScene"
                containerId="fg-map-view"
                itemId={this.props.item.id}
            />
        );
    }
}