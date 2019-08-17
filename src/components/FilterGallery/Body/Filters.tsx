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

        const sectionFilters = availableFilters.map((filter: string | CategoryFilter, index: number) => {
            switch (filter) {
                case "itemType":
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
                            title="Date Modified"
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
                            title="Date Created"
                            onDateSelect={this.handleCreatedFilterChange}
                            dateFilter={this.props.stateTree.parameters.filter.dateCreated}
                            dateSection={this.props.stateTree.ui.filters.createdSection}
                            startActive={filtersDefault.indexOf("created") > -1 ? true : false}
                        />
                    );
                case "shared":
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
                            return (
                                <CategoriesFilter
                                    key="custom-group-categories-filter"
                                    onCategorySelect={this.handleCategorySelect}
                                    onClearCategories={this.handleClearGroupCategories}
                                    availableCategories={
                                        filter.path && pathCategories ? pathCategories : schema.children
                                    }
                                    categoriesFilter={this.props.stateTree.parameters.filter.categories}
                                    title={filter["name"]}
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
    }

    private handleStatusFilterChange(statusOption: FilterGalleryState["parameters"]["filter"]["status"]) {
        this.props.dispatch(updateStatusFilter(statusOption));
        this.props.dispatch(search());
    }

    private handleTagsFilterChange(tags: FilterGalleryState["parameters"]["filter"]["tags"]) {
        this.props.dispatch(updateTagsFilter(tags));
        this.props.dispatch(search());
    }

    private handleCategorySelect(category: CategoriesOption) {
        const filter = this.props.stateTree.parameters.filter.categories;
        if (filter && filter.value === category.value) {
            this.props.dispatch(updateCategoriesFilter());
        } else {
            this.props.dispatch(updateCategoriesFilter(category));
        }
        this.props.dispatch(search());
    }

    private handleClearGroupCategories() {
        this.props.dispatch(updateCategoriesFilter());
        this.props.dispatch(search());
    }

    private handleTagsFilterStringChange(tagName: string) {
        this.props.dispatch(updateTagsFilterString(tagName));
    }
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
