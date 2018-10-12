import { Component, H } from "../../Component";

import AccordionDropdown from "../Dropdowns/AccordionDropdown";
import Toggle, { ToggleOption } from "../Buttons/Toggle";

/**
 * A selected options for the categories filter.
 */
export interface CategoriesOption { value: string; text: string; }

export interface CategoriesFilterProps {
    /**
     * Unique key for this component.
     * @type {string}
     */
    key: string;
    /**
     * Handler for when a category is selected from the filter.
     * @type {function}
     */
    onCategorySelect: (category: CategoriesOption) => void;
    /**
     * Handler for when the filter is cleared.
     * @type {function}
     */
    onClearCategories: () => void;
    /**
     * Array of available category options.
     * @type {array}
     */
    availableCategories: ToggleOption[];
    /**
     * The currently selected category filter.
     * @type {object}
     */
    categoriesFilter?: CategoriesOption;
    /**
     * The title for the filter accordion.
     * @type {string}
     */
    title: string;
    /**
     * Prepends a string to any value returned from the filter
     * Used to skip the root node for special living atlas category schema
     * @type {string}
     */
    prependValue?: string;
    /**
     * If this option is enabled and tooltips are present on the options, they will be displayed as tooltips
     * @type {boolean}
     */
    showTooltips?: boolean;
    /**
     * If this option is enabled the filter will start in the active state
     * @type {boolean}
     */
    startActive?: boolean;
}

/**
 * A filter accordion for selection categories.
 */
export default class CategoriesFilter extends Component<CategoriesFilterProps> {

    constructor(props: CategoriesFilterProps) {
        super(props);

        this.mapCategoriesToToggles = this.mapCategoriesToToggles.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleClearFilter = this.handleClearFilter.bind(this);
    }

    public render(tsx: H) {
        return (
            <AccordionDropdown
                key={this.props.key}
                title={this.props.title}
                clearable={!!this.props.categoriesFilter}
                onClear={this.handleClearFilter}
                startActive={this.props.startActive}
            >
                <ul
                    aria-label={this.props.title}
                    id={`${this.props.key}-tree`}
                    class="ftr-categories__tree"
                    role="tree"
                >
                    {this.mapCategoriesToToggles(tsx)}
                </ul>
            </AccordionDropdown>
        );
    }

    private mapCategoriesToToggles(tsx: H) {
        return this.props.availableCategories.map((category: ToggleOption) => {
            return (
                <Toggle
                    count={category.count}
                    key={category.value}
                    name={category.displayName}
                    value={category.value}
                    selectedToggle={this.props.categoriesFilter ? this.props.categoriesFilter.value : undefined}
                    childOptions={category.children}
                    onToggleClick={this.handleToggleClick}
                    useFullPathAsValue={true}
                    prependValue={this.props.prependValue}
                    showTooltip={this.props.showTooltips}
                    tooltip={category.tooltip}
                />
            );
        });
    }

    private handleToggleClick(value: string, name: string) {
        this.props.onCategorySelect({ value, text: name });
    }

    private handleClearFilter() {
        this.props.onClearCategories();
    }
}