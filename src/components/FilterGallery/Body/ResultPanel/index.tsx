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
            return <ItemList key="fg-item-list" />;
        }
        return (
            <div
                key="request-error"
                class="fg-results__item-list"
            >
                <div class="fg-results__no-items-container">
                    <svg viewBox="0 0 256 256" width="256">
                        <path
                            fill="#ccc"
                            d="M149.375 182.444l56.463-56.471-25.376-25.376 5.523-14.541-59.827-22.726L110.828 48H56v124h18.365l12.437 4.724 34.182 34.101 15.33-15.294 7.07 2.686 5.164-13.597zm50.806-56.472l-47.34 47.35 26.064-68.626zM112 54.828L141.172 84H112zM60 52h48v36h36v80H60zm60.984 153.17L95.95 180.199l36.263 13.775zm20.081-12.113L85.632 172H148V85.172L133.059 70.23l47.766 18.144-34.628 91.171z"
                        >
                        </path>
                    </svg>
                    <p class="fg-results__no-items-text">
                        {i18n.gallery.results.requestError}
                    </p>
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
