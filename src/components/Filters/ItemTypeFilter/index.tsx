import * as componentI18n from "dojo/i18n!../../../nls/resources";

import { Component, H } from "../../../Component";

import AccordionDropdown from "../../Dropdowns/AccordionDropdown";
import Toggle, { ToggleOption } from "../../Buttons/Toggle";
import itemTypeOptions from "./_utils/itemTypeOptions";
import { treeCompress, treePrune, ItemTypeFilter as ItemTypeFilters } from "../../../_utils";

/**
 * An option in the item type filter.
 * @type {object}
 */
export interface ItemTypeOption { value: ItemTypeFilters; text: string; }

export interface ItemTypeFilterProps {
    /**
     * A unique key for the `ItemTypeFilter` component.
     * @type {string}
     */
    key: string;

    /**
     * Handler for when an item type is selected from the filter.
     * @type {function}
     */
    onItemTypeSelect: (itemType?: ItemTypeOption) => void;

    /**
     * Array of item type filter options available from the filter.
     * @type {array}
     */
    availableItemTypes: ItemTypeFilters[];

    /**
     * Currently selected item type filter option.
     * @type {object}
     */
    itemTypeFilter: ItemTypeOption | undefined; 

    /**
     * If this option is enabled the filter will start in the active state
     * @type {boolean}
     */
    startActive?: boolean;
}

export interface ItemTypeFilterState {
    availableFilters: ToggleOption[];
}

/**
 * A filter accordion for selecting item types.
 */
export default class ItemTypeFilter extends Component<ItemTypeFilterProps, ItemTypeFilterState> {
    constructor(props: ItemTypeFilterProps) {
        super(props);

        this.state = {
            availableFilters: treeCompress(treePrune(
                {  value: "##itemTypeOptionsRoot", children: itemTypeOptions },
                props.availableItemTypes
            )).children as ToggleOption[]
        };

        this.mapItemTypesToToggles = this.mapItemTypesToToggles.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleClearFilter = this.handleClearFilter.bind(this);
    }

    public render(tsx: H) {
        return (
            <AccordionDropdown
                key="item-type-accordion"
                title={componentI18n.filters.itemType.itemType}
                clearable={!!this.props.itemTypeFilter}
                onClear={this.handleClearFilter}
                startActive={this.props.startActive}
            >
                <ul
                    aria-label={componentI18n.filters.itemType.itemType}
                    id="item-type-accordion-tree"
                    class="ftr-item-type__tree"
                    role="tree"
                >
                    {this.mapItemTypesToToggles(tsx)}
                </ul>
            </AccordionDropdown>
        );
    }

    private mapItemTypesToToggles(tsx: H) {
        return this.state.availableFilters.map((option) => {
            return (
                <Toggle
                    key={option.value}
                    name={option.displayName}
                    value={option.value}
                    selectedToggle={this.props.itemTypeFilter ? this.props.itemTypeFilter.value : undefined}
                    childOptions={option.children}
                    onToggleClick={this.handleToggleClick}
                />
            );
        });
    }

    private handleToggleClick(value: string, text: string) {
        const filter = this.props.itemTypeFilter;
        if (filter && filter.value === value) {
            this.props.onItemTypeSelect();
        } else {
            this.props.onItemTypeSelect({ value: value as ItemTypeFilters, text });
        }
    }

    private handleClearFilter() {
        this.props.onItemTypeSelect();
    }
}
