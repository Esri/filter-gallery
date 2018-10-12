import * as componentI18n from "dojo/i18n!../../nls/resources";
import { Component, H } from "../../Component";

export interface PagerProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * Number of pages to show in the pager.
     * @type {number}
     */
    numPages: number;

    /**
     * Current page for the pager.
     * @type {number}
     */
    currentPage: number;

    /**
     * Handler for when the page changes.
     * @type {function}
     */
    onPageChange: (page: number) => void;

    /**
     * If true, will display a warning that the server-side pagination limit has been reached.
     * @type {boolean}
     */
    paginationLimitReached?: boolean;
}

export default class Pager extends Component<PagerProps> {
    constructor(props: PagerProps) {
        super(props);

        this.handleNext = this.handleNext.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.handlePageBtn = this.handlePageBtn.bind(this);
    }

    public render(tsx: H) {
        const pageButtons = Array.apply(null, { length: this.props.numPages }).map((v: any, i: number) => {
            const isActive = this.props.currentPage === i + 1;
            const btnClasses = {
                "nav-pager__btn": true,
                "nav-pager__page-btn--active": isActive,
                "nav-pager__page-btn--inactive": !isActive
            };
            return (
                <button
                    classes={btnClasses}
                    id={`page-${i + 1}-button`}
                    title={`page-${i + 1}`}
                    onclick={this.handlePageBtn}
                    role="link"
                    tabindex="0"
                    key={`page-${i + 1}-button`}
                >
                    {`${i + 1}`}
                </button>
            );
        }).reduce((result: any[], current: any, i: number, arr: any[]) => {
            if (
                i === 0 ||
                i === this.props.numPages - 1 ||
                i === this.props.currentPage - 1 ||
                i === this.props.currentPage - 2 ||
                i === this.props.currentPage ||
                (i === 1 && this.props.currentPage === 4) ||
                (i === this.props.numPages - 2 && this.props.currentPage === this.props.numPages - 3) ||
                (i <= 4 && this.props.currentPage < 5)
            ) {
                result.push(current);
            } else if (
                i === this.props.currentPage - 3 ||
                i === this.props.currentPage + 1 ||
                i === 5 && this.props.currentPage < 5
            ) {
                result.push(<span class="nav-pager__dots" key={`dots-${i}`}>{`...`}</span>);
            }
            return result;
        }, []);

        const prevButtonClasses = {
            "nav-pager__btn": true,
            "nav-pager__btn--disabled": this.props.currentPage <= 1
        };

        const nextButtonClasses = {
            "nav-pager__btn": true,
            "nav-pager__btn--disabled": this.props.currentPage >= this.props.numPages
        };

        return (
            <nav class="nav-pager__container" key="pager">
                {
                    this.props.currentPage === this.props.numPages && this.props.paginationLimitReached ? (
                        <div class="nav-pager__limit-container" key="pagination-limit-container">
                            <div class="nav-pager__limit-inner">
                                <p class="nav-pager__limit-text">
                                    {componentI18n.paginationLimit}
                                </p>
                            </div>
                        </div>
                    ) : null
                }
                <button
                    classes={prevButtonClasses}
                    id="previous"
                    title={componentI18n.previous}
                    role="link"
                    key="previous-btn"
                    onclick={this.handlePrevious}
                    tabindex={this.props.currentPage <= 1 ? `-1` : `0`}
                >
                    {componentI18n.previous}
                </button>
                    <div class="nav-pager__page-btn-container">
                        {pageButtons}
                    </div>
                <button
                    classes={nextButtonClasses}
                    id="next"
                    title={componentI18n.next}
                    role="link"
                    key="next-btn"
                    onclick={this.handleNext}
                    tabindex={this.props.currentPage >= this.props.numPages ? `-1` : `0`}
                >
                    {componentI18n.next}
                </button>
            </nav>
        );
    }

    private handleNext() {
        this.props.onPageChange(this.props.currentPage + 1);
    }

    private handlePrevious() {
        this.props.onPageChange(this.props.currentPage - 1);
    }

    private handlePageBtn(e: any) {
        this.props.onPageChange(parseInt(e.target.textContent, 10));
    }
}