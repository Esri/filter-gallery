import i18n = require("dojo/i18n!../../nls/resources");
import { Component, H, Pojo } from "../../Component";
import dojoDate = require("dojo/date/locale");

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
import IconButton from '../Buttons/IconButton';

export interface ListCardProps {
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
export default class AnalysisCard extends Component<ListCardProps> {
    constructor(props: ListCardProps) {
        super(props);

        this.state = {
            customActionsOpen: false
        };

        this.handleCustomActionClick = this.handleCustomActionClick.bind(this);
    }

    public render(tsx: H) {
        const { item, sortField } = this.props;
        const baseConfig = this.props.stateTree.settings.utils.base.config;
        const itemSummaryMaxChar = parseInt(baseConfig.itemSummaryMaxChar, 10);

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
            .map((action, index) => action.href ? (
                <a
                    key={action.name}
                    id={action.id ? `${action.id}-${item.id}` : undefined}
                    class="card-lc__side-action"
                    onclick={undefined}
                    title={action.name}
                    value={index}
                    href={action.href ? action.href(this.props.item, this.props.stateTree) : undefined}
                    target={action.target ? action.target : undefined}
                >
                    <span class="card-lc__custom-action-text" value={index}>{action.name}</span>
                    <div class="card-lc__custom-icon-container" innerHTML={action.icon} value={index} />
                </a>
            ) : (
                    <button
                        key={action.name}
                        id={action.id ? `${action.id}-${item.id}` : undefined}
                        class="card-lc__side-action-btn card-lc__side-action"
                        onclick={this.handleCustomActionClick}
                        title={action.name}
                        value={index}
                    >
                        <span class="card-lc__custom-action-text" value={index}>{action.name}</span>
                        <div class="card-lc__custom-icon-container" innerHTML={action.icon} value={index} />
                    </button>
                ));

        const containerClasses = {
            "card-lc__container": true,
            "card-lc__container--loading": loading
        };

        const primaryAction = this.props.customActions[0] && this.props.customActions[0].href ?
            this.props.customActions[0] :
            undefined;
        const thumbnailClasses = {
            "card-lc__thumbnail": true,
            "card-lc__thumbnail--actionable": !!primaryAction
        };
        const thumbnail = (
            <img
                aria-label={primaryAction ? primaryAction.name : undefined}
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt=""
                classes={thumbnailClasses}
                style={`
                    background-image: url(${item.thumbURI});
                `}
            />
        );

        return (
            <div classes={containerClasses} key={this.props.key} id={this.props.item.id}>
                {loading ? <LoaderBars key="item-loading" /> : null}
                <div class="card-lc__details-container">
                    <div class="card-lc__thumb-container">
                    {
                            !!primaryAction && !!primaryAction.href ? ([
                                (
                                    <span class="card-lc__thumb-overlay">
                                        <span>{primaryAction.name}</span>
                                        <div class="card-lc__custom-icon-container" innerHTML={primaryAction.icon} />
                                    </span>
                                ),
                                (
                                    <a
                                        class="card-lc__thumb-link"
                                        href={primaryAction.href(this.props.item, this.props.stateTree)}
                                        target={primaryAction.target ? primaryAction.target : undefined}
                                    >
                                        {thumbnail}
                                    </a>
                                )
                            ]) : thumbnail
                        }
                    </div>
                    <div class="card-lc__details">
                        <h3 class="card-lc__title">{item.title}</h3>
                        <div class="card-lc__info-row">
                            <div class="card-lc__icon-title-container">
                            {baseConfig.showItemType ?
                                (<img
                                    src={item.iconURI}
                                    class="content-search-item-icon"
                                    title={item.displayName}
                                />)
                                : ``}
                                <span
                                    class="card-lc__author-text"
                                    key="itemAuthor"
                                >
                                    {baseConfig.showItemType ? `${item.displayName} ` : ``} 
                                    {baseConfig.showItemOwner ? `${i18n.itemCards.by}` : ``}
                                    {baseConfig.showItemOwner ? 
                                        (<a
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
                                        </a>)
                                        : ``}
                                </span>
                            </div>
                            {baseConfig.showItemInfo ?
                                ([
                                    (<span class="card-lc__info-bullet" key="showItemInfoBullet">•</span>),
                                    (<span class="card-lc__info-string" key="showItemInfo">{infoString}</span>)
                                ]) : ``}
                        </div>
                        <p class="card-lc__snippet">
                            {itemSummaryMaxChar < 250 && item.snippet && item.snippet.length > itemSummaryMaxChar ? 
                                (<span class="card-lc__snippet" key="itemSummary">
                                        {item.snippet.substring(0, itemSummaryMaxChar)} 
                                        {baseConfig.showItemToolTip ? 
                                            (<span class="card-lc__snippet-tooltip tooltip tooltip-multiline tooltip-left" tooltip={item.snippet.replace(/<\/?[^>]+(>|$)/g, "")}>...</span>) :
                                            (<span>...</span>) 
                                        }
                                </span>) :
                                (<span class="card-lc__snippet" key="itemSummary">
                                    {item.snippet}
                                </span>)
                            }{` `}
                            {baseConfig.showItemToolTip && item.snippet ?
                                (<IconButton
                                    key="grid-info-tooltip-btn"
                                    active={false}
                                    handleClick={e => e.preventDefault()}
                                >
                                    <div class="grid-info-tooltip-btn-body tooltip tooltip-multiline tooltip-left" tooltip={item.snippet.replace(/<\/?[^>]+(>|$)/g, "")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path d="M7.5 0A7.5 7.5 0 1 0 15 7.5 7.509 7.509 0 0 0 7.5 0zm.001 14.1A6.6 6.6 0 1 1 14.1 7.5a6.608 6.608 0 0 1-6.599 6.6zM7.5 5.5a1 1 0 1 1 1-1 1.002 1.002 0 0 1-1 1zM7 7h1v5H7zm2 5H6v-1h3z"/>
                                    </svg>
                                        <span class="grid-info-tooltip-btn-label">
                                            {item.snippet}
                                        </span>
                                    </div>
                                </IconButton>)
                                    : `` }
                            {baseConfig.showItemDetails ? 
                                (<a
                                    class="card-lc__side-action card-lc__no-wrap"
                                    href={`${this.props.portal.baseUrl}/home/item.html?id=${item.id}`}
                                    target="_blank"
                                >
                                    {i18n.itemCards.viewItem}
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                        <path d="M10 1v1h3.293l-6.646 6.646 0.707 0.707 6.646-6.646v3.293h1v-5z"></path>
                                        <path d="M14 8v6h-12v-12h6v-1h-7v14h14v-7z"></path>
                                    </svg>

                                </a>)
                                : ``}
                        </p>
                    </div>
                </div>
                <div class="card-lc__sub-container">
                    <div class="card-lc__badge-container card-lc__badge-container--regular card-lc__sub-group">
                        {this.renderBadges(tsx)}
                    </div>
                    <div class="card-lc__badge-container card-lc__badge-container--small card-lc__sub-group">
                        {this.renderBadges(tsx, true)}
                    </div>
                    <div class="card-lc__action-container card-lc__sub-group">
                        <div class="card-lc__no-wrap card-lc__custom-actions">
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