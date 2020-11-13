import * as i18n from "dojo/i18n!../../../nls/resources";
import { Component, H, connect } from "../../../../Component";
import ActiveFilters from "./ActiveFilters";
import { FilterGalleryStore } from "../../../..";

export interface InputAreaProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * Total number of items returned from the query.
     * @type {number}
     */
    itemTotal: number;
}

/**
 * The input area for the expanded `ItemBrowser`.
 */
export class InputArea extends Component<InputAreaProps> {
    public render(tsx: H) {
        const resultCount = `${i18n.gallery.resultCount} ${this.props.itemTotal.toLocaleString()}`;

        return (
            <div class="fg-input__container" key="ib-result-count-container">
                <span class="fg-input-area__result-count">{resultCount}</span>
                <ActiveFilters
                    key="fg__active-filters"
                    theme="dark"
                />
            </div>
        );
    }
}

interface StateProps {
    itemTotal: number;
}

export default connect<InputAreaProps, FilterGalleryStore, StateProps, {}>(
    (state) => ({
        itemTotal: state.parameters.nextQuery.total
    }),
    () => ({})
)(InputArea);
