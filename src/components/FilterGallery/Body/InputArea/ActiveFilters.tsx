import * as i18n from "dojo/i18n!../nls/resources";
import { Component, H, connect, ComponentProps } from "../../../../Component";
import {
    CLEAR_ALL_FILTERS,
    updateItemTypeFilter,
    updateModifiedFilter,
    updateCreatedFilter,
    updateSharedFilter,
    updateFolderFilter,
    updateGroupFilter,
    updateStatusFilter,
    updateMapAreaFilter,
    updateSearchOrgFilter,
    updateOrgCategoriesFilter,
    updateLivingAtlasCategoriesFilter,
    updateLivingAtlasRegionFilter,
    updateGroupCategoriesFilter,
    updateOrgGroupFilter,
    updateTagsFilter,
    search,
    updateCustomFilter
} from "../../../_actions/index";

import FilterController, { FilterControllerProps } from "../../../Dropdowns/FilterController";
import { isEmpty } from "../../../../_utils";

const generalUpdateActions = {
    itemType: updateItemTypeFilter(),
    modified: updateModifiedFilter(),
    created: updateCreatedFilter(),
    shared: updateSharedFilter(),
    folder: updateFolderFilter(),
    group: updateGroupFilter(),
    status: updateStatusFilter(),
    orgGroup: updateOrgGroupFilter()
};

export interface ActiveFilterProps extends ComponentProps {
    /**
     * Array of informational static filters to show in the UI.
     * @type {array}
     */
    staticFilters?: string[];

    /**
     * Display mode of the filters. Options are `"light"` or `"dark"`.
     * @type {string}
     */
    theme: "light" | "dark";

    /**
     * Current state tree of the `ItemBrowser`.
     * @type {object}
     */
    stateTree: ItemBrowserState; // bad

    /**
     * Dispatch function from the `ItemBrowser` store.
     * @type {function}
     */
    dispatch: ItemBrowserStore["dispatch"]; // bad
}

/**
 * The active filters section of the `ItemBrowser`.
 */
export default class ActiveFilters extends Component<ActiveFilterProps> {
    constructor(props: ActiveFilterProps) {
        super(props);

        this.handleRemoveMapAreaFilter = this.handleRemoveMapAreaFilter.bind(this);
        this.handleRemoveSearchOrgFilter = this.handleRemoveSearchOrgFilter.bind(this);
        this.handleRemoveGeneralFilter = this.handleRemoveGeneralFilter.bind(this);
        this.handleRemoveOrgCategoriesFilter = this.handleRemoveOrgCategoriesFilter.bind(this);
        this.handleRemoveLACategoriesFilter = this.handleRemoveLACategoriesFilter.bind(this);
        this.handleRemoveLARegionFilter = this.handleRemoveLARegionFilter.bind(this);
        this.handleRemoveGroupCategoriesFilter = this.handleRemoveGroupCategoriesFilter.bind(this);
        this.handleClearAll = this.handleClearAll.bind(this);
        this.handleRemoveTagsFilter = this.handleRemoveTagsFilter.bind(this);
        this.handleRemoveCustomFilter = this.handleRemoveCustomFilter.bind(this);
    }

    public render(tsx: H) {
        const filter = this.props.stateTree.parameters.filter;
        const activeFilters: FilterControllerProps["filters"] = [];

        if (
            !!filter.searchOrg &&
            this.props.stateTree.parameters.section === "all" &&
            this.props.stateTree.settings.utils.portal.user &&
            this.props.stateTree.settings.utils.portal.user["credential"] &&
            this.props.stateTree.settings.utils.portal.name
        ) {
            activeFilters.push({
                filterId: "searchOrg",
                onRemove: this.handleRemoveSearchOrgFilter,
                text: `Organization: ${this.props.stateTree.settings.utils.portal.name}`
            });
        }

        if (!!filter.searchMapArea) {
            activeFilters.push({
                filterId: "searchMapArea",
                onRemove: this.handleRemoveMapAreaFilter,
                text: i18n.filterChips.mapArea
            });
        }

        if (!!filter.itemType) {
            activeFilters.push({
                filterId: "itemType",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.filterChips.type}: ${filter.itemType.text}`
            });
        }

        if (!!filter.dateModified) {
            activeFilters.push({
                filterId: "modified",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.filterChips.dateModified}: ${filter.dateModified.label}`
            });
        }

        if (!!filter.dateCreated) {
            activeFilters.push({
                filterId: "created",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.filterChips.dateCreated}: ${filter.dateCreated.label}`
            });
        }

        if (!!filter.shared) {
            activeFilters.push({
                filterId: "shared",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.filterChips.access}: ${filter.shared.text}`
            });
        }

        if (!!filter.group && this.props.stateTree.parameters.section === "myGroups") {
            activeFilters.push({
                filterId: "group",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.filterChips.group}: ${filter.group.title}`
            });
        } else if (!!filter.orgGroup && this.props.stateTree.parameters.section === "myOrganization") {
            activeFilters.push({
                filterId: "orgGroup",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.filterChips.group}: ${filter.orgGroup.title}`
            });
        }

        if (!!filter.folder && this.props.stateTree.parameters.section === "myContent") {
            activeFilters.push({
                filterId: "folder",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.filterChips.folder}: ${filter.folder.title}`
            });
        }

        if (!!filter.status) {
            activeFilters.push({
                filterId: "status",
                onRemove: this.handleRemoveGeneralFilter,
                text: `${i18n.filterChips.status}: ${filter.status.text}`
            });
        }

        if (!!filter.orgCategories) {
            const catFilter = filter.orgCategories;
            activeFilters.push({
                filterId: catFilter.value,
                onRemove: this.handleRemoveOrgCategoriesFilter,
                text: `${i18n.filterChips.category}: ${catFilter.text}`
            });
        }

        if (!!filter.livingAtlasCategories) {
            const catFilter = filter.livingAtlasCategories;
            activeFilters.push({
                filterId: catFilter.value,
                onRemove: this.handleRemoveLACategoriesFilter,
                text: `${i18n.filterChips.category}: ${catFilter.text}`
            });
        }

        if (!!filter.groupCategories) {
            const catFilter = filter.groupCategories;
            activeFilters.push({
                filterId: catFilter.value,
                onRemove: this.handleRemoveGroupCategoriesFilter,
                text: `${i18n.filterChips.category}: ${catFilter.text}`
            });
        }

        if (!!filter.livingAtlasRegion) {
            const catFilter = filter.livingAtlasRegion;
            activeFilters.push({
                filterId: catFilter.value,
                onRemove: this.handleRemoveLARegionFilter,
                text: `${i18n.filterChips.region}: ${catFilter.text}`
            });
        }

        if (!!filter.tags) {
            const tagsFilter = filter.tags;
            Object.keys(tagsFilter).forEach((key: string) => {
                activeFilters.push({
                    filterId: key,
                    onRemove: this.handleRemoveTagsFilter,
                    text: `${i18n.filterChips.tagged}: ${key}`
                });
            });
        }

        if (activeFilters.length > 0) {
            return (
                <div key="active-filter-area" class="ib__active-filters">
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

    private handleRemoveCustomFilter(e: any) {
        this.props.dispatch(updateCustomFilter(parseInt(e.target.value, 10)));
        this.props.dispatch(search());
    }

    private handleRemoveGeneralFilter(e: any) {
        this.props.dispatch(generalUpdateActions[e.target.value]);
        this.props.dispatch(search(e.target.value === "folder"));
    }

    private handleRemoveMapAreaFilter(e: any) {
        this.props.dispatch(updateMapAreaFilter(false));
        this.props.dispatch(search());
    }

    private handleRemoveSearchOrgFilter(e: any) {
        this.props.dispatch(updateSearchOrgFilter(false));
        this.props.dispatch(search());
    }

    private handleClearAll() {
        const hasFolderFilter = !!this.props.stateTree.parameters.filter.folder;
        this.props.dispatch({ type: CLEAR_ALL_FILTERS });
        this.props.dispatch(search(hasFolderFilter));
    }

    private handleRemoveOrgCategoriesFilter(e: any) {
        this.props.dispatch(updateOrgCategoriesFilter());
        this.props.dispatch(search());
    }

    private handleRemoveLACategoriesFilter(e: any) {
        this.props.dispatch(updateLivingAtlasCategoriesFilter());
        this.props.dispatch(search());
    }

    private handleRemoveGroupCategoriesFilter(e: any) {
        this.props.dispatch(updateGroupCategoriesFilter());
        this.props.dispatch(search());
    }

    private handleRemoveLARegionFilter(e: any) {
        this.props.dispatch(updateLivingAtlasRegionFilter());
        this.props.dispatch(search());
    }

    private handleRemoveTagsFilter(e: any) {
        const tags = this.props.stateTree.parameters.filter.tags;
        if (tags && !!tags[e.target.value]) {
            const newTags = { ...tags };
            delete newTags[e.target.value];
            if (Object.keys(newTags).length > 0) {
                this.props.dispatch(updateTagsFilter(newTags));
            } else {
                this.props.dispatch(updateTagsFilter());
            }
            this.props.dispatch(search());
        }
    }
}
