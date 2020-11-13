import * as i18n from "dojo/i18n!../../nls/resources";
import { Component, H, connect, ComponentProps } from "../../../Component";
import { genericSubtreeFromPath } from "../../../_utils";

import { ToggleOption } from "../../Buttons/Toggle";
import DateFilter from "../../Filters/DateFilter";
import ItemTypeFilter from "../../Filters/ItemTypeFilter";
import SharedFilter from "../../Filters/SharedFilter";
import StatusFilter from "../../Filters/StatusFilter";
import TagsFilter from "../../Filters/TagsFilter";
import CategoriesFilter, { CategoriesOption } from "../../Filters/CategoriesFilter";
import { FilterGalleryState } from "../../../_reducer";
import { FilterGalleryStore } from "../../..";
import {
    search,
    updateItemTypeFilter,
    updateModifiedFilter,
    updateCreatedFilter,
    updateSharedFilter,
    updateStatusFilter,
    updateTagsFilter,
    updateCategoriesFilter,
    updateTagsFilterString
} from "../../../_actions";
import { CategoryFilter } from "../../../_reducer/settings/config";
import { treeCompress, treePrune, ItemTypeFilter as ItemTypeFilters } from "../../../_utils";
import itemTypeOptions from "../../Filters/ItemTypeFilter/_utils/itemTypeOptions";
import { SharedFilterOptions } from "../../Filters/SharedFilter";
import { StatusFilterOptions } from "../../Filters/StatusFilter";
import * as ioQuery from "dojo/io-query";


export interface FilterPaneProps extends ComponentProps {
    /**
     * The current state tree of the `ItemBrowser`.
     * @type {object}
     */
    stateTree: FilterGalleryState;

    /**
     * The dispatch function of the `ItemBrowserStore`.
     * @type {function}
     */
    dispatch: FilterGalleryStore["dispatch"];
}

/**
 * The `ItemBrowser` filter pane.
 */
export class FilterPane extends Component<FilterPaneProps> {
    constructor(props: FilterPaneProps) {
        super(props);

        this.handleCreatedFilterChange = this.handleCreatedFilterChange.bind(this);
        this.handleItemTypeFilterChange = this.handleItemTypeFilterChange.bind(this);
        this.handleModifiedFilterChange = this.handleModifiedFilterChange.bind(this);
        this.handleSharedFilterChange = this.handleSharedFilterChange.bind(this);
        this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
        this.handleTagsFilterChange = this.handleTagsFilterChange.bind(this);
        this.handleClearGroupCategories = this.handleClearGroupCategories.bind(this);
        this.handleTagsFilterStringChange = this.handleTagsFilterStringChange.bind(this);
        this.handleCategorySelect = this.handleCategorySelect.bind(this);
    }

    public render(tsx: H) {
        const config = this.props.stateTree.settings.config;
        const user = this.props.stateTree.settings.utils.portal.user;

        const availableFilters = this.props.stateTree.settings.config.section.filters;
        const filtersDefault = config.filtersDefault;

        const urlParams = this.mapFromUrlParams(this.getQueryParams());

        this.props.stateTree.parameters.filter = {
            ...urlParams,
            ...this.props.stateTree.parameters.filter
        };

        const sectionFilters = availableFilters.map((filter: string | CategoryFilter, index: number) => {
            switch (filter) {
                case "itemType":
                    if (this.props.stateTree.parameters.filter.itemType && 
                    !this.props.stateTree.parameters.filter.itemType.text) {
                        const types = treeCompress(treePrune(
                            {  value: "##itemTypeOptionsRoot", children: itemTypeOptions },
                            config.availableItemTypeFilters
                        )).children as ToggleOption[];
                        this.props.stateTree.parameters.filter.itemType.text = "" + 
                            this.props.stateTree.parameters.filter.itemType ?
                                // tslint:disable-next-line: max-line-length
                                this.mapUrlParamToFilter(this.props.stateTree.parameters.filter.itemType.value, types) :
                                "";
                    }
                    return (
                        <ItemTypeFilter
                            key="item-type-filter"
                            onItemTypeSelect={this.handleItemTypeFilterChange}
                            availableItemTypes={config.availableItemTypeFilters}
                            itemTypeFilter={this.props.stateTree.parameters.filter.itemType}
                            startActive={filtersDefault.indexOf("itemType") > -1 ? true : false}
                        />
                    );
                case "modified":
                    return (
                        <DateFilter
                            key="modified-filters"
                            title={i18n.gallery.filterChips.dateModified}
                            onDateSelect={this.handleModifiedFilterChange}
                            dateFilter={this.props.stateTree.parameters.filter.dateModified}
                            dateSection={this.props.stateTree.ui.filters.modifiedSection}
                            startActive={filtersDefault.indexOf("modified") > -1 ? true : false}
                        />
                    );
                case "created":
                    return (
                        <DateFilter
                            key="created-filters"
                            title={i18n.gallery.filterChips.dateCreated}
                            onDateSelect={this.handleCreatedFilterChange}
                            dateFilter={this.props.stateTree.parameters.filter.dateCreated}
                            dateSection={this.props.stateTree.ui.filters.createdSection}
                            startActive={filtersDefault.indexOf("created") > -1 ? true : false}
                        />
                    );
                case "shared":
                    if (this.props.stateTree.parameters.filter.shared && 
                    !this.props.stateTree.parameters.filter.shared.text) {
                        this.props.stateTree.parameters.filter.shared.text = "" + 
                            this.props.stateTree.parameters.filter.shared ?
                                // tslint:disable-next-line: max-line-length
                                this.mapUrlParamToFilter(this.props.stateTree.parameters.filter.shared.value, SharedFilterOptions) :
                                "";
                    }
                    return (
                        <SharedFilter
                            counts={this.props.stateTree.results.counts.access}
                            key="shared-filters"
                            onSharedSelect={this.handleSharedFilterChange}
                            sharedFilter={this.props.stateTree.parameters.filter.shared}
                            hideOrgGroupFilters={!!user && !user.orgId}
                            startActive={filtersDefault.indexOf("shared") > -1 ? true : false}
                        />
                    );
                case "status":
                    const {
                        deprecated,
                        orgAuthoritative,
                        publicAuthoritative
                    } = this.props.stateTree.results.counts.contentStatus;
                    if (this.props.stateTree.parameters.filter.status && 
                        !this.props.stateTree.parameters.filter.status.text) {
                            this.props.stateTree.parameters.filter.status.text = "" + 
                                this.props.stateTree.parameters.filter.status ?
                                    // tslint:disable-next-line: max-line-length
                                    this.mapUrlParamToFilter(this.props.stateTree.parameters.filter.status.value, StatusFilterOptions) :
                                    "";
                        }
                    return (
                        <StatusFilter
                            counts={{
                                authoritative:
                                    (user && user.orgId) ?
                                        orgAuthoritative + publicAuthoritative :
                                        publicAuthoritative,
                                deprecated: deprecated
                            }}
                            key="status-filters"
                            onStatusSelect={this.handleStatusFilterChange}
                            statusFilter={this.props.stateTree.parameters.filter.status}
                            startActive={filtersDefault.indexOf("status") > -1 ? true : false}
                        />
                    );
                case "tags":
                    return (
                        <TagsFilter
                            availableTags={this.props.stateTree.ui.tagsFilter.visibleTags}
                            filterString={this.props.stateTree.ui.tagsFilter.filterString}
                            key="ib-tags-filter"
                            onFilterStringChange={this.handleTagsFilterStringChange}
                            onTagSelect={this.handleTagsFilterChange}
                            tagsFilter={this.props.stateTree.parameters.filter.tags}
                            startActive={filtersDefault.indexOf("tags") > -1 ? true : false}
                        />
                    );
                default:
                    if (typeof filter === "object") {
                        const schema = this.props.stateTree.results.section.schema;
                        if (!!schema && !!schema.children && !!schema.children[0] && !!schema.children[0].children) {
                            let pathCategories;
                            if (filter.path) {
                                const subTree = genericSubtreeFromPath<ToggleOption, "value">(
                                    "children",
                                    "value",
                                    schema,
                                    filter.path
                                );
                                pathCategories = subTree ? subTree.children : undefined;
                            }
                            // tslint:disable-next-line: max-line-length
                            const availableCats = (filter.path && pathCategories) ? pathCategories : schema.children;
                            // tslint:disable-next-line: max-line-length
                            if (this.props.stateTree.parameters.filter.categories && !this.props.stateTree.parameters.filter.categories.text) {
                                // tslint:disable-next-line: max-line-length
                                this.props.stateTree.parameters.filter.categories.text = this.mapUrlParamToFilter(this.props.stateTree.parameters.filter.categories.value, availableCats);
                            }
                            return (
                                <CategoriesFilter
                                    key="custom-group-categories-filter"
                                    onCategorySelect={this.handleCategorySelect}
                                    onClearCategories={this.handleClearGroupCategories}
                                    availableCategories={availableCats}
                                    categoriesFilter={this.props.stateTree.parameters.filter.categories}
                                    title={i18n.gallery.filterChips.category}
                                    prependValue={`/${filter.path ? filter.path.join("/") + "/" : ""}`}
                                    startActive={filtersDefault.indexOf("categories") > -1 ? true : false}
                                />
                            );
                        }
                    }
                    return null;
            }
            return null;
        });

        return (
            <div key="filter-accordion" class="fg-filter-pane__accordion">
                {sectionFilters}
            </div>
        );
    }

    private handleItemTypeFilterChange(itemTypeOption: FilterGalleryState["parameters"]["filter"]["itemType"]) {
        this.props.dispatch(updateItemTypeFilter(itemTypeOption));
        this.props.dispatch(search());
        const options = itemTypeOption ? itemTypeOption.value : "";
        this.handleToggleUrl("itemType", options);
    }

    private handleModifiedFilterChange(
        section?: FilterGalleryState["ui"]["filters"]["modifiedSection"],
        modifiedOption?: FilterGalleryState["parameters"]["filter"]["dateModified"]
    ) {
        this.props.dispatch(updateModifiedFilter(section, modifiedOption));
        this.props.dispatch(search());
    }

    private handleCreatedFilterChange(
        section?: FilterGalleryState["ui"]["filters"]["createdSection"],
        createdOption?: FilterGalleryState["parameters"]["filter"]["dateCreated"]
    ) {
        this.props.dispatch(updateCreatedFilter(section, createdOption));
        this.props.dispatch(search());
    }

    private handleSharedFilterChange(sharedOption: FilterGalleryState["parameters"]["filter"]["shared"]) {
        this.props.dispatch(updateSharedFilter(sharedOption));
        this.props.dispatch(search());
        const options = sharedOption ? sharedOption.value : "";
        this.handleToggleUrl("shared", options);
    }

    private handleStatusFilterChange(statusOption: FilterGalleryState["parameters"]["filter"]["status"]) {
        this.props.dispatch(updateStatusFilter(statusOption));
        this.props.dispatch(search());
        const options = statusOption ? statusOption.value : "";
        this.handleToggleUrl("status", options);
    }

    private handleTagsFilterChange(tags: FilterGalleryState["parameters"]["filter"]["tags"]) {
        this.props.dispatch(updateTagsFilter(tags));
        this.props.dispatch(search());
        const options = tags ? Object.keys(tags).toString() : "";
        this.handleToggleUrl("tags", options);
    }

    private handleCategorySelect(category: CategoriesOption) {
        const filter = this.props.stateTree.parameters.filter.categories;
        if (filter && filter.value === category.value) {
            this.props.dispatch(updateCategoriesFilter());
        } else {
            this.props.dispatch(updateCategoriesFilter(category));
        }
        this.props.dispatch(search());
        this.handleToggleUrl("categories", category.value);
    }

    private handleClearGroupCategories() {
        this.props.dispatch(updateCategoriesFilter());
        this.props.dispatch(search());
        this.handleToggleUrl("categories", "");
    }

    private handleTagsFilterStringChange(tagName: string) {
        this.props.dispatch(updateTagsFilterString(tagName));
    }

    private getQueryParams() {
        return ioQuery.queryToObject(decodeURI(window.location.search.slice(1)));
    }

    private mapFromUrlParams(params: Object) {
        let newObj = {};
        for (let key of Object.keys(params)) {
            if (
                key === "categories" ||
                key === "itemType" ||
                key === "shared" ||
                key === "status" 
            ) {
                newObj[key] = {value: params[key]};
            } else if (
                key === "tags"
            ) {
                const tagsString: string = params[key];
                const tags = {};
                tagsString.split(",").map((tag) => {
                    tags[tag] = true;
                });
                newObj[key] = tags;
            }
        }
        return newObj;
    }

    private mapUrlParamToFilter(paramValue: string, filters: ToggleOption[]): string {
        let returnText = "";
        const param = paramValue.split("/").pop();
        filters.forEach((filter) => {
            if ( paramValue.indexOf(filter.value) !== -1 ) {
                if ( filter.value === param ) {
                    returnText = filter.displayName;
                } else if (filter.children) {
                    returnText = this.mapUrlParamToFilter(paramValue, filter.children);
                }
            } 
        });
        return returnText;
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

    /* 

    categories: {value: "/categories/trail type", text: "Trail type"}
    dateCreated: {start: 1589232718662, end: 1591824718662, label: "Last 30 Days"}
    dateModified: {start: 1589232725348, end: 1591824725348, label: "Last 30 Days"}
    itemType: {value: "apps", text: "Apps"}
    shared: {value: "public", text: "With Everyone (public)"}
    status: {value: "authoritative", text: "Authoritative"}
    __proto__: Object


    */
}

interface StateProps {
    stateTree: FilterGalleryState;
}

interface DispatchProps {
    dispatch: FilterGalleryStore["dispatch"];
}

export default connect<FilterPaneProps, FilterGalleryStore, StateProps, DispatchProps>(
    (state) => ({
        stateTree: state
    }),
    (dispatch) => ({
        dispatch
    })
)(FilterPane);
