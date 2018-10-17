import { Component, H, Pojo } from "../../../Component";
import WebBase from "./WebBase";

export interface MapViewProps {
    key: string;
    item: Pojo;
    closing: boolean;
}

export class MapView extends Component<MapViewProps> {

    public render(tsx: H) {
        return (
            <WebBase
                key={`map-view-${this.props.item.id}`}
                widgets={{}}
                viewModule="esri/views/MapView"
                webModule="esri/WebMap"
                containerId="fg-map-view"
                itemId={this.props.item.id}
            />
        );
    }
}