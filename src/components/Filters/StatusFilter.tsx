import * as componentI18n from "dojo/i18n!../../nls/resources";

import { Component, H } from "../../Component";

import AccordionDropdown from "../Dropdowns/AccordionDropdown";
import Toggle, { ToggleOption } from "../Buttons/Toggle";

/**
 * Accepted values for the status filter.
 * @type {string}
 */
export type StatusValue = "authoritative" | "deprecated";

/**
 * Option for the `StatusFilter` component.
 * @type {object}
 */
export interface StatusOption { value: StatusValue; text: string; }

export interface StatusFilterProps {
    /**
     * Mapping of counts to status options.
     * @type {object}
     */
    counts: {
        authoritative: number | undefined;
        deprecated: number | undefined;
    };

    /**
     * Unique key for the `StatusFilter` component.
     * @type {string}
     */
    key: string;

    /**
     * Handler for when a status is selected from the filter.
     * @type {function}
     */
    onStatusSelect: (option?: StatusOption) => void;

    /**
     * The currently selected status filter.
     * @type {object}
     */
    statusFilter: StatusOption | undefined;
}

export interface StatusFilterState {
    options: ToggleOption[];
}

/**
 * A filter accordion for content status.
 */
export default class StatusFilter extends Component<StatusFilterProps, StatusFilterState> {
    constructor(props: StatusFilterProps) {
        super(props);

        this.state = {
            options: [
                { value: "authoritative", displayName: componentI18n.options.authoritative },
                { value: "deprecated", displayName: componentI18n.options.deprecated }
            ]
        };

        this.mapOptionsToToggles = this.mapOptionsToToggles.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleClearFilter = this.handleClearFilter.bind(this);
    }

    public render(tsx: H) {
        return (
            <AccordionDropdown
                key="status-accordion"
                title={componentI18n.status}
                clearable={!!this.props.statusFilter}
                onClear={this.handleClearFilter}
            >
                <ul
                    aria-label={componentI18n.status}
                    class="ftr-status__tree"
                    id={`status-accordion-tree`}
                    role="tree"
                >
                    {this.mapOptionsToToggles(tsx)}
                </ul>
            </AccordionDropdown>
        );
    }

    private mapOptionsToToggles(tsx: H) {
        return this.state.options.map((option) => {
            return (
                <Toggle
                    count={this.props.counts[option.value]}
                    key={option.value}
                    name={option.displayName}
                    value={option.value}
                    selectedToggle={this.props.statusFilter ? this.props.statusFilter.value : undefined}
                    childOptions={option.childOptions}
                    onToggleClick={this.handleToggleClick}
                />
            );
        });
    }

    private handleToggleClick(value: string, text: string) {
        const shared = this.props.statusFilter;
        if (shared && shared.value === value) {
            this.props.onStatusSelect();
        } else {
            this.props.onStatusSelect({ value: value as StatusValue, text });
        }
    }

    private handleClearFilter() {
        this.props.onStatusSelect();
    }
}
