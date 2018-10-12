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

export interface FilterPaneProps extends ComponentProps {
    /**
     * The current state tree of the `ItemBrowser`.
     * @type {object}
     */
    stateTree: ItemBrowserState;

    /**
     * The dispatch function of the `ItemBrowserStore`.
     * @type {function}
     */
    dispatch: ItemBrowserStore["dispatch"];
}

/**
 * The `ItemBrowser` filter pane.
 */
export default class FilterPane extends Component<FilterPaneProps> {
    constructor(props: FilterPaneProps) {
        super(props);

        this.handleCustomFilterToggle = this.handleCustomFilterToggle.bind(this);
        this.handleMapAreaToggle = this.handleMapAreaToggle.bind(this);
        this.handleSearchOrgToggle = this.handleSearchOrgToggle.bind(this);
        this.handleCreatedFilterChange = this.handleCreatedFilterChange.bind(this);
        this.handleItemTypeFilterChange = this.handleItemTypeFilterChange.bind(this);
        this.handleModifiedFilterChange = this.handleModifiedFilterChange.bind(this);
        this.handleSharedFilterChange = this.handleSharedFilterChange.bind(this);
        this.handleStatusFilterChange = this.handleStatusFilterChange.bind(this);
        this.handleFolderFilterChange = this.handleFolderFilterChange.bind(this);
        this.handleGroupFilterChange = this.handleGroupFilterChange.bind(this);
        this.handleOrgGroupFilterChange = this.handleOrgGroupFilterChange.bind(this);
        this.handleTagsFilterChange = this.handleTagsFilterChange.bind(this);
        this.handleOrgCategorySelect = this.handleOrgCategorySelect.bind(this);
        this.handleClearOrgCategories = this.handleClearOrgCategories.bind(this);
        this.handleGroupCategorySelect = this.handleGroupCategorySelect.bind(this);
        this.handleClearGroupCategories = this.handleClearGroupCategories.bind(this);
        this.handleLACategorySelect = this.handleLACategorySelect.bind(this);
        this.handleClearLACategories = this.handleClearLACategories.bind(this);
        this.handleLARegionSelect = this.handleLARegionSelect.bind(this);
        this.handleClearLARegion = this.handleClearLARegion.bind(this);
        this.handleTagsFilterStringChange = this.handleTagsFilterStringChange.bind(this);
    }

    public render(tsx: H) {
        const config = this.props.stateTree.settings.config;
        const filterParams = this.props.stateTree.parameters.filter;
        const user = this.props.stateTree.settings.utils.portal.user;

        const availableFilters = getFilters(this.props.stateTree);

        const sectionFilters = availableFilters.map((filter: string, index: number) => {
            switch (filter) {
                case "itemType":
                    return (
                        <ItemTypeFilter
                            key="item-type-filter"
                            onItemTypeSelect={this.handleItemTypeFilterChange}
                            availableItemTypes={config.availableItemTypeFilters}
                            itemTypeFilter={this.props.stateTree.parameters.filter.itemType}
                        />
                    );
                case "orgCategories": {
                    const schema = this.props.stateTree.results.organization.categorySchema;
                    if (!!schema && !!schema.children && !!schema.children[0] && schema.children[0].children) {
                        return (
                            <CategoriesFilter
                                key="org-categories-filter"
                                onCategorySelect={this.handleOrgCategorySelect}
                                onClearCategories={this.handleClearOrgCategories}
                                availableCategories={schema.children[0].children as ToggleOption[]}
                                categoriesFilter={this.props.stateTree.parameters.filter.orgCategories}
                                title={i18n.filterPane.categories}
                                prependValue={`/${schema.children[0].value}/`}
                            />
                        );
                    }
                    break;
                }
                case "livingAtlasCategories": {
                    const schema = this.props.stateTree.results.livingAtlas.categorySchema;
                    if (!!schema && !!schema.children && !!schema.children[0] && !!schema.children[0].children) {
                        return (
                            <CategoriesFilter
                                key="la-categories-filter"
                                onCategorySelect={this.handleLACategorySelect}
                                onClearCategories={this.handleClearLACategories}
                                availableCategories={schema.children[0].children as ToggleOption[]}
                                categoriesFilter={this.props.stateTree.parameters.filter.livingAtlasCategories}
                                title={schema.children[0].displayName}
                                prependValue="/categories/"
                                showTooltips={true}
                                startActive={true}
                            />
                        );
                    }
                    break;
                }
                case "livingAtlasRegion": {
                    const schema = this.props.stateTree.results.livingAtlas.categorySchema;
                    if (!!schema && !!schema.children && !!schema.children[1] && !!schema.children[1].children) {
                        return (
                            <CategoriesFilter
                                key="la-region-filter"
                                onCategorySelect={this.handleLARegionSelect}
                                onClearCategories={this.handleClearLARegion}
                                availableCategories={schema.children[1].children as ToggleOption[]}
                                categoriesFilter={this.props.stateTree.parameters.filter.livingAtlasRegion}
                                title={schema.children[1].displayName}
                                prependValue="/region/"
                                startActive={true}
                            />
                        );
                    }
                    break;
                }
                case "groupCategories":
                    if (!!filterParams.group) {
                        const schema = this.props.stateTree.results.user.groupCategories[filterParams.group.id];
                        if (!!schema && !!schema.children && !!schema.children[0] && !!schema.children[0].children) {
                            return (
                                <CategoriesFilter
                                    key="group-categories-filter"
                                    onCategorySelect={this.handleGroupCategorySelect}
                                    onClearCategories={this.handleClearGroupCategories}
                                    availableCategories={schema.children[0].children as ToggleOption[]}
                                    categoriesFilter={this.props.stateTree.parameters.filter.groupCategories}
                                    title={i18n.filterPane.groupCategories}
                                    prependValue={`/${schema.children[0].value}/`}
                                />
                            );
                        }
                    }
                    break;
                case "orgGroups":
                    // if (this.props.stateTree.results.organization.groups) {
                    //     return (
                    //         <GroupFilter
                    //             key="org-group-filter"
                    //             onGroupSelect={this.handleOrgGroupFilterChange}
                    //             availableGroups={this.props.stateTree.results.organization.groups}
                    //             groupFilter={this.props.stateTree.parameters.filter.orgGroup}
                    //             title={i18n.filterPane.orgGroups}
                    //         /> 
                    //     );
                    // }
                    break;
                case "modified":
                    return (
                        <DateFilter
                            key="modified-filters"
                            title="Date Modified"
                            onDateSelect={this.handleModifiedFilterChange}
                            dateFilter={this.props.stateTree.parameters.filter.dateModified}
                            dateSection={this.props.stateTree.ui.filters.modifiedSection}
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
                        />
                    );
                default:
                    if (typeof filter === "object") {
                        if (filter["type"] === "group") {
                            const schema = this.props.stateTree.results.customSections.groupSchemas[filter["id"]];
                            if (!!schema && !!schema.children && !!schema.children[0] && !!schema.children[0].children) {
                                let pathCategories;
                                if (filter["path"]) {
                                    const subTree = genericSubtreeFromPath<ToggleOption, "value">(
                                        "children",
                                        "value",
                                        schema,
                                        filter["path"]
                                    );
                                    pathCategories = subTree ? subTree.children : undefined;
                                }
                                return (
                                    <CategoriesFilter
                                        key="custom-group-categories-filter"
                                        onCategorySelect={this.handleGroupCategorySelect}
                                        onClearCategories={this.handleClearGroupCategories}
                                        availableCategories={
                                            filter["path"] && pathCategories ? pathCategories : schema.children
                                        }
                                        categoriesFilter={this.props.stateTree.parameters.filter.groupCategories}
                                        title={filter["name"]}
                                        prependValue={`/${filter["path"] ? filter["path"].join("/") + "/" : ""}`}
                                    />
                                );
                            }
                        } else if (filter["type"] === "org") {
                            const schema = this.props.stateTree.results.customSections.orgSchemas[filter["id"]];
                            if (!!schema && !!schema.children && !!schema.children[0] && !!schema.children[0].children) {
                                let pathCategories;
                                if (filter["path"]) {
                                    const subTree = genericSubtreeFromPath<ToggleOption, "value">(
                                        "children",
                                        "value",
                                        schema,
                                        filter["path"]
                                    );
                                    pathCategories = subTree ? subTree.children : undefined;
                                }
                                return (
                                    <CategoriesFilter
                                        key="custom-org-categories-filter"
                                        onCategorySelect={this.handleOrgCategorySelect}
                                        onClearCategories={this.handleClearOrgCategories}
                                        availableCategories={
                                            filter["path"] && pathCategories ? pathCategories : schema.children
                                        }
                                        categoriesFilter={this.props.stateTree.parameters.filter.orgCategories}
                                        title={filter["name"]}
                                        prependValue={`/${filter["path"] ? filter["path"].join("/") + "/" : ""}`}
                                    />
                                );
                            }
                        }
                    }
                    return null;
            }
            return null;
        });

        return (
            <div key="filter-accordion" class="ib-filter-pane__accordion">
                {sectionFilters}
            </div>
        );
    }

    private handleCustomFilterToggle(index: number, value?: string, text?: string) {
        this.props.dispatch(updateCustomFilter(index, value ? { value, text } : undefined));
        this.props.dispatch(search());
    }

    private handleMapAreaToggle() {
        this.props.dispatch(updateMapAreaFilter(!this.props.stateTree.parameters.filter.searchMapArea));
        this.props.dispatch(search());
    }

    private handleSearchOrgToggle() {
        const searchOrg = this.props.stateTree.parameters.filter.searchOrg;
        this.props.dispatch(updateSearchOrgFilter(!searchOrg));
        this.props.dispatch(search());
    }

    private handleItemTypeFilterChange(itemTypeOption: ItemBrowserState["parameters"]["filter"]["itemType"]) {
        this.props.dispatch(updateItemTypeFilter(itemTypeOption));
        this.props.dispatch(search());
    }

    private handleModifiedFilterChange(
        section?: ItemBrowserState["ui"]["filters"]["modifiedSection"],
        modifiedOption?: ItemBrowserState["parameters"]["filter"]["dateModified"]
    ) {
        this.props.dispatch(updateModifiedFilter(section, modifiedOption));
        this.props.dispatch(search());
    }

    private handleCreatedFilterChange(
        section?: ItemBrowserState["ui"]["filters"]["createdSection"],
        createdOption?: ItemBrowserState["parameters"]["filter"]["dateCreated"]
    ) {
        this.props.dispatch(updateCreatedFilter(section, createdOption));
        this.props.dispatch(search());
    }

    private handleSharedFilterChange(sharedOption: ItemBrowserState["parameters"]["filter"]["shared"]) {
        this.props.dispatch(updateSharedFilter(sharedOption));
        this.props.dispatch(search());
    }

    private handleStatusFilterChange(statusOption: ItemBrowserState["parameters"]["filter"]["status"]) {
        this.props.dispatch(updateStatusFilter(statusOption));
        this.props.dispatch(search());
    }

    private handleFolderFilterChange(folderOption: ItemBrowserState["parameters"]["filter"]["folder"]) {
        this.props.dispatch(updateFolderFilter(folderOption));
        this.props.dispatch(search(true));
    }

    private handleGroupFilterChange(groupOption: ItemBrowserState["parameters"]["filter"]["group"]) {
        this.props.dispatch(updateGroupFilter(groupOption));
        this.props.dispatch(search(true));
    }
    
    private handleOrgGroupFilterChange(groupOption: ItemBrowserState["parameters"]["filter"]["orgGroup"]) {
        this.props.dispatch(updateOrgGroupFilter(groupOption));
        this.props.dispatch(search());
    }

    private handleTagsFilterChange(tags: ItemBrowserState["parameters"]["filter"]["tags"]) {
        this.props.dispatch(updateTagsFilter(tags));
        this.props.dispatch(search());
    }

    private handleOrgCategorySelect(category: CategoriesOption) {
        const filter = this.props.stateTree.parameters.filter.orgCategories;
        if (filter && filter.value === category.value) {
            this.props.dispatch(updateOrgCategoriesFilter());
        } else {
            this.props.dispatch(updateOrgCategoriesFilter(category));
        }
        this.props.dispatch(search());
    }

    private handleClearOrgCategories() {
        this.props.dispatch(updateOrgCategoriesFilter());
        this.props.dispatch(search());
    }

    private handleLACategorySelect(category: CategoriesOption) {
        const filter = this.props.stateTree.parameters.filter.livingAtlasCategories;
        if (filter && filter.value === category.value) {
            this.props.dispatch(updateLivingAtlasCategoriesFilter());
        } else {
            this.props.dispatch(updateLivingAtlasCategoriesFilter(category));
        }
        this.props.dispatch(search());
    }

    private handleClearLACategories() {
        this.props.dispatch(updateLivingAtlasCategoriesFilter());
        this.props.dispatch(search());
    }

    private handleLARegionSelect(category: CategoriesOption) {
        const filter = this.props.stateTree.parameters.filter.livingAtlasRegion;
        if (filter && filter.value === category.value) {
            this.props.dispatch(updateLivingAtlasRegionFilter());
        } else {
            this.props.dispatch(updateLivingAtlasRegionFilter(category));
        }
        this.props.dispatch(search());
    }

    private handleClearLARegion() {
        this.props.dispatch(updateLivingAtlasRegionFilter());
        this.props.dispatch(search());
    }

    private handleGroupCategorySelect(category: CategoriesOption) {
        const filter = this.props.stateTree.parameters.filter.groupCategories;
        if (filter && filter.value === category.value) {
            this.props.dispatch(updateGroupCategoriesFilter());
        } else {
            this.props.dispatch(updateGroupCategoriesFilter(category));
        }
        this.props.dispatch(search());
    }

    private handleClearGroupCategories() {
        this.props.dispatch(updateGroupCategoriesFilter());
        this.props.dispatch(search());
    }

    private handleTagsFilterStringChange(tagName: string) {
        this.props.dispatch(updateTagsFilterString(tagName));
    }
}
