import * as i18n from "dojo/i18n!../../../nls/resources";
import { Component, H, Pojo, connect } from "../../../Component";
import IconButton from "../../Buttons/IconButton";
import { FilterGalleryStore } from "../../..";
import { closeViewer } from "../../../_actions";
import { FilterGalleryState } from "../../../_reducer";
import MapView from "./MapView";
import SceneView from "./SceneView";

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
            view = <MapView key="map-view" item={this.props.item} />;
        } else if (this.props.type === "scene") {
            view = <SceneView key="scene-view" item={this.props.item} />;
        }

        return (
            <div class="fg-viewer__container">
                <header class="fg-viewer__header">
                    <IconButton
                        key="fg-filter-btn"
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
        exit: () => dispatch(closeViewer())
    })
)(Viewer);
