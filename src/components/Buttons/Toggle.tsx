import { Component, H, ComponentProps } from "../../Component";
import { Tree } from "../../_utils";

export interface ToggleOption extends Tree {
    /**
     * Display name for the toggle option.
     * @type {string}
     */
    displayName: string;

    /**
     * Optional children for the toggle option.
     * @type {array}
     */
    children?: ToggleOption[] | undefined;

    /**
     * Optional text for the toggle tooltip.
     * @type {string}
     */
    tooltip?: string;

    /**
     * Optional count to show next to the toggle.
     * @type {number}
     */
    count?: number;
}

export interface ToggleProps extends ComponentProps {
    key: string;
    name: string;
    value: string;
    selectedToggle?: string;
    showTooltip?: boolean;
    tooltip?: string;
    childOptions?: ToggleOption[];
    onToggleClick: (value: string, text?: string) => void;

    /**
     * If enabled, the full path to the selected option will be stored as its value
     */
    useFullPathAsValue?: boolean;

    /**
     * Prepends a string to every value returned from the toggle
     */
    prependValue?: string;

    /**
     * Displays a count next to the toggle
     */
    count?: number;
}

/**
 * A binary option component supporting child options which is commonly used for selecting from a tree.
 */
export default class Toggle extends Component<ToggleProps> {
    constructor(props: ToggleProps) {
        super(props);

        this.handleToggleClick = this.handleToggleClick.bind(this);
    }

    public render(tsx: H) {
        const { name, selectedToggle, childOptions, prependValue } = this.props;
        const value = prependValue ? `${prependValue}${this.props.value}` : this.props.value;

        let selected = !!(selectedToggle === value ||
            (childOptions && this.childSelectedRecursive(childOptions, value)));

        const itemClasses = {
            "btn-toggle__item": true,
            "btn-toggle__item--active": selected
        };
    
        const buttonClasses = {
            "btn-toggle__button": true,
            "btn-toggle__button--active": selected
        };
    
        let children = null;
        if (childOptions) {
            children = (
                <ul class="btn-toggle__sub-list" role="group">
                    {this.mapChildrenToToggles(tsx)}
                </ul>
            );
        }

        const expanded = childOptions ?
            selected ? "true" : "false" :
            undefined;

        return (
            <li 
                id={`${value}-option`} 
                key={value} 
                classes={itemClasses}
                role="treeitem"
                aria-selected={selected ? "true" : undefined}
                aria-expanded={expanded}
            >
                <button
                    id={`toggle-${value}`}
                    key={value}
                    classes={buttonClasses}
                    value={value}
                    onmousedown={this.preventDefault}
                    onclick={this.handleToggleClick}
                    title={this.props.tooltip}
                    tabindex="0"
                >
                    <span class="btn-toggle__text" key="text">{name}</span>
                    {
                        this.props.count ?
                        <span class="btn-toggle__count" key="count">&nbsp;{`(${this.props.count})`}</span> : null
                    }
                </button>
                {selected ? children : null}
            </li>
        );
    }

    private preventDefault(e: MouseEvent) {
        e.preventDefault();
    }

    private mapChildrenToToggles(tsx: H) {
        const { childOptions, selectedToggle, onToggleClick, useFullPathAsValue, prependValue } = this.props;
        const value = prependValue ? `${prependValue}${this.props.value}` : this.props.value;

        if (childOptions) {
            return childOptions.map((option) => {
                return (
                    <Toggle
                        count={option.count}
                        key={option.value}
                        name={option.displayName}
                        value={useFullPathAsValue ? `${value}/${option.value}` : option.value}
                        showTooltip={this.props.showTooltip}
                        tooltip={option.tooltip}
                        selectedToggle={selectedToggle}
                        childOptions={option.children}
                        onToggleClick={onToggleClick}
                        useFullPathAsValue={useFullPathAsValue}
                    />
                );
            });
        }
        return null;
    }

    private childSelectedRecursive(childOptions: ToggleOption[], currentPath: string) {
        const { selectedToggle, useFullPathAsValue } = this.props;
        if (useFullPathAsValue) {
            return childOptions.reduce((result, option) => {
                if (
                    selectedToggle === `${currentPath}/${option.value}` ||
                    (
                        option.children &&
                        this.childSelectedRecursive(option.children, `${currentPath}/${option.value}`)
                    )
                ) {
                    return true;
                }
                return result;
            }, false);
        }
        return childOptions.reduce((result, option) => {
            if (
                selectedToggle === option.value ||
                (
                    option.children &&
                    this.childSelectedRecursive(option.children, this.props.value)
                )
            ) {
                return true;
            }
            return result;
        }, false);
    }

    private handleToggleClick(e: any) {
        e.preventDefault();
        this.props.onToggleClick(
            this.props.prependValue ? `${this.props.prependValue}${this.props.value}` : this.props.value,
            this.props.name
        );
    }
}
