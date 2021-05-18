import { Component, H, ComponentProps } from "../../Component";
import { Tree } from "../../_utils";

export interface CheckToggleOption extends Tree {
    /**
     * The name displayed in the UI for this option.
     * @type {string}
     */
    displayName: string;

    /**
     * Array of additional options to show as children of this option.
     * @type {array}
     */
    children?: CheckToggleOption[] | undefined;
}

export interface CheckToggleProps extends ComponentProps {
    /**
     * The name displayed in the UI for this check option.
     * @type {string}
     */
    name: string;

    /**
     * The value for this toggle option.
     * @type {string}
     */
    value: string;

    /**
     * A map of toggles values which are currently selected.
     * @type {object}
     */
    selectedToggles?: {
        [selectedToggle: string]: any;
    };

    /**
     * Array of options which are children of this option.
     * @type {array}
     */
    childOptions?: CheckToggleOption[];

    /**
     * Handler for when the toggle is selected.
     * @type {function}
     */
    onToggleClick: (value: string, text?: string) => void;

    /**
     * Displays a count next to the toggle.
     * @type {number}
     */
    count?: number;
}

/**
 * A binary option component supporting child options, which is used for multi-select from a tree.
 */
export default class CheckToggle extends Component<CheckToggleProps> {
    constructor(props: CheckToggleProps) {
        super(props);

        this.handleToggleClick = this.handleToggleClick.bind(this);
    }

    public render(tsx: H) {
        const { name, value, selectedToggles, childOptions, onToggleClick } = this.props;

        let selected = selectedToggles && !!selectedToggles[value];

        const itemClasses = {
            "btn-check-toggle__item": true,
            "btn-check-toggle__item--active": selected
        };
    
        const buttonClasses = {
            "btn-check-toggle__button": true,
            "btn-check-toggle__button--active": selected
        };
    
        let children = null;
        if (childOptions) {
            children = (
                <ul class="btn-check-toggle__sub-list">
                    {
                        mapChildrenToToggles(
                            tsx,
                            value,
                            childOptions,
                            onToggleClick,
                            selectedToggles
                        )
                    }
                </ul>
            );
        }
    
        return (
            <li key={value} classes={itemClasses}>
                <button
                    id={`toggle-${value}`}
                    key={value}
                    classes={buttonClasses}
                    value={value}
                    onmousedown={this.preventDefault}
                    onclick={this.handleToggleClick}
                    tabindex="0"
                    data-event="track-component" 
                    data-component-name="Check Toggle (Tags Filter)" 
                    data-component-link={name} 
                    data-component-link-type="button"
                >
                    <span class="btn-check-toggle__text" key="text">{name}</span>
                    {
                        this.props.count ?
                        <span class="btn-check-toggle__count" key="count">&nbsp;{`(${this.props.count})`}</span> : null
                    }
                </button>
                {selected ? children : null}
            </li>
        );
    }

    private preventDefault(e: MouseEvent) {
        e.preventDefault();
    }

    private handleToggleClick(e: MouseEvent) {
        e.preventDefault();
        this.props.onToggleClick(this.props.value, this.props.name);
    }
}

function mapChildrenToToggles(
    tsx: any,
    value: string,
    childOptions: CheckToggleOption[],
    onToggleClick: (value: string, text?: string) => void,
    selectedToggles?: {
        [selectedToggle: string]: boolean;
    }
) {
    if (childOptions) {
        return childOptions.map((option) => {
            return (
                <CheckToggle
                    key={option.value}
                    name={option.displayName}
                    value={`${value}/${option.value}`}
                    selectedToggles={selectedToggles}
                    childOptions={option.children}
                    onToggleClick={onToggleClick}
                />
            );
        });
    }
    return null;
}
