import i18n = require("dojo/i18n!../../../nls/resources");
import ioQuery = require("dojo/io-query");

import { Component, H, Pojo, connect } from "../../../Component";
import IconButton from "../../Buttons/IconButton";
import { FilterGalleryStore } from "../../..";
import { closeViewer, push } from "../../../_actions";
import { FilterGalleryState } from "../../../_reducer";
import MapView from "./MapView";
import SceneView from "./SceneView";
import MapLayerView from "./MapLayerView";
import SceneLayerView from "./SceneLayerView";

interface ViewerProps {
    key: string;
    item: Pojo;
    type: FilterGalleryState["ui"]["viewer"]["type"];
    closing: boolean;
    exit: () => void;
}

export class Viewer extends Component<ViewerProps> {
    public render(tsx: H) {
        let view;
        if (this.props.type === "map") {
            view = <MapView key={this.props.item.id} item={this.props.item} closing={this.props.closing} />;
        } else if (this.props.type === "scene") {
            view = <SceneView key={this.props.item.id} item={this.props.item} closing={this.props.closing} />;
        } else if (this.props.type === "mapLayer") {
            view = <MapLayerView key={this.props.item.id} item={this.props.item} closing={this.props.closing} />;
        } else if (this.props.type === "sceneLayer") {
            view = <SceneLayerView key={this.props.item.id} item={this.props.item} closing={this.props.closing} />;
        }

        return (
            <div class="fg-viewer__container">
                <header class="fg-viewer__header">
                    <div class="fg-viewer__head-box">
                        <IconButton
                            key="fg-back-btn"
                            active={false}
                            handleClick={this.props.exit}
                        >
                            <div class="drp-sort__btn-body">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="16"
                                    width="16"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9.11 6.32L4.43 11H20v1H4.43l4.68 4.68-.707.707L2.517 11.5l5.886-5.887z" />
                                </svg>
                                <span class="drp-sort__btn-label">{i18n.viewer.back}</span>
                            </div>
                        </IconButton>
                    </div>
                    <div class="fg-viewer__head-box">
                        <h5 class="fg-viewer__title">{this.props.item.title}</h5>
                    </div>
                    <div class="fg-viewer__head-box">
                        <div key="spacer" />
                    </div>
                </header>
                <div id="fg-map-view" class="fg-viewer__view">
                    {view}
                </div>
            </div>
        );
    }
}

interface StateProps {
    closing: boolean;
    item: Pojo;
    type: FilterGalleryState["ui"]["viewer"]["type"];
}

interface DispatchProps {
    exit: () => void;
}

export default connect<ViewerProps, FilterGalleryStore, StateProps, DispatchProps>(
    (state) => ({
        item: state.ui.viewer.item,
        type: state.ui.viewer.type,
        closing: state.ui.viewer.closing
    }),
    (dispatch) => ({
        exit: () => dispatch(push(""))
    })
)(Viewer);
