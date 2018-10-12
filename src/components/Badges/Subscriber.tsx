import * as componentI18n from "dojo/i18n!../../nls/resources";

import Badge from "./Badge";
import { H, SFCProps, Pojo } from "../../Component";

export interface SubscriberProps extends SFCProps {
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
 * A content status badge for subscriber content.
 */
export default ({ size, tooltip, tooltipDirection, user }: SubscriberProps, tsx: H) => {
    const tooltipType = user ?
        user.orgId ? "Org" : "Public" :
        "Anon";
    return (
        <Badge
            backgroundColor="#DBEDFA"
            textColor="#196FA6"
            key="subscriber-badge"
            size={size}
            text={componentI18n.subscriber}
            title={componentI18n.tooltips[`subscriber${tooltipType}`]}
            tooltip={tooltip ? componentI18n.tooltips[`subscriber${tooltipType}`] : undefined}
            tooltipDirection={tooltipDirection}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path
                    d="M8.05371,15.5H8.0498a.49939.49939,0,0,1-.25-.06689C.59961,11.27539,1.542,2.0376,1.55225,1.94434A.49966.49966,0,0,1,1.811,1.56152a.50721.50721,0,0,1,.46338-.0083A5.15007,5.15007,0,0,0,7.73291.61328a.51762.51762,0,0,1,.6377,0,5.14642,5.14642,0,0,0,5.4585.93994.50711.50711,0,0,1,.46338.0083.49966.49966,0,0,1,.25879.38281c.01025.09326.95264,9.33105-6.24756,13.48877A.49939.49939,0,0,1,8.05371,15.5Zm0-.5h0ZM2.50977,2.70557c-.05615,2.05469.22266,8.45508,5.542,11.71387,5.31934-3.25879,5.59814-9.65967,5.542-11.71387a6.17691,6.17691,0,0,1-5.542-1.07324A6.18289,6.18289,0,0,1,2.50977,2.70557Z"
                    fill="#196fa6"
                />
            </svg>
        </Badge>
    );
};
