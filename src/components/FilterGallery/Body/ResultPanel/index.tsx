import * as i18n from "dojo/i18n!../../../../nls/resources";
import { Component, H, connect, ComponentProps } from "../../../../Component";

import ItemList from "./ItemList";

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
    sublayers: any | undefined;
    sublayerSection: boolean;
}

/**
 * Panel of results for the expanded `ItemBrowser`.
 */
export default class ResultPanel extends Component<ResultPanelProps> {
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
