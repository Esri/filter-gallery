import componentI18n = require("dojo/i18n!../../nls/resources");

import Badge from "./Badge";
import { H, SFCProps, Pojo } from "../../Component";

export interface PremiumProps extends SFCProps {
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
     * The current user.
     * @type {object}
     */
    user: Pojo | undefined;
}

/**
 * A content status badge for premium content.
 */
export default ({ size, tooltip, tooltipDirection, user }: PremiumProps, tsx: H) => {
    const tooltipType = user ?
        user.orgId ? "Org" : "Public" :
        "Anon";
    return (
        <Badge
            backgroundColor="#DBEDFA"
            textColor="#196FA6"
            key="premium-badge"
            size={size}
            text={componentI18n.badges.premium}
            title={componentI18n.badges.tooltips[`premium${tooltipType}`]}
            tooltip={tooltip ? componentI18n.badges.tooltips[`premium${tooltipType}`] : undefined}
            tooltipDirection={tooltipDirection}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="none" d="M0 0h16v16H0z"/>
                <path fill="none" d="M0 0h16v16H0z"/>
                <path d="M8.05 15.5a.497.497 0 0 1-.25-.067C.6 11.275 1.542 2.038 1.552 1.944a.5.5 0 0 1 .259-.382.507.507 0 0 1 .463-.009 5.15 5.15 0 0 0 5.459-.94.5.5 0 0 1 .64.006c1.817 1.54 3.601 1.844 5.457.932a.5.5 0 0 1 .718.394 16.944 16.944 0 0 1-.344 4.965.5.5 0 1 1-.978-.211 16.952 16.952 0 0 0 .367-3.962 5.57 5.57 0 0 1-5.55-1.098A6.178 6.178 0 0 1 2.51 2.706c-.057 2.086.231 8.651 5.79 11.86a.5.5 0 0 1-.25.934z" fill="#196fa6"/>
                <path d="M12 15.5a4 4 0 1 1 4-4 4.005 4.005 0 0 1-4 4zm0-7a3 3 0 1 0 3 3 3.003 3.003 0 0 0-3-3z" fill="#196fa6"/>
            </svg>
        </Badge>
    );
};
