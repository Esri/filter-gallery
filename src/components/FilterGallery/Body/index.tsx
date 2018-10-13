import * as i18n from "dojo/i18n!../../nls/resources";
import { Component, H, Pojo, connect, ComponentProps } from "../../../Component";

import InputArea from "./InputArea";
import ResultPanel from "./ResultPanel";
import SearchArea from "./SearchArea";
import Pager from "../../Navigation/Pager";
import LoaderBars from "../../Loaders/LoaderBars";
import MobileWrap from "../../Modals/MobileWrap";
import Filters from "./Filters";
import { FilterGalleryStore } from "../../..";
import { changePage, toggleFilters } from "../../../_actions";

export interface BodyProps extends ComponentProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * Visibility of the filters panel.
     * @type {boolean}
     */
    filtersActive: boolean;

    /**
     * Current state of the results.
     * @type {string}
     */
    resultStatus: "loading" | "loadingNext" | "failed" | "success" | "empty";

    /**
     * Current state of the pagination.
     * @type {string}
     */
    paginationStatus: string;

    /**
     * Array of items displayed on the current page.
     * @type {array}
     */
    pageDisplayItems: Pojo[];

    /**
     * The page currently being viewed.
     * @type {number}
     */
    currentPage: number;

    /**
     * The total number of items being displayed.
     * @type {number}
     */
    itemTotal: number;

    /**
     * The total number of results to return per query.
     * @type {number}
     */
    resultsPerQuery: number;

    /**
     * Handler for when the page is changed.
     * @type {function}
     */
    changePage: (page: number) => void;

    /**
     * Handler for when the state of the filter panel is changed.
     * @type {function}
     */
    toggleFilters: () => void;
}

/**
 * Body of the expanded `ItemBrowser`.
 */
class Body extends Component<BodyProps> {
    constructor(props: BodyProps) {
        super(props);

        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleCloseMobileFilters = this.handleCloseMobileFilters.bind(this);
    }

    public render(tsx: H) {
        // const expandedFilters = this.stateTree.ui.expanded.filters;
        const expandedFilters = this.props.filtersActive;
        const filterClasses = {
            "fg__section": true,
            "fg__filters": true,
            "fg__filters--hidden": !expandedFilters,
            "fg__-filters--visible": expandedFilters
        };

        const loading = this.props.resultStatus === "loading" ||
            this.props.paginationStatus === "loading";

        const fadedClasses = {
            "fb__wrapper": true,
            "fb__wrapper--faded": loading,
            "fb__wrapper--transparent": loading && this.props.pageDisplayItems.length === 0
        };

        const numPages = Math.ceil(
            this.props.itemTotal > 10000 ?
            10000 / this.props.resultsPerQuery :
            this.props.itemTotal /
            this.props.resultsPerQuery
        );
    
        return (
            <main class="fb__body">
                <SearchArea key="fb__search-area" />
                <div class="fb__row">
                    <section classes={filterClasses} key="fullscreen-filters">
                        <Filters key="normal-filters" />
                    </section>
                    <div class="fb__overlay-filters">
                        <MobileWrap
                            key="mobile-filter-wrap"
                            maxHeight={true}
                            open={this.props.filtersActive}
                            onClose={this.handleCloseMobileFilters}
                            title="Filter"
                            footer={
                                <button
                                    class="fb__filter-results-btn"
                                    onclick={this.handleCloseMobileFilters}
                                >
                                    {i18n.gallery.viewResults}
                                </button>
                            }
                        >
                            <Filters key="mobile-filters"/>
                        </MobileWrap>
                    </div>
                    <section class="fb__section fb__results" key="results-section">
                        <div classes={fadedClasses}>
                            <InputArea key="big-browser-input-area" />
                            <ResultPanel key="big-browser-result-panel" />
                            {
                                numPages > 1 ?
                                <Pager
                                    key="big-browser-pager"
                                    onPageChange={this.handlePageChange}
                                    numPages={numPages}
                                    currentPage={this.props.currentPage}
                                    paginationLimitReached={this.props.itemTotal > 10000}
                                /> :
                                null
                            }
                        </div>
                        {
                            loading ? (
                                <div class="fg__load-container" key="fg__load-container">
                                    <LoaderBars key="item-ex-loading" />
                                </div>
                            ) : null
                        }
                    </section>
                </div>
            </main>
        );
    }

    private handlePageChange(page: number) {
        this.props.changePage(page);
    }

    private handleCloseMobileFilters() {
        this.props.toggleFilters();
    }
}

interface StateProps {
    filtersActive: boolean;
    resultStatus: "loading" | "loadingNext" | "failed" | "success" | "empty";
    paginationStatus: string;
    pageDisplayItems: Pojo[];
    currentPage: number;
    itemTotal: number;
    resultsPerQuery: number;
}

interface DispatchProps {
    changePage: (page: number) => void;
    toggleFilters: () => void;
}

export default connect<BodyProps, FilterGalleryStore, StateProps, DispatchProps>(
    (state) => ({
        filtersActive: state.ui.filters.filtersOpen,
        resultStatus: state.ui.resultPanel.status,
        paginationStatus: state.ui.pagination.status,
        pageDisplayItems: state.results.displayItems,
        currentPage: state.ui.pagination.page,
        itemTotal: state.parameters.nextQuery.total,
        resultsPerQuery: state.settings.config.resultsPerQuery
    }),
    (dispatch) => ({
        changePage: (page: number) => dispatch(changePage(page)),
        toggleFilters: () => dispatch(toggleFilters())
    })
)(Body);
