import * as componentI18n from "dojo/i18n!../../nls/resources";

import { Component, H } from "../../Component";

import AccordionDropdown from "../Dropdowns/AccordionDropdown";
import Toggle, { ToggleOption } from "../Buttons/Toggle";

/**
 * Accepted values for the "shared" filter.
 */
export type SharedValue = "public" | "org" | "shared" | "private";

/**
 * An option in the `SharedFilter` component.
 */
export interface SharedOption { value: SharedValue; text: string; }

export interface SharedFilterProps {
    /**
     * A mapping of shared options to their counts.
     * @type {object}
     */
    counts: {
        public: number | undefined;
        org: number | undefined;
        shared: number | undefined;
        private: number | undefined;
    };

    /**
     * Unique key for the `SharedFilter` component.
     * @type {string}
     */
    key: string;

    /**
     * Handler for when a shared state is selected from the filter.
     * @type {function}
     */
    onSharedSelect: (option?: SharedOption) => void;

    /**
     * The currently selected option in the `SharedFilter`.
     * @type {object}
     */
    sharedFilter: SharedOption | undefined;

    /**
     * If enabled, hides the "org" and "shared" options.
     * @type {boolean} 
     */
    hideOrgGroupFilters?: boolean;
}

export interface SharedFilterState {
    options: ToggleOption[];
}

/**
 * A filter accordion for sharing status.
 */
export default class SharedFilters extends Component<SharedFilterProps, SharedFilterState> {
    constructor(props: SharedFilterProps) {
        super(props);

        this.state = {
            options: [
                { value: "public", displayName: componentI18n.filters.shared.options.public },
                { value: "org", displayName: componentI18n.filters.shared.options.org },
                { value: "shared", displayName: componentI18n.filters.shared.options.shared },
                { value: "private", displayName: componentI18n.filters.shared.options.private }
            ]
        };

        this.mapOptionsToToggles = this.mapOptionsToToggles.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleClearFilter = this.handleClearFilter.bind(this);
    }

    public render(tsx: H) {
        return (
            <AccordionDropdown
                key="shared-accordion"
                title={componentI18n.filters.shared.shared}
                clearable={!!this.props.sharedFilter}
                onClear={this.handleClearFilter}
            >
                <ul
                    id="shared-accordion-tree"
                    class="ftr-shared__tree"
                    role="tree"
                    aria-label={componentI18n.filters.shared.shared}
                >
                    {this.mapOptionsToToggles(tsx)}
                </ul>
            </AccordionDropdown>
        );
    }

    private mapOptionsToToggles(tsx: H) {
        let options = this.state.options;
        if (!!this.props.hideOrgGroupFilters) {
            options = [ this.state.options[0], this.state.options[3] ];
        }   

        return options.map((option) => {
            return (
                <Toggle
                    count={this.props.counts[option.value]}
                    key={option.value}
                    name={option.displayName}
                    value={option.value}
                    selectedToggle={this.props.sharedFilter ? this.props.sharedFilter.value : undefined}
                    childOptions={option.childOptions}
                    onToggleClick={this.handleToggleClick}
                />
            );
        });
    }

    private handleToggleClick(value: string, text: string) {
        const shared = this.props.sharedFilter;
        if (shared && shared.value === value) {
            this.props.onSharedSelect();
        } else {
            this.props.onSharedSelect({ value: value as SharedValue, text });
        }
    }

    private handleClearFilter() {
        this.props.onSharedSelect();
    }
}
