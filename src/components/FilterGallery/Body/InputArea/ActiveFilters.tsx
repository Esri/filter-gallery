import i18n = require("dojo/i18n!../../../../nls/resources");
import { Component, H, connect, ComponentProps } from "../../../../Component";
import {
    CLEAR_ALL_FILTERS,
    updateItemTypeFilter,
    updateModifiedFilter,
    updateCreatedFilter,
    updateSharedFilter,
    updateStatusFilter,
    updateTagsFilter,
    search,
    updateCategoriesFilter
} from "../../../../_actions";

import FilterController, { FilterControllerProps } from "../../../Dropdowns/FilterController";
import { FilterGalleryState } from "../../../../_reducer";
import { FilterGalleryStore } from "../../../..";
import ioQuery = require("dojo/io-query");

const generalUpdateActions = {
    itemType: updateItemTypeFilter(),
    modified: updateModifiedFilter(),
    created: updateCreatedFilter(),
    shared: updateSharedFilter(),
    status: updateStatusFilter()
};

export interface ActiveFilterProps extends ComponentProps {
    /**
     * Display mode of the filters. Options are `"light"` or `"dark"`.
     * @type {string}
     */
    theme: "light" | "dark";

    /**
     * Current state tree of the `ItemBrowser`.
     * @type {object}
     */
    stateTree: FilterGalleryState; // bad

    /**
     * Dispatch function from the `ItemBrowser` store.
     * @type {function}
     */
    dispatch: FilterGalleryStore["dispatch"]; // bad
}

/**
 * The active filters section of the `ItemBrowser`.
 */
export class ActiveFilters extends Component<ActiveFilterProps> {
    constructor(props: ActiveFilterProps) {
        super(props);

        this.handleRemoveGeneralFilter = this.handleRemoveGeneralFilter.bind(this);
        this.handleRemoveGroupCategoriesFilter = this.handleRemoveGroupCategoriesFilter.bind(this);
        this.handleClearAll = this.handleClearAll.bind(this);
        this.handleRemoveTagsFilter = this.handleRemoveTagsFilter.bind(this);
    }

    public render(tsx: H) {
        const filter = this.props.stateTree.parameters.filter;
        const activeFilters: FilterControllerProps["filters"] = [];

        if (!!filter.itemType) {
            activeFilters.push({
                filterId: "itemType",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.gallery.filterChips.type}: ${filter.itemType.text}`
            });
        }

        if (!!filter.dateModified) {
            activeFilters.push({
                filterId: "modified",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.gallery.filterChips.dateModified}: ${filter.dateModified.label}`
            });
        }

        if (!!filter.dateCreated) {
            activeFilters.push({
                filterId: "created",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.gallery.filterChips.dateCreated}: ${filter.dateCreated.label}`
            });
        }

        if (!!filter.shared) {
            activeFilters.push({
                filterId: "shared",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.gallery.filterChips.access}: ${filter.shared.text}`
            });
        }

        if (!!filter.status) {
            activeFilters.push({
                filterId: "status",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.gallery.filterChips.status}: ${filter.status.text}`
            });
        }

        if (!!filter.categories) {
            const catFilter = filter.categories;
            activeFilters.push({
                filterId: catFilter.value,
                onRemove: this.handleRemoveGroupCategoriesFilter,
                text: `${i18n.gallery.filterChips.category}: ${catFilter.text}`
            });
        }

        if (!!filter.tags) {
            const tagsFilter = filter.tags;
            Object.keys(tagsFilter).forEach((key: string) => {
                activeFilters.push({
                    filterId: key,
                    onRemove: this.handleRemoveTagsFilter,
                    text: `${i18n.gallery.filterChips.tagged}: ${key}`
                });
            });
        }

        if (activeFilters.length > 0) {
            return (
                <div key="active-filter-area" class="fg__active-filters">
                    <FilterController
                        key="item-browser-filter-controller"
                        filters={activeFilters.sort((a: any, b: any) => a.text.localeCompare(b.text))}
                        onClear={this.handleClearAll}
                        mode={this.props.theme === "light" ? "full-width" : "expanding"}
                        startOpen={this.props.theme !== "light"}
                        theme={this.props.theme}
                    />
                </div>
            );
        }

        return;
    }

    private handleRemoveGeneralFilter(e: any) {
        this.props.dispatch(generalUpdateActions[e.target.value]);
        this.props.dispatch(search(e.target.value === "folder"));
        this.handleToggleUrl(e.target.value, "");
    }

    private handleClearAll() {
        this.props.dispatch({ type: CLEAR_ALL_FILTERS });
        this.props.dispatch(search());
        this.handleClearAllUrlParams();
    }

    private handleRemoveGroupCategoriesFilter(e: any) {
        this.props.dispatch(updateCategoriesFilter());
        this.props.dispatch(search());
        this.handleToggleUrl("categories", "");
    }

    private handleRemoveTagsFilter(e: any) {
        const tags = this.props.stateTree.parameters.filter.tags;
        if (tags && !!tags[e.target.value]) {
            const newTags = { ...tags };
            delete newTags[e.target.value];
            if (Object.keys(newTags).length > 0) {
                this.props.dispatch(updateTagsFilter(newTags));
                this.handleToggleUrl("tags", Object.keys(newTags).toString());
            } else {
                this.props.dispatch(updateTagsFilter());
                this.handleToggleUrl("tags", "");
            }
            this.props.dispatch(search());
        }
    }

    private handleToggleUrl(param: string, value: string) {
        const newSearch = this.handleUrlParamSwitch(param, value);
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + newSearch;
        window.history.pushState({ path: newurl }, "", newurl);
    }

    private handleUrlParamSwitch(param: string, value: string): string {
        // const url = window.location.search;
        const query = ioQuery.queryToObject(decodeURI(window.location.search.slice(1)));
        query[param] = value;
        if (value === "") {
            delete query[param];
        }
        return ioQuery.objectToQuery(query);
    }

    private handleUrlParamClear(): string {
        // const url = window.location.search;
        const query = ioQuery.queryToObject(decodeURI(window.location.search.slice(1)));
        const filters = ["categories", "itemType", "shared", "status", "tags"];
        for (const param in query) {
            if (filters.indexOf(param) !== -1) {
                delete query[param];
            }
        }
        return ioQuery.objectToQuery(query);
    }

    private handleClearAllUrlParams() {
        const newSearch = this.handleUrlParamClear();
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + newSearch;
        window.history.pushState({ path: newurl }, "", newurl);
    }
}

interface StateProps {
    stateTree: FilterGalleryState;
}

interface DispatchProps {
    dispatch: FilterGalleryStore["dispatch"];
}

export default connect<ActiveFilterProps, FilterGalleryStore, StateProps, DispatchProps>(
    (state) => ({
        stateTree: state
    }),
    (dispatch) => ({
        dispatch
    })
)(ActiveFilters);
