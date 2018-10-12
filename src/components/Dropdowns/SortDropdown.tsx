import * as i18n from "dojo/i18n!../../nls/resources"

import { Component, H } from "../../Component";
import IconButton from "../Buttons/IconButton";
import Toggle from "../Buttons/Toggle";
import Ago2018Dropdown from "./Ago2018Dropdown";
import MobileWrap from "../Modals/MobileWrap";

/**
 * Sort fields available from the AGOL search APIs.
 */
export type SortField = "relevance" | "title" | "created" | "type" | "owner" | "modified" | "avgrating" | "numcomments" | "numviews";

/**
 * Sort orders available from the AGOL search APIs.
 */
export type SortOrder = "asc" | "desc";

export interface SortDropdownProps {
    /**
     * Controls whether or not the `SortDropdown` is open.
     * @type {boolean}
     */
    active: boolean;

    /**
     * Unique key for the `SortDropdown` component.
     * @type {string}
     */
    key: string;

    /**
     * Currently selected sort field.
     * @type {string}
     */
    field: SortField;

    /**
     * Currently selected sort order.
     * @type {string}
     */
    order: SortOrder;

    /**
     * Array of available fields to sort by.
     * @type {string}
     */
    availableFields: SortField[];

    /**
     * Optional handler for when a sort field is selected.
     * @type {function}
     */
    onFieldChange?: (field: SortField) => void;

    /**
     * Optional handler for when a sort order is selected.
     * @type {function}
     */
    onOrderChange?: (order: SortOrder) => void;

    /**
     * Optional handler for when the dropdown is clicked.
     * @type {function}
     */
    onClick?: () => void;
}

/**
 * A UI component for selecting a sort field and order from a list of supported options.
 */
export default class SortDropdown extends Component<SortDropdownProps> {
    constructor(props: SortDropdownProps) {
        super(props);

        this.handleSortClick = this.handleSortClick.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleOrderChange = this.handleOrderChange.bind(this);
        this.handleMobileWrapClose = this.handleMobileWrapClose.bind(this);
    }

    public render(tsx: H) {
        const menuContent = [(
            <div class="drp-sort__menu-section" role="tree">
                <h3 class="drp-sort__menu-title">{i18n.sortBy}</h3>
                {
                    this.props.availableFields.map((field) => (
                        <Toggle
                            key={field}
                            name={i18n[field]}
                            value={field}
                            onToggleClick={this.handleFieldChange}
                            selectedToggle={this.props.field}
                        />
                    ))
                }
            </div>
        ), (
            <br />
        ), (
            <div class="drp-sort__menu-section" role="tree">
                <h3 class="drp-sort__menu-title">{i18n.sortDir}</h3>
                <Toggle
                    key="ascending-toggle"
                    name={i18n.ascending[this.props.field]}
                    value="asc"
                    onToggleClick={this.handleOrderChange}
                    selectedToggle={this.props.order}
                />
                <Toggle
                    key="descending-toggle"
                    name={i18n.descending[this.props.field]}
                    value="desc"
                    onToggleClick={this.handleOrderChange}
                    selectedToggle={this.props.order}
                />
            </div>
        )];

        if (window.matchMedia("(max-width: 860px)").matches) {
            return [(
                <IconButton key="gb-sort-btn-mobile" active={this.props.active} handleClick={this.handleSortClick}>
                    <div class="drp-sort__btn-body">
                        <svg width="16px" height="16px" viewBox="0 0 16 16">
                            <g stroke="none" stroke-width="1">
                                <g id="sort-1px-16">
                                    <path
                                        d="M1,1 L15,1 L15,2 L1,2 L1,1 Z M4,5 L15,5 L15,6 L4,6 L4,5 Z M7,9 L15,9 L15,10 L7,10 L7,9 Z M11,13 L15,13 L15,14 L11,14 L11,13 Z"
                                    />
                                </g>
                            </g>
                        </svg>
                        <span class="drp-sort__btn-label">{i18n[this.props.field]}</span>
                    </div>
                </IconButton>
            ), (
                <MobileWrap
                    key="sort-mobile-wrap"
                    title={i18n.sort}
                    open={this.props.active}
                    onClose={this.handleMobileWrapClose}
                >
                    {menuContent}
                </MobileWrap>
            )
            ];
        }
        return (
            <Ago2018Dropdown key="sort-dropdown" active={this.props.active} onToggle={this.handleSortClick}>
                <IconButton key="gb-sort-btn" active={this.props.active} handleClick={this.stub} tabindex={-1}>
                    <div class="drp-sort__btn-body">
                        <svg width="16px" height="16px" viewBox="0 0 16 16">
                            <g stroke="none" stroke-width="1">
                                <g id="sort-1px-16">
                                    <path
                                        d="M1,1 L15,1 L15,2 L1,2 L1,1 Z M4,5 L15,5 L15,6 L4,6 L4,5 Z M7,9 L15,9 L15,10 L7,10 L7,9 Z M11,13 L15,13 L15,14 L11,14 L11,13 Z"
                                    />
                                </g>
                            </g>
                        </svg>
                        <span class="drp-sort__btn-label">{i18n[this.props.field]}</span>
                    </div>
                </IconButton>
                <div class="drp-sort__menu-container">
                    {menuContent}
                </div>
            </Ago2018Dropdown>
        );
    }

    private stub() { }

    private handleSortClick() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    private handleFieldChange(field: SortField) {
        if (field !== this.props.field) {
            if (this.props.onFieldChange) {
                this.props.onFieldChange(field);
            }
        }
    }

    private handleOrderChange(order: SortOrder) {
        if (order !== this.props.order) {
            if (this.props.onOrderChange) {
                this.props.onOrderChange(order);
            }
        }
    }

    private handleMobileWrapClose() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
}