import i18n = require("dojo/i18n!../../nls/resources");

import { Component, H, connect } from "../../Component";
import Header from "./Header";
import Body from "./Body";
import { FilterGalleryStore } from "../..";
import Overlay from "../Modals/Overlay";
import Viewer from "./Viewer";
import LoaderBars from "../Loaders/LoaderBars";
import { OriginError } from "../../_actions";

export interface RootComponentProps {
    key: string;
    portalStatus: string;
    viewerOpen: boolean;
    viewerClosing: boolean;
    title: string;
    headHTML?: string;
    err?: OriginError;
}

export class RootComponent extends Component<RootComponentProps> {
    public componentWillReceiveProps(nextProps: RootComponentProps) {
        if (!this.props.viewerOpen && nextProps.viewerOpen && this.childComponents.viewer) {
            this.childComponents.viewer.childComponents = {};
        }
    }

    public render(tsx: H) {
        if (this.props.portalStatus === "loading") {
            return (
                <main class="fg__container">
                    <LoaderBars key="loading-app" text={i18n.appInit} />
                </main>
            );
        } else if (this.props.portalStatus === "failed") {
            return (
                <main class="fg__container">
                    <h3 class="fg__no-js-text">{i18n.appFailed}</h3>
                </main>
            );
        } else if (this.props.portalStatus === "noauth") {
            return (
                <main class="fg__container">
                    <div key="no-auth-container" class="fg__no-js-text">
                        <h3>{i18n.notLicensed}</h3>
                        <p>{i18n.noAuth}</p>
                    </div>
                </main>
            );
        } else if (this.props.portalStatus === "originother") {
            // Redirect to unsupported page
            document.location.href = `./shared/origin/index.html?appUrl=${this.props.err?.appUrl}`; 
            // return (
            //     <main class="fg__container">
            //         <div key="no-auth-container" class="fg__no-js-text">
            //             <h3>{i18n.error}</h3>
            //             <p>{i18n.originError.message}</p>
            //             <details>
            //             <summary>{i18n.originError.options}</summary>
            //             {i18n.originError.linkMessage}
            //             <a href={this.props.err?.appUrl}>{this.props.err?.appUrl}</a>
            //             </details>
            //         </div>
            //     </main>
            // );
        } 

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
                <Header
                    key="header"
                    title={this.props.title}
                    injectedHTML={this.props.headHTML ? this.props.headHTML : undefined}
                />
                <Body key="body" />
            </main>
        );
    }
}

interface StateProps {
    portalStatus: string;
    viewerOpen: boolean;
    viewerClosing: boolean;
    title: string;
    headHTML?: string;
}

export default connect<RootComponentProps, FilterGalleryStore, StateProps, {}>(
    (state) => ({
        portalStatus: state.settings.utils.portalStatus,
        viewerOpen: state.ui.viewer.open,
        viewerClosing: state.ui.viewer.closing,
        headHTML: state.settings.config.headHTML,
        title: state.settings.config.dialogTitle
    }),
    () => ({})
)(RootComponent);
