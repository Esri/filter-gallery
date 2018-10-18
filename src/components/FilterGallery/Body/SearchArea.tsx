import * as i18n from "dojo/i18n!../../nls/resources";
import { Component, H, connect, Pojo } from "../../../Component";

import { FilterGalleryStore } from "../../..";
import IconButton from "../../Buttons/IconButton";
import SortDropdown, { SortField, SortOrder } from "../../Dropdowns/SortDropdown";
import { toggleFilters, toggleSort, changeSortField, changeSortOrder, changeSearchString, search, signIn, signOut } from "../../../_actions";

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
     * The available sort fields.
     * @type {array}
     */
    sortOptions: SortField[];

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
    filtersActive: boolean;

    /**
     * The current user.
     * @type {boolean}
     */
    user?: Pojo;

    /**
     * Handler for when the filter panel visibility is toggled.
     * @type {function}
     */
    toggleFilters: () => void;

    /**
     * Handler for when the sort dropdown visibility is toggled.
     * @type {function}
     */
    toggleSort: () => void;

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

    /**
     * Handler for when the user signs in.
     * @type {function}
     */
    signIn: () => void;

    /**
     * Handler for when the user signs out.
     * @type {function}
     */
    signOut: () => void;
}

/**
 * Search area for the expanded `ItemBrowser`.
 */
export class SearchArea extends Component<SearchAreaProps> {
    constructor(props: SearchAreaProps) {
        super(props);

        this.handleToggleFilters = this.handleToggleFilters.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchKeyDown = this.handleSearchKeyDown.bind(this);
        this.handleSortFieldChange = this.handleSortFieldChange.bind(this);
        this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
        this.handleSortClick = this.handleSortClick.bind(this);
        this.handleSignClick = this.handleSignClick.bind(this);
    }

    public render(tsx: H) {
        const placeholder = this.props.searchPlaceholderText ?
            this.props.searchPlaceholderText :
            i18n.gallery.searchPlaceholders.generic;

        return (
            <div class="fg-search-area__container">
                <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                        d="M19.205 18.295l-7.036-7.035A6.874 6.874 0 0 0 6.875 0 6.874 6.874 0 0 0 0 6.875a6.874 6.874 0 0 0 11.286 5.27l7.035 7.034.884-.884zM1.25 6.875A5.632 5.632 0 0 1 6.875 1.25 5.632 5.632 0 0 1 12.5 6.875 5.632 5.632 0 0 1 6.875 12.5 5.632 5.632 0 0 1 1.25 6.875z"
                        fill="#595959"
                        fill-rule="nonzero"
                    />
                </svg>
                <input
                    id="search"
                    class="fg-search-area__input"
                    type="search"
                    oninput={this.handleSearchChange}
                    onkeydown={this.handleSearchKeyDown}
                    value={this.props.searchString}
                    placeholder={placeholder}
                    title={i18n.gallery.header.search}
                    aria-label={i18n.gallery.header.search}
                />
                <div class="fg-search-area__btn-section">
                    <SortDropdown
                        active={this.props.sortActive}
                        key="fg-sort-dropdown"
                        field={this.props.sortField}
                        order={this.props.sortOrder}
                        availableFields={this.props.sortOptions}
                        onFieldChange={this.handleSortFieldChange}
                        onOrderChange={this.handleSortOrderChange}
                        onClick={this.handleSortClick}
                    />
                    <IconButton
                        key="fg-filter-btn"
                        active={this.props.filtersActive}
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
                            <span class="drp-sort__btn-label">{i18n.gallery.filterPane.filter}</span>
                        </div>
                    </IconButton>
                    {
                        !this.props.user ? (
                            <IconButton
                                key="fg-filter-btn"
                                active={false}
                                handleClick={this.handleSignClick}
                            >
                                <div class="drp-sort__btn-body">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 32 32"
                                    >
                                        <path d="M16.005 15.871a5.872 5.872 0 0 0 0-11.742 5.87 5.87 0 1 0 0 11.742zm11.567 7.188C27.27 19.036 20.023 18 16 18c-4.012 0-11.271 1.039-11.573 5.059C4.203 26.11 4.068 28.18 4.02 30h23.96c-.047-1.82-.184-3.891-.407-6.941z" />
                                    </svg>
                                    <span class="drp-sort__btn-label">
                                        {i18n.gallery.signIn}
                                    </span>
                                </div>
                            </IconButton>
                        ) : null
                    }
                </div>
            </div>
        );
    }

    private handleToggleFilters() {
        this.props.toggleFilters();
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
        this.props.toggleSort();
    }

    private handleSignClick() {
        if (this.props.user) {
            this.props.signOut();
        } else {
            this.props.signIn();
        }
    }
}

interface StateProps {
    previousSearchString: string;
    searchPlaceholderText: string | undefined;
    searchString: string;
    sortActive: boolean;
    sortField: SortField;
    sortOptions: SortField[];
    sortOrder: SortOrder;
    filtersActive: boolean;
    user: Pojo;
}

interface DispatchProps {
    toggleFilters: () => void;
    toggleSort: () => void;
    changeSortField: (field: SortField) => void;
    changeSortOrder: (order: SortOrder) => void;
    changeSearchString: (newString: string) => void;
    search: (updateCounts?: boolean) => void;
    signIn: () => void;
    signOut: () => void;
}

export default connect<SearchAreaProps, FilterGalleryStore, StateProps, DispatchProps>(
    (state) => ({
        previousSearchString: state.parameters.searchString.previous,
        searchPlaceholderText: state.settings.config.searchPlaceholderText,
        searchString: state.parameters.searchString.current,
        sortActive: state.ui.sort,
        sortField: state.parameters.sort.field,
        sortOrder: state.parameters.sort.order,
        sortOptions: state.settings.config.sortOptions,
        filtersActive: state.ui.filters.filtersOpen,
        user: state.settings.utils.portal.user
    }),
    (dispatch) => ({
        toggleFilters: () => dispatch(toggleFilters()),
        toggleSort: () => dispatch(toggleSort()),
        changeSortField: (field: SortField) => dispatch(changeSortField(field)),
        changeSortOrder: (order: SortOrder) => dispatch(changeSortOrder(order)),
        changeSearchString: (newString: string) => dispatch(changeSearchString(newString)),
        search: (updateCounts: boolean) => dispatch(search(updateCounts)),
        signIn: () => dispatch(signIn()),
        signOut: () => dispatch(signOut())
    })
)(SearchArea);
