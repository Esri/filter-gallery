import * as componentI18n from "dojo/i18n!../../nls/resources";

import { Component, H } from "../../Component";
import FilterChip from "../Buttons/FilterChip";

export interface FilterControllerProps {
    /**
     * A unique key for the `FilterController` component.
     * @type {string}
     */
    key: string;

    /**
     * Array of filter chips to show in the controller.
     * @type {array}
     */
    filters: {
        /**
         * Text to show for this filter chip.
         * @type {string}
         */
        text: string;

        /**
         * Unique ID for the filter that this chip represents.
         * @type {string}
         */
        filterId: string;

        /**
         * Handler for when this filter is removed.
         * @type {function}
         */
        onRemove: (e?: any) => any;
    }[];

    /**
     * Handler for when the filter controller is cleared.
     * @type {function}
     */
    onClear: (e?: any) => any;

    /**
     * Optional theme for the `FilterController`: options are "light" or "dark" .
     * @type {string}
     */
    theme?: "light" | "dark";

    /**
     * If true, the `FilterController` will be initialized in the open position.
     * @type {boolean}
     */
    startOpen?: boolean;

    /**
     * Mode to render the `FilterController` in. Options are "expanding" and "full-width" .
     * In the "expanding" mode, the `FilterController` will grow in width
     * as appropriate for the number of filters that have been added.
     * In the "full-width" mode, the `FilterController` will grow to the full width of its container.
     */
    mode?: "expanding" | "full-width";
}

export interface FilterControllerState {
    open: boolean;
}

/**
 * A responsive controller for filter chips.
 */
export default class FilterController extends Component<FilterControllerProps, FilterControllerState> {
    constructor(props: FilterControllerProps) {
        super(props);

        this.toggleFilterDisplay = this.toggleFilterDisplay.bind(this);

        this.state = {
            open: !!this.props.startOpen
        };
    }

    public render(tsx: H) {
        const filters = [...this.props.filters];

        const toggleClasses = {
            "filter-controller__expand-btn": true,
            "filter-controller__expand-btn--active": this.state.open,
            "filter-controller__expand-btn--dark": this.props.theme === "light"
        };

        const containerClasses = {
            "filter-controller__container": true,
            "filter-controller__container--light": this.props.theme === "light",
        };

        const chipContainerClasses = {
            "filter-controller__chip-container": true,
            "filter-controller__chip-container--full-width": this.props.mode === "full-width"
        };

        const chipTheme = this.props.theme === "light" ? "dark" : "light";

        let toggleBtn;
        if (this.props.filters.length > 1) {
            toggleBtn = (
                <button
                    key="filter-controller-toggle-btn"
                    classes={toggleClasses}
                    onclick={this.toggleFilterDisplay}
                    onmousedown={preventDefault}
                >
                    {`+ ${this.props.filters.length - 1}`}
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 32 32"
                    >
                        <path d="M28 9v5L16 26 4 14V9l12 12L28 9z" />
                    </svg>
                </button>
            );
        }

        const firstFilter = filters.shift();
        if (firstFilter) {
            if (this.state.open) {
                return (
                    <div classes={containerClasses}>
                        <div classes={chipContainerClasses}>
                            <FilterChip
                                filterId={firstFilter.filterId}
                                handleRemoveFilter={firstFilter.onRemove}
                                key={firstFilter.filterId}
                                text={firstFilter.text}
                                theme={chipTheme}
                            />
                            {
                                filters.map((filter) => (
                                    <FilterChip
                                        filterId={filter.filterId}
                                        handleRemoveFilter={filter.onRemove}
                                        key={filter.filterId}
                                        text={filter.text}
                                        theme={chipTheme}
                                    />
                                ))
                            }
                            {toggleBtn}
                        </div>
                        <div class="filter-controller__clear-container">
                            <button
                                class="filter-controller__clear-btn"
                                onclick={this.props.onClear}
                            >
                                {componentI18n.dropdowns.clearAll}
                            </button>
                        </div>
                    </div>
                );
            }

            return (
                <div classes={containerClasses}>
                    <div classes={chipContainerClasses}>
                        <FilterChip
                            filterId={firstFilter.filterId}
                            handleRemoveFilter={firstFilter.onRemove}
                            key={firstFilter.filterId}
                            text={firstFilter.text}
                            theme={chipTheme}
                        />
                        {toggleBtn}
                    </div>
                    <div class="filter-controller__clear-container">
                        <button
                            key="filter-controller-clear-btn"
                            class="filter-controller__clear-btn"
                            onclick={this.props.onClear}
                        >
                            {componentI18n.dropdowns.clearAll}
                        </button>
                    </div>
                </div>
            );
        }
        return;
    }

    private toggleFilterDisplay() {
        this.setState({ open: !this.state.open });
    }
}

function preventDefault(e: Event) {
    e.preventDefault();
}