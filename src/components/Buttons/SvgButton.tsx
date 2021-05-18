import { Component, H, ComponentProps } from "../../Component";

export interface SvgButtonProps extends ComponentProps {
    /**
     * Unique key for this component.
     * @type {string}
     */
    key: string;

    /**
     * Controls whether or not this button is focusable.
     * @type {boolean}
     */
    focusable?: boolean;

    /**
     * Optional handler for when the button is clicked.
     * @type {function}
     */
    handleClick?: (e: MouseEvent) => void;

    /**
     * Optional tooltip label for the button.
     * @type {string}
     */
    label?: string;

    /**
     * Direction to show the tooltip for the button.
     * @type {string}
     */
    labelDirection?: "left" | "right" | "top";

    /**
     * Optional title for the button.
     * @type {string}
     */
    title?: string;

    /**
     * Optional value for the button.
     * @type {string}
     */
    value?: string;

    /**
     * Optional handler fired after the button is rendered to the DOM.
     * @type {function}
     */
    afterCreate?: (e: HTMLElement) => any;

    /**
     * Optional children to render within the button.
     * @type {array}
     */
    children?: any;
}

/**
 * A simple button component for use with inline SVGs.
 */
export default class SvgButton extends Component<SvgButtonProps> {
    constructor(props: SvgButtonProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    public render(tsx: H) {
        const {
            afterCreate,
            label,
            labelDirection,
            focusable,
            key,
            title,
            value,
        } = this.props;

        const containerClasses = {
            "btn-svg__button": true,
            "btn-svg__button--tooltip": !!label,
            "btn-svg__button--tooltip-left": labelDirection === "left",
            "btn-svg__button--tooltip-right": labelDirection === "right",
            "btn-svg__button--tooltip-top": labelDirection === "top"
        };
    
        return (
            <button
                afterCreate={afterCreate}
                key={key}
                id={key}
                classes={containerClasses}
                onmousedown={this.preventFocus}
                onclick={this.handleClick}
                aria-label={label}
                tabindex={focusable ? "0" : "-1"}
                title={title}
                value={value}
                data-event="track-component" 
                data-component-name="SVG button"
                data-component-link={title} 
                data-component-link-type="button"
            >
                {this.props.children}
            </button>
        );
    }

    private preventFocus(e: MouseEvent) {
        e.preventDefault();
    }

    private handleClick(e: MouseEvent) {
        if (this.props.handleClick && e.target) {
            e.target["value"] = this.props.value; // Preserve value even if event dispatched from wrong element
            this.props.handleClick(e);
        }
    }
}
