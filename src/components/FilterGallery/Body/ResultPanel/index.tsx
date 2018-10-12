import * as i18n from "dojo/i18n!../../../../nls/resources";
import { Component, H, connect, ComponentProps } from "../../../../Component";

import ItemList from "./ItemList";
import { FilterGalleryStore } from "../../../..";

export interface ResultPanelProps extends ComponentProps {
    /**
     * Current status of the results. Options are: `"loading"`, `"loadingNext"`, `"failed"`, `"success"` and `"empty"`.
     * @type {string}
     */
    resultStatus: "loading" | "loadingNext" | "failed" | "success" | "empty";

    /**
     * Current status of the page. Options are `"loading"`, `"success"` and `"failed"`.
     * @type {string}
     */
    pageStatus: string;
}

/**
 * Panel of results for the expanded `ItemBrowser`.
 */
export class ResultPanel extends Component<ResultPanelProps> {
    public render(tsx: H) {
        if (
            (this.props.resultStatus === "success" || this.props.resultStatus === "loading") &&
            (this.props.pageStatus === "success" || this.props.pageStatus === "loading")
        ) {
                return <ItemList key="ib-ex-item-list" />;
        }
        return (
            <div
                key="request-error"
                class="ib__results"
            >
                <div class="ib-results__message-container">
                    <span class="ib-results__message">
                        {i18n.results.requestError}
                    </span>
                </div>
            </div>
        );
    }
}

interface StateProps {
    resultStatus: "loading" | "loadingNext" | "failed" | "success" | "empty";
    pageStatus: string;
}

export default connect<ResultPanelProps, FilterGalleryStore, StateProps, {}>(
    (state) => ({
        resultStatus: state.ui.resultPanel.status,
        pageStatus: state.ui.pagination.status
    }),
    () => ({})
)(ResultPanel);
