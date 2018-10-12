import * as i18n from "dojo/i18n!../../nls/resources";

import Badge from "./Badge";
import { H } from "../../Component";

export interface AuthoritativeProps {
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
    /**
     * The owning organization for the content (if different from the user's organization).
     * @type {string}
     */
    altOrg?: string;
}

/**
 * A content status badge for authoritative content.
 */
export default ({ size, tooltip, tooltipDirection, altOrg }: AuthoritativeProps, tsx: H) => (
    <Badge
        backgroundColor="#DDEEDB"
        textColor="#2B622B"
        key="authoritative-badge"
        size={size}
        text={i18n.authoritative}
        title={altOrg ? `${i18n.tooltips.altAuthoritative} ${altOrg}` : i18n.tooltips.authoritative}
        tooltip={tooltip ? i18n.tooltips.authoritative : undefined}
        tooltipDirection={tooltipDirection}
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
        >
            <path fill="none" d="M0 0h16v16H0z"/>
            <g fill="#2B622B">
            <path d="M8 0a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8zm0 15a7 7 0 1 1 7-7 7.008 7.008 0 0 1-7 7z"/>
            <path d="M11.834 5.146l-5.646 5.647-2.334-2.334a.5.5 0 0 0-.708.707l3.042 3.041 6.353-6.353a.5.5 0 1 0-.707-.707z"/>
            </g>
        </svg>
    </Badge>
);
