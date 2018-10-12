import * as componentI18n from "dojo/i18n!../../nls/resources";

import Badge from "./Badge";
import { H, SFCProps } from "../../Component";

export interface DeprecatedProps extends SFCProps {
    /**
     * The size of the badge: "regular" includes the badge name, "small" only includes the icon.
     * @type {string}
     */
    size?: "regular" | "small";
    /**
     * Controls whether or not to show a calcite style tooltip for the badge.
     * Default: false
     * @type {boolean}
     */
    tooltip?: boolean;
    /**
     * The direction to show the calcite tooltip.
     * Default: "bottom"
     * @type {string}
     */
    tooltipDirection?: "left" | "top" | "right" | "bottom";
}

/**
 * A content status badge for deprecated content.
 */
export default ({ size, tooltip, tooltipDirection }: DeprecatedProps, tsx: H) => (
    <Badge
        backgroundColor="#F3DED7"
        textColor="#8C2907"
        key="deprecated-badge"
        size={size}
        text={componentI18n.deprecated}
        title={componentI18n.tooltips.deprecated}
        tooltip={tooltip ? componentI18n.tooltips.deprecated : undefined}
        tooltipDirection={tooltipDirection}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <path fill="none" d="M0 0h16v16H0z"/>
            <path
                fill="#8C2907"
                d="M8 0a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8zM1 8a6.99 6.99 0 0 1 11.577-5.284l-9.861 9.861A6.964 6.964 0 0 1 1 8zm7 7a6.964 6.964 0 0 1-4.577-1.716l9.861-9.861A6.99 6.99 0 0 1 8 15z"
            />
        </svg>
    </Badge>
);
