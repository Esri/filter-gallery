import { Component, H, ComponentProps } from "../../Component";

export interface IconButtonProps extends ComponentProps {
    /**
     * Unique key for this button.
     * @type {string}
     */
    key: string;
    
    /**
     * Boolean value indicating whether or not this button is active.
     * @type {boolean}
     */
    active: boolean;

    /**
     * Optional label for the button.
     * @type {string}
     */
    label?: string;

    /**
     * Direction to show the tooltip.
     * @type {string}
     */
    labelDirection?: "left" | "right" | "top";

    /**
     * Title for the button.
     * @type {string}
     */
    title?: string;

    /**
     * Tabindex for the button.
     * @type {number}
     */
    tabindex?: number;

    /**
     * Click handler for the button.
     * @type {function}
     */
    handleClick: (e: MouseEvent) => void;
}

/**
 * A common button component supporting icons for AGOL.
 */
export default class IconButton extends Component<IconButtonProps> {
    public render(tsx: H) {
        const { active, label, labelDirection, key, title } = this.props;

        const containerClasses = {
            "btn-icon__button": true,
            "btn-icon__button--tooltip": !!label,
            "btn-icon__button--tooltip-left": labelDirection === "left",
            "btn-icon__button--tooltip-right": labelDirection === "right",
            "btn-icon__button--tooltip-top": labelDirection === "top",
            "btn-icon__button--active": active
        };
    
        return (
            <button
                id={key}
                key={`${key}-container`}
                classes={containerClasses}
                aria-label={label}
                onmousedown={this.preventFocus}
                onclick={this.props.handleClick}
                tabindex={this.props.tabindex ? `${this.props.tabindex}` : `0`}
                aria-checked={active}
                title={title}
            >
                {this.props.children}
            </button>
        );
    }

    private preventFocus(e: MouseEvent) {
        e.preventDefault();
    }
}
