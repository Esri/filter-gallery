import componentI18n = require("dojo/i18n!../../nls/resources");

import { Component, H, ComponentProps } from "../../Component";
import { onEnter } from "../../_utils";

export interface AccordionDropdownProps extends ComponentProps {
    /**
     * A unique key for the `AccordionDropdown` component.
     * @type {string}
     */
    key: string;

    /**
     * The title for the dropdown.
     * @type {string}
     */
    title: string;

    /**
     * Controls whether or not the `AccordionDropdown` displays a "clear" button.
     * @type {boolean}
     */
    clearable: boolean;

    /**
     * Handler for when the `AccordionDropdown` is cleared.
     * @type {function}
     */
    onClear: () => void;

    /**
     * If false, will remove the padding from the `AccordionDropdown`.
     * @type {boolean}
     */
    padding?: boolean;

    /**
     * If true, will initialize the `AccordionDropdown` in the "open" state.
     * @type {boolean}
     */
    startActive?: boolean;
}

export interface AccordionDropdownState {
    active: boolean;
    startActive: boolean;
}

/**
 * An accordion style dropdown.
 */
export default class AccordionDropdown extends Component<AccordionDropdownProps, AccordionDropdownState> {
    handleDropdownKeyDown = onEnter(this.handleDropdownClick.bind(this));

    constructor(props: AccordionDropdownProps) {
        super(props);

        this.state = {
            active: props.startActive ? props.startActive : false,
            startActive: props.startActive ? props.startActive : false
        };

        this.handleDropdownClick = this.handleDropdownClick.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    public render(tsx: H) {
        // Check if startActive changed for drafts
        if (this.state.startActive !== this.props.startActive) {
            this.state = {
                active: this.props.startActive ? this.props.startActive : false,
                startActive: this.props.startActive ? this.props.startActive : false
            }
        }

        const accordionClasses = {
            "drp-accordion__section": true
        };

        const contentClasses = {
            "drp-accordion__content": true,
            "drp-accordion__content--no-padding": this.props.padding === false
        };

        const iconClasses = {
            "drp-accordion__icon": true,
            "drp-accordion__icon--active": this.state.active
        };

        let clearButton = null;
        if (this.props.clearable) {
            clearButton = (
                <button
                    class="drp-accordion__clear-btn"
                    onclick={this.handleClear}
                >
                    {componentI18n.dropdowns.clear}
                </button>
            );
        }

        return (
            <div
                key={this.props.key}
                classes={accordionClasses}
                role="tablist"
            >
                <h4
                    id={this.props.key}
                    class="drp-accordion__title"
                    value="itemType"
                    onclick={this.handleDropdownClick}
                    onkeydown={this.handleDropdownKeyDown}
                    role="tab"
                    tabindex="0"
                    aria-expanded={`${this.state.active}`}
                    aria-controls={`${this.props.key}-tree`}
                >
                    <span classes={iconClasses}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 32 32"
                        >
                            <path
                                d="M28 9v5L16 26 4 14V9l12 12L28 9z"
                            />
                        </svg>
                    </span>
                    <span>
                        {this.props.title}
                    </span>
                    {clearButton}
                </h4>
                {this.state.active ? (
                    <div classes={contentClasses}>
                        {this.props.children}
                    </div>
                ) : null}
            </div>
        );
    }

    private handleDropdownClick() {
        this.setState({ active: !this.state.active });
    }

    private handleClear(e: Event) {
        e.stopPropagation();
        this.props.onClear();
    }
}
