import * as i18n from "dojo/i18n!../../nls/resources";
import { Component, H } from "../../../Component";

import IconButton from "../../Buttons/IconButton";

import SortDropdown, { SortField, SortOrder } from "../../Dropdowns/SortDropdown";

export interface SearchAreaProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * Optional placeholder text for the search input.
     * @type {string}
     */
    searchPlaceholderText: string | undefined;

    /**
     * The name of the currently active section.
     * @type {string}
     */
    section: string;

    /**
     * The current search string.
     * @type {string}
     */
    searchString: string;

    /**
     * The previous search string.
     * @type {string}
     */
    previousSearchString: string;

    /**
     * The visibility of the sort dropdown.
     * @type {boolean}
     */
    sortActive: boolean;

    /**
     * The current sort field.
     * @type {string}
     */
    sortField: SortField;

    /**
     * The current sort order.
     * @type {string}
     */
    sortOrder: SortOrder;

    /**
     * The visibility of the filter panel.
     * @type {boolean}
     */
    expandedFiltersActive: boolean;

    /**
     * Handler for when the filter panel visibility is toggled.
     * @type {function}
     */
    toggleExpandedFilters: () => void;

    /**
     * Handler for when the sort dropdown visibility is toggled.
     * @type {function}
     */
    toggleExpandedSort: () => void;

    /**
     * Handler for when the sort field is changed.
     * @type {function}
     */
    changeSortField: (field: SortField) => void;

    /**
     * Handler for when the sort order is changed.
     * @type {function}
     */
    changeSortOrder: (order: SortOrder) => void;

    /**
     * Handler for when the search string is changed.
     * @type {function}
     */
    changeSearchString: (newString: string) => void;

    /**
     * Handler for when a search is initiated.
     * @type {function}
     */
    search: (updateCounts?: boolean) => void;
}

const defaultOptions = ["relevance", "title", "owner", "created", "modified", "numviews"];
const availableOptionsMap = {
    myContent: [ "modified", "title" ],
    myFavorites: [ "relevance", "modified", "title", "numviews", "owner" ],
    myGroups: [ "relevance", "modified", "title", "numviews", "owner" ],
    myOrganization: [ "relevance", "modified", "title", "numviews", "owner" ],
    livingAtlas: [ "relevance", "modified", "title", "numviews", "owner" ],
    all: [ "relevance", "title", "owner", "modified", "numviews" ]
};

/**
 * Search area for the expanded `ItemBrowser`.
 */
export default class SearchArea extends Component<SearchAreaProps> {
    constructor(props: SearchAreaProps) {
        super(props);

        this.handleToggleFilters = this.handleToggleFilters.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchKeyDown = this.handleSearchKeyDown.bind(this);
        this.handleSortFieldChange = this.handleSortFieldChange.bind(this);
        this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
        this.handleSortClick = this.handleSortClick.bind(this);
    }

    public render(tsx: H) {
        const placeholder = this.props.searchPlaceholderText ?
            this.props.searchPlaceholderText :
            i18n.searchPlaceholders.generic;

        const section = this.props.section;
        let availableOptions =
            availableOptionsMap[section] ?
            [ ...availableOptionsMap[section] ] :
            [ ...defaultOptions ];
        return (
            <div class="ib-ex-search-area__container">
                <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                        d="M19.205 18.295l-7.036-7.035A6.874 6.874 0 0 0 6.875 0 6.874 6.874 0 0 0 0 6.875a6.874 6.874 0 0 0 11.286 5.27l7.035 7.034.884-.884zM1.25 6.875A5.632 5.632 0 0 1 6.875 1.25 5.632 5.632 0 0 1 12.5 6.875 5.632 5.632 0 0 1 6.875 12.5 5.632 5.632 0 0 1 1.25 6.875z"
                        fill="#595959"
                        fill-rule="nonzero"
                    />
                </svg>
                <input
                    id="ib-ex-search-area__input"
                    class="ib-ex-search-area__input"
                    type="search"
                    oninput={this.handleSearchChange}
                    onkeydown={this.handleSearchKeyDown}
                    value={this.props.searchString}
                    placeholder={placeholder}
                    title={i18n.header.search}
                    aria-label={i18n.header.search}
                />
                <div class="ib-ex-search-area__btn-section">
                    <SortDropdown
                        active={this.props.sortActive}
                        key="ib-ex-sort-dropdown"
                        field={this.props.sortField}
                        order={this.props.sortOrder}
                        availableFields={availableOptions}
                        onFieldChange={this.handleSortFieldChange}
                        onOrderChange={this.handleSortOrderChange}
                        onClick={this.handleSortClick}
                    />
                    <IconButton
                        key="ib-ex-filter-btn"
                        active={this.props.expandedFiltersActive}
                        handleClick={this.handleToggleFilters}
                    >
                        <div class="drp-sort__btn-body">
                            <svg width="16px" height="16px" viewBox="0 0 16 16">
                                <g stroke="none" stroke-width="1">
                                    <g id="filter-sliders-1px-16">
                                        <path d="M7,13 L0,13 L0,12 L7,12 L7,10 L8,10 L8,15 L7,15 L7,13 Z M12,8 L0,8 L0,7 L12,7 L12,5 L13,5 L13,10 L12,10 L12,8 Z M2,3 L0,3 L0,2 L2,2 L2,0 L3,0 L3,5 L2,5 L2,3 Z M4,2 L16,2 L16,3 L4,3 L4,2 Z M14,7 L16,7 L16,8 L14,8 L14,7 Z M9,12 L16,12 L16,13 L9,13 L9,12 Z" />
                                    </g>
                                </g>
                            </svg>
                            <span class="drp-sort__btn-label">{i18n.filterPane.filter}</span>
                        </div>
                    </IconButton>
                </div>
            </div>
        );
    }

    private handleToggleFilters() {
        this.props.toggleExpandedFilters();
    }

    private handleSearchChange(e: any) {
        this.props.changeSearchString(e.target.value);
        if (e.target.value === "" && this.props.previousSearchString !== "") {
            this.props.search(true);
        }
    }

    private handleSearchKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            this.props.search(true);
        }
    }

    private handleSortFieldChange(field: SortField) {
        this.props.changeSortField(field);
        this.props.search();
    }

    private handleSortOrderChange(order: SortOrder) {
        this.props.changeSortOrder(order);
        this.props.search();
    }

    private handleSortClick() {
        this.props.toggleExpandedSort();
    }
}
