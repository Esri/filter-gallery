import * as i18n from "dojo/i18n!../../../nls/resources";
import { Component, H, connect } from "../../../../Component";
import ActiveFilters from "./ActiveFilters";

export interface InputAreaProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * Name of the item type being searching for, if applicable.
     * @type {string}
     */
    itemName: string | undefined;

    /**
     * Total number of items returned from the query.
     * @type {number}
     */
    itemTotal: number;

    /**
     * Array of informational static filters to display in the UI.
     * @type {array}
     */
    staticFilters: string[] | undefined;
}

/**
 * The input area for the expanded `ItemBrowser`.
 */
export default class InputArea extends Component<InputAreaProps> {
    public render(tsx: H) {
        const resultCount = `${
            this.props.itemTotal.toLocaleString()} ${this.props.itemName ? this.props.itemName : i18n.resultCount
        }`;

        return (
            <div class="ib-ex-input__container" key="ib-result-count-container">
                <span class="ib-ex-input-area__result-count">{resultCount}</span>
                <ActiveFilters
                    staticFilters={this.props.staticFilters}
                    key="ib-ex__active-filters"
                    theme="dark"
                />
            </div>
        );
    }
}
