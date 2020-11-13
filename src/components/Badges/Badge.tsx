import { H, SFCProps } from "../../Component";

export interface BadgeProps extends SFCProps {
    /**
     * Optional key for the badge.
     * @type {string}
     */
    key?: string;
    /**
     * The size of the badge: "regular" includes the badge text, "small" only includes the icon.
     * @type {string}
     */
    size?: "regular" | "small";
    /**
     * Optional text to show on the badge.
     * @type {string}
     */
    text?: string;
    /**
     * Optional calcite tooltip to show on the badge. 
     * @type {string}
     */
    tooltip?: string;
    /**
     * The direction to show the calcite tooltip in. Default is "bottom".
     * @type {string}
     */
    tooltipDirection?: "left" | "top" | "right" | "bottom";
    /**
     * The title of the badge. This is mandatory for accessibility purposes.
     * @type {string}
     */
    title: string;
    /**
     * The background-color for the badge.
     * @type {string}
     */
    backgroundColor: string;
    /**
     * The text color for the badge.
     * @type {string}
     */
    textColor: string;
}

/**
 * A simple non-actionable badge.
 */
export default (
    {
        key,
        size,
        text,
        title,
        tooltip,
        tooltipDirection,
        backgroundColor,
        textColor,
        children
    }: BadgeProps,
    tsx: H
) => {

    const badgeClasses = {
        "qual-badge__container": true,
        "qual-badge__container--small": size === "small",
        "qual-badge__container--tooltip": !!tooltip,
        "qual-badge__container--tooltip-left": tooltipDirection === "left",
        "qual-badge__container--tooltip-top": tooltipDirection === "top",
        "qual-badge__container--tooltip-right": tooltipDirection === "right",
        "tooltip-bottom": !tooltipDirection || tooltipDirection === "bottom",
        "tooltip-left": tooltipDirection === "left",
        "tooltip-top": tooltipDirection === "top",
        "tooltip-right": tooltipDirection === "right"
    };

    if (size === "small") {
        return (
            <span
                key={`${key}-small`}
                classes={badgeClasses}
                class="qual-badge__container--small"
                aria-label={tooltip}
                style={`background-color: ${backgroundColor}; color: ${textColor};`}
                title={tooltip ? undefined : title}
            >
                {children}
            </span>
        );
    }

    return (
        <span
            key={`${key}-regular`}
            classes={badgeClasses}
            class="qual-badge__container--regular"
            aria-label={tooltip}
            style={`background-color: ${backgroundColor}; color: ${textColor};`}
            title={title}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
            >
                {children}
            </svg>
            <span class="qual-badge__text">{text}</span>
        </span>
    );
};
