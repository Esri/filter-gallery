import { Component, H, connect } from "../../Component";
import Header from "./Header";
import Body from "./Body";
import { FilterGalleryStore } from "../..";
import Overlay from "../Modals/Overlay";
import Viewer from "./Viewer";

export interface RootComponentProps {
    key: string;
    viewerOpen: boolean;
    viewerClosing: boolean;
}

export class RootComponent extends Component<RootComponentProps> {
    public componentWillReceiveProps(nextProps: RootComponentProps) {
        if (!this.props.viewerOpen && nextProps.viewerOpen && this.childComponents.viewer) {
            this.childComponents.viewer.childComponents = {};
        }
    }

    public render(tsx: H) {
        return (
            <main class="fg__container">
                {
                    this.props.viewerOpen ? (
                        <Overlay
                            key="viewer-overlay"
                            closing={this.props.viewerClosing}
                            scrollable={false}
                        >
                            <Viewer key="viewer" />
                        </Overlay>
                    ) : null
                }
                <Header key="header" dialogTitle="Filter Gallery" />
                <Body key="body" />
            </main>
        );
    }
}

interface StateProps {
    viewerOpen: boolean;
    viewerClosing: boolean;
}

export default connect<RootComponentProps, FilterGalleryStore, StateProps, {}>(
    (state) => ({
        viewerOpen: state.ui.viewer.open,
        viewerClosing: state.ui.viewer.closing
    }),
    () => ({})
)(RootComponent);
