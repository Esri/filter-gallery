import * as i18n from "dojo/i18n!../../nls/resources";
import { Component, H, Pojo } from "../../Component";
import * as dojoDate from "dojo/date/locale";

import AuthoritativeBadge from "../Badges/Authoritative";
import DeprecatedBadge from "../Badges/Deprecated";
import LivingAtlasBadge from "../Badges/LivingAtlas";
import PremiumBadge from "../Badges/Premium";
import SubscriberBadge from "../Badges/Subscriber";
import { CustomAction } from "../../_reducer/settings/config";
import { scrubItemInfo } from "../../_utils";
import { FilterGalleryStore } from "../..";
import { FilterGalleryState } from "../../_reducer";
import LoaderBars from "../Loaders/LoaderBars";

export interface AnalysisCardProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * The item for the card.
     * @type {object}
     */
    item: Pojo;

    /**
     * The current user's portal.
     * @type {object}
     */
    portal: Pojo;

    /**
     * The current sort field.
     * @type {string}
     */
    sortField: string;

    /**
     * Optional organization owning the item.
     * @type {object}
     */
    organization?: Pojo;

    /**
     * Optional array of custom actions for the item.
     * @type {array}
     */
    customActions: CustomAction[];

    /**
     * Dispatch function for custom actions.
     * @type {function}
     */
    dispatch: FilterGalleryStore["dispatch"];

    /**
     * State tree for custom actions.
     * @type {object}
     */
    stateTree: FilterGalleryState;
}

/**
 * An item card specifically catered to Analysis workflows.
 */
export default class AnalysisCard extends Component<AnalysisCardProps> {
    constructor(props: AnalysisCardProps) {
        super(props);

        this.state = {
            customActionsOpen: false
        };

        this.handleCustomActionClick = this.handleCustomActionClick.bind(this);
    }

    public render(tsx: H) {
        const { item, sortField } = this.props;

        let infoString: string;
        if (sortField === "numviews") {
            infoString = `${i18n.itemCards.viewCount}: ${item.numViews}`;
        } else if (sortField === "avgrating") {
            infoString = `${i18n.itemCards.rating}: ${item.avgRating.toFixed(2)}`;
        } else if (sortField === "created") {
            infoString = `${i18n.itemCards.created}: ${
                dojoDate.format(new Date(item.created), { selector: "date", formatLength: "short" })
            }`;
        } else {
            infoString = `${i18n.itemCards.updated}: ${
                dojoDate.format(new Date(item.modified), { selector: "date", formatLength: "short" })
            }`;
        }

        const loading = !!this.props.stateTree.results.loadingItems[this.props.item.id];

        const actions = this.props.customActions
            .map((action, index) => (
                <a
                    key={action.name}
                    class="card-ac__side-action"
                    onclick={this.handleCustomActionClick}
                    title={action.name}
                    value={index}
                >
                    <span class="card-lc__custom-action-text" value={index}>{action.name}</span>
                    <div class="card-lc__custom-icon-container" innerHTML={action.icon} value={index} />
                </a>
            ));

        const containerClasses = {
            "card-ac__container": true,
            "card-ac__container--loading": loading
        };

        return (
            <div classes={containerClasses} key={this.props.key}>
                {loading ? <LoaderBars key="item-loading" /> : null}
                <div class="card-ac__details-container">
                    <div class="card-ac__thumb-container">
                        <img
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                            alt=""
                            class="card-ac__thumbnail"
                            style={`
                                background-image: url(${item.thumbURI});
                            `}
                        />
                    </div>
                    <div class="card-ac__details">
                        <h3 class="card-ac__title">{item.title}</h3>
                        <div class="card-ac__info-row">
                            <div class="card-ac__icon-title-container">
                                <img
                                    src={item.iconURI}
                                    class="content-search-item-icon"
                                    title={item.displayName}
                                />
                                <span
                                    class="card-ac__author-text"
                                >
                                    {`${item.displayName} ${i18n.itemCards.by}`}
                                    <a
                                        class="content-search-selectable card-mc__author-link"
                                        title={this.props.organization ? i18n.itemCards.viewOrg : i18n.itemCards.viewProfile}
                                        href={
                                            this.props.organization ?
                                                this.props.organization.orgUrl :
                                                `${this.props.portal.baseUrl}/home/user.html?user=${item.owner}`
                                        }
                                        target="_blank"
                                    >
                                        {` ${this.props.organization ? this.props.organization.name : item.owner}`}
                                    </a>
                                </span>
                            </div>
                            <span class="card-ac__info-bullet">•</span>
                            <span class="card-ac__info-string">{infoString}</span>
                        </div>
                        <p class="card-ac__snippet">
                            <span class="card-ac__snippet-text">{item.snippet}{` `}</span>
                            <a
                                class="card-ac__side-action card-ac__no-wrap"
                                href={`${this.props.portal.baseUrl}/home/item.html?id=${item.id}`}
                                target="_blank"
                            >
                                {i18n.itemCards.viewItem}
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                    <path d="M10 1v1h3.293l-6.646 6.646 0.707 0.707 6.646-6.646v3.293h1v-5z"></path>
                                    <path d="M14 8v6h-12v-12h6v-1h-7v14h14v-7z"></path>
                                </svg>

                            </a>
                        </p>
                    </div>
                </div>
                <div class="card-ac__sub-container">
                    <div class="card-ac__badge-container card-ac__badge-container--regular card-ac__sub-group">
                        {this.renderBadges(tsx)}
                    </div>
                    <div class="card-ac__badge-container card-ac__badge-container--small card-ac__sub-group">
                        {this.renderBadges(tsx, true)}
                    </div>
                    <div class="card-ac__action-container card-ac__sub-group">
                        <div class="card-ac__no-wrap card-lc__custom-actions">
                            {actions}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderBadges(tsx: H, small?: boolean) {
        const size = small ? "small" : "regular";

        return this.props.item.badges.map((badgeType: string) => {
            switch (badgeType) {
                case "authoritative":
                    return (
                        <AuthoritativeBadge
                            size={size}
                            altOrg={this.props.organization ? this.props.organization.name : undefined}
                        />
                    );
                case "deprecated":
                    return <DeprecatedBadge size={size} />;
                case "livingAtlas":
                    return <LivingAtlasBadge size={size} />;
                case "premium":
                    return <PremiumBadge size={size} user={this.props.portal.user} />;
                case "subscriber":
                    return <SubscriberBadge size={size} user={this.props.portal.user} />;
                default: //
            }
            return null;
        });
    }

    private handleCustomActionClick(e: any) {
        if (this.props.customActions[e.target.value]) {
            this.props.customActions[e.target.value].onAction(
                scrubItemInfo(this.props.item),
                this.props.stateTree,
                this.props.dispatch
            );
        }
    }
}