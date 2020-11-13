import * as componentI18n from "dojo/i18n!../../nls/resources";

import Badge from "./Badge";
import { H, SFCProps } from "../../Component";

export interface LivingAtlasProps extends SFCProps {
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
 * A content status badge for living atlas content.
 */
export default ({ size, tooltip, tooltipDirection }: LivingAtlasProps, tsx: H) => (
    <Badge
        backgroundColor="#DBEDFA"
        textColor="#196FA6"
        key="living-atlas-badge"
        size={size}
        text={componentI18n.badges.livingAtlas}
        title={componentI18n.badges.tooltips.livingAtlas}
        tooltip={tooltip ? componentI18n.badges.tooltips.livingAtlas : undefined}
        tooltipDirection={tooltipDirection}
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
            <rect width="16" height="16" fill="none"/>
            <rect width="16" height="16" fill="none"/>
            <g>
                <path d="M14.75342,4.57031a.50021.50021,0,0,0-.84277-.53906,5.85956,5.85956,0,0,1-1.04541,1.12939A27.86114,27.86114,0,0,1,8.5,8.19922a27.48671,27.48671,0,0,1-4.81445,2.26172,5.9062,5.9062,0,0,1-1.50049.34033.5.5,0,0,0,.022.99951L2.23,11.80029a6.51338,6.51338,0,0,0,1.46027-.30341A5.97993,5.97993,0,0,0,7.5,13.30646V15H5a.5.5,0,0,0,0,1h6a.5.5,0,0,0,0-1H8.5V13.301a5.95318,5.95318,0,0,0,5.25336-7.601A6.38549,6.38549,0,0,0,14.75342,4.57031ZM10.5,11.66357A4.99888,4.99888,0,0,1,4.75793,11.129,30.77175,30.77175,0,0,0,9,9.06543a30.80143,30.80143,0,0,0,3.9082-2.642A5.00026,5.00026,0,0,1,10.5,11.66357Z" fill="#196fa6"/>
                <path d="M7.06836,2.41943a5.00709,5.00709,0,0,1,4.71045,1.63867.50023.50023,0,1,0,.75684-.6543A6.01019,6.01019,0,0,0,6.88184,1.437a.5.5,0,0,0,.18652.98242Z" fill="#196fa6"/>
                <path d="M2.80176,9.63281a.50023.50023,0,0,0,.47217-.66406A4.98907,4.98907,0,0,1,5.08917,3.29163l.22772.39441a.50008.50008,0,0,0,.86621-.5l-1-1.73193a.50008.50008,0,0,0-.86621.5l.27222.47144A5.988,5.988,0,0,0,2.32959,9.29688.49991.49991,0,0,0,2.80176,9.63281Z" fill="#196fa6"/>
            </g>
        </svg>
    </Badge>
);
