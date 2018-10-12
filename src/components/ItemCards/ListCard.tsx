import * as i18n from "dojo/i18n!../nls/resources";
import { Component, H, Pojo } from "../../Component";
import * as dojoDate from "dojo/date/locale";

import AuthoritativeBadge from "../Badges/Authoritative";
import DeprecatedBadge from "../Badges/Deprecated";
import LivingAtlasBadge from "../Badges/LivingAtlas";
import PremiumBadge from "../Badges/Premium";
import SubscriberBadge from "../Badges/Subscriber";
import Ago2018Dropdown from "../Dropdowns/Ago2018Dropdown";
import { CustomAction } from "../../_reducer/settings/config";
import { scrubItemInfo } from "../../_utils";

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
     * The primary action for the card.
     * @type {function}
     */
    mainAction: ((selectedItems: Pojo[]) => any);

    /**
     * The title of the primary action.
     * @type {string}
     */
    mainActionTitle: string;

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
    customActions?: CustomAction[];
}

export interface AnalysisCardState {
    customActionsOpen: boolean;
}

/**
 * An item card specifically catered to Analysis workflows.
 */
export default class AnalysisCard extends Component<AnalysisCardProps, AnalysisCardState> {
    constructor(props: AnalysisCardProps) {
        super(props);

        this.state = {
            customActionsOpen: false
        };

        this.handleActionDropdownToggle = this.handleActionDropdownToggle.bind(this);
        this.handleCustomActionClick = this.handleCustomActionClick.bind(this);
        this.handleMainActionClick = this.handleMainActionClick.bind(this);
    }

    public render(tsx: H) {
        const { item, sortField } = this.props;

        let infoString: string;
        if (sortField === "numviews") {
            infoString = `${i18n.viewCount}: ${item.numViews}`;
        } else if (sortField === "avgrating") {
            infoString = `${i18n.rating}: ${item.avgRating.toFixed(2)}`;
        } else if (sortField === "created") {
            infoString = `${i18n.created}: ${
                dojoDate.format(new Date(item.created), { selector: "date", formatLength: "short" })
            }`;
        } else {
            infoString = `${i18n.updated}: ${
                dojoDate.format(new Date(item.modified), { selector: "date", formatLength: "short" })
            }`;
        }

        return (
            <div class="card-ac__container" key={this.props.key}>
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
                                    {`${item.displayName} ${i18n.by}`}
                                    <a
                                        class="content-search-selectable card-mc__author-link"
                                        title={this.props.organization ? i18n.viewOrg : i18n.viewProfile}
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
                                {i18n.viewItem}
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
                        <div class="card-ac__no-wrap">
                            <button
                                class="card-ac__primary-btn card-ac__btn"
                                onclick={this.handleMainActionClick}
                            >
                                {this.props.mainActionTitle}
                            </button>
                            {
                                this.props.customActions && this.props.customActions.length > 0 ? (
                                    <Ago2018Dropdown
                                        key={`${item.id}-action-dropdown`}
                                        active={this.state.customActionsOpen}
                                        onToggle={this.handleActionDropdownToggle}
                                    >
                                        <span class="card-ac__custom-actions card-ac__btn" title={i18n.actions}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 32 32"
                                            >
                                                <path d="M28 9v5L16 26 4 14V9l12 12L28 9z" />
                                            </svg>
                                        </span>
                                        <div>
                                            {
                                                this.props.customActions.map((action, index) => (
                                                    <button
                                                        key={action.name}
                                                        class="card-ac__custom-action-btn card-ac__btn"
                                                        value={index}
                                                        onclick={this.handleCustomActionClick}
                                                    >
                                                        {action.name}
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    </Ago2018Dropdown>
                                ) : null
                            }
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

    private handleActionDropdownToggle() {
        this.setState({
            customActionsOpen: !this.state.customActionsOpen
        });
    }

    private handleMainActionClick(e: any) {
        this.props.mainAction([scrubItemInfo(this.props.item)]);
    }

    private handleCustomActionClick(e: any) {
        this.setState({
            customActionsOpen: !this.state.customActionsOpen
        });
        if (this.props.customActions && this.props.customActions[e.target.value]) {
            this.props.customActions[e.target.value].onAction(scrubItemInfo(this.props.item));
        }
    }
}