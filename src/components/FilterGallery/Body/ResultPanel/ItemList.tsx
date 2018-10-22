import * as i18n from "dojo/i18n!../../../nls/resources";
import { Component, H, connect, Pojo } from "../../../../Component";
import ListCard from "../../../ItemCards/ListCard";
import { FilterGalleryState } from "../../../../_reducer";
import { FilterGalleryStore } from "../../../..";
import GridCard from "../../../ItemCards/GridCard";

export interface ItemListProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * State tree of the `ItemBrowser`.
     * @type {object}
     */
    stateTree: FilterGalleryState;

    /**
     * The portal being queried.
     * @type {object}
     */
    portal: Pojo;

    /**
     * Dispatch function for custom actions.
     * @type {function}
     */
    dispatch: FilterGalleryStore["dispatch"];
}

/**
 * List of items for the expanded `ItemBrowser`.
 */
export class ItemList extends Component<ItemListProps> {
    public render(tsx: H) {
        const items = this.props.stateTree.ui.pagination.displayItems.map((item) => {

            const organization = (
                item.contentStatus === "public_authoritative" &&
                this.props.stateTree.results.allOrganizations[item.orgId]
            ) ? this.props.stateTree.results.allOrganizations[item.orgId] : undefined;

            return this.props.stateTree.ui.resultPanel.display === "list" ? (
                <ListCard
                    key={`${item.id}-list-card`}
                    item={item}
                    organization={organization}
                    portal={this.props.portal}
                    customActions={
                        this.props.stateTree.settings.config.customActions
                            .filter((action) => action.allowed(item, this.props.stateTree))
                    }
                    sortField={this.props.stateTree.parameters.sort.field}
                    dispatch={this.props.dispatch}
                    stateTree={this.props.stateTree}
                />
            ) : (
                <GridCard
                    key={`${item.id}-grid-card`}
                    item={item}
                    organization={organization}
                    portal={this.props.portal}
                    customActions={
                        this.props.stateTree.settings.config.customActions
                            .filter((action) => action.allowed(item, this.props.stateTree))
                    }
                    sortField={this.props.stateTree.parameters.sort.field}
                    dispatch={this.props.dispatch}
                    stateTree={this.props.stateTree}
                />
            );
        });

        const containerClasses = {
            "fg-results__item-list": this.props.stateTree.ui.resultPanel.display === "list",
            "fg-results__item-grid": this.props.stateTree.ui.resultPanel.display === "grid"
        };

        if (items.length > 0) {
            return (
                <div key={this.props.key} classes={containerClasses}>
                    {items}
                </div>
            );
        }
        return (
            <div key={`${this.props.key}-no-items`} class="fg-results__item-list">
                <div class="fg-results__no-items-container">
                    <div class="fg-results__no-items-centered">
                        <svg viewBox="0 0 256 256" width="256">
                            <path
                                fill="#ccc"
                                d="M149.375 182.444l56.463-56.471-25.376-25.376 5.523-14.541-59.827-22.726L110.828 48H56v124h18.365l12.437 4.724 34.182 34.101 15.33-15.294 7.07 2.686 5.164-13.597zm50.806-56.472l-47.34 47.35 26.064-68.626zM112 54.828L141.172 84H112zM60 52h48v36h36v80H60zm60.984 153.17L95.95 180.199l36.263 13.775zm20.081-12.113L85.632 172H148V85.172L133.059 70.23l47.766 18.144-34.628 91.171z"
                            >
                            </path>
                        </svg>
                        <p class="fg-results__no-items-text">{i18n.gallery.results.noItemsFound}</p>
                    </div>
                </div>
            </div>
        );
    }
}

interface StateProps {
    stateTree: FilterGalleryState,
    portal: Pojo;
}

interface DispatchProps {
    dispatch: FilterGalleryStore["dispatch"];
}

export default connect<ItemListProps, FilterGalleryStore, StateProps, DispatchProps>(
    (state) => ({
        stateTree: state,
        portal: state.settings.utils.portal
    }),
    (dispatch) => ({ dispatch })
)(ItemList);
