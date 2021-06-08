import i18n = require("dojo/i18n!../../../nls/resources");

import { Component, H } from "../../../Component";
import IconButton from "../../Buttons/IconButton";
import Toggle from "../../Buttons/Toggle";
import Ago2018Dropdown from "../Ago2018Dropdown";
import MobileWrap from "../../Modals/MobileWrap";
import GridIcon from "./GridIcon";
import ListIcon from "./ListIcon";
import TableIcon from "./TableIcon";

/**
 * AGOL available content views.
 */
export type ContentView = "list" | "grid" | "table";

export interface ViewDropdownProps {
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
     * Currently selected content view
     * @type {string}
     */
    view: ContentView;

    /**
     * Array of available fields to sort by.
     * @type {array}
     */
    availableViews: ContentView[];

    /**
     * Optional handler for when a content view is selected.
     * @type {function}
     */
    onViewChange?: (view: ContentView) => void;

    /**
     * Optional handler for when the dropdown is clicked.
     * @type {function}
     */
    onClick?: () => void;
}

/**
 * A UI component for selecting a content view from a list of supported options.
 */
export default class ViewDropdown extends Component<ViewDropdownProps> {
    constructor(props: ViewDropdownProps) {
        super(props);

        this.handleViewClick = this.handleViewClick.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleMobileWrapClose = this.handleMobileWrapClose.bind(this);
    }

    public render(tsx: H) {
        const menuContent = (
            <div class="drp-sort__menu-section" role="tree">
                <h3 class="drp-sort__menu-title">{i18n.dropdowns.contentViews.view}</h3>
                {
                    this.props.availableViews.map((view) => (
                        <Toggle
                            key={view}
                            name={i18n.dropdowns.contentViews[view]}
                            value={view}
                            onToggleClick={this.handleViewChange}
                            selectedToggle={this.props.view}
                        >
                            <span class="drp-view__option" key="text">
                                {
                                    view === "grid" ?
                                        <GridIcon /> :
                                        view === "list" ?
                                            <ListIcon /> :
                                            <TableIcon />
                                }
                                <span class="drp-view__option-text" key="text">
                                    {i18n.dropdowns.contentViews[view]}
                                </span>
                            </span>
                        </Toggle>
                    ))
                }
            </div>
        );

        if (window.matchMedia("(max-width: 860px)").matches) {
            return [(
                <IconButton key="gb-sort-btn-mobile" active={this.props.active} handleClick={this.handleViewClick}>
                    <div class="drp-sort__btn-body">
                        {
                            this.props.view === "grid" ?
                                <GridIcon /> :
                                this.props.view === "list" ?
                                    <ListIcon /> :
                                    <TableIcon />
                        }
                        <span class="drp-sort__btn-label">{i18n.dropdowns.contentViews[this.props.view]}</span>
                    </div>
                </IconButton>
            ), (
                <MobileWrap
                    key="sort-mobile-wrap"
                    title={i18n.dropdowns.contentViews.view}
                    open={this.props.active}
                    onClose={this.handleMobileWrapClose}
                >
                    <div class="drp-sort__menu-section" role="tree">
                        {
                            this.props.availableViews.map((view) => (
                                <Toggle
                                    key={view}
                                    name={i18n.dropdowns.contentViews[view]}
                                    value={view}
                                    onToggleClick={this.handleViewChange}
                                    selectedToggle={this.props.view}
                                >
                                    <span class="drp-view__option" key="text">
                                        {
                                            view === "grid" ?
                                                <GridIcon /> :
                                                view === "list" ?
                                                    <ListIcon /> :
                                                    <TableIcon />
                                        }
                                        <span class="drp-view__option-text" key="text">
                                            {i18n.dropdowns.contentViews[view]}
                                        </span>
                                    </span>
                                </Toggle>
                            ))
                        }
                    </div>
                </MobileWrap>
            )
            ];
        }
        return (
            <Ago2018Dropdown key="view-dropdown" active={this.props.active} onToggle={this.handleViewClick}>
                <IconButton key="gb-sort-btn" active={this.props.active} handleClick={this.stub} tabindex={-1}>
                    <div class="drp-sort__btn-body">
                        {
                            this.props.view === "grid" ?
                                <GridIcon /> :
                                this.props.view === "list" ?
                                    <ListIcon /> :
                                    <TableIcon />
                        }
                        <span class="drp-sort__btn-label">{i18n.dropdowns.contentViews[this.props.view]}</span>
                    </div>
                </IconButton>
                <div class="drp-sort__menu-container">
                    {menuContent}
                </div>
            </Ago2018Dropdown>
        );
    }

    private stub() { }

    private handleViewClick() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    private handleViewChange(view: ContentView) {
        if (view !== this.props.view) {
            if (this.props.onViewChange) {
                this.props.onViewChange(view);
            }
        }
    }

    private handleMobileWrapClose() {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }
}