import { Component, H, ComponentProps } from "../../Component";
import BasicDropdown from "./BasicDropdown";

export interface Ago2018DropdownProps extends ComponentProps {
    /**
     * A unique key for the component.
     */
    key: string;

    /**
     * Controls whether or not the dropdown is open.
     * @type {boolean}
     */
    active?: boolean;

    /**
     * Handler for when the dropdown is toggled.
     * @type {function}
     */
    onToggle?: () => void;

    /**
     * Optional tabindex value for the dropdown.
     * @type {string}
     */
    tabindex?: string;
}

export interface Ago2018DropdownState {
    active: boolean;
    closing: boolean;
}

/**
 * A dropdown in 2018 AGOL style.
 */
export default class Ago2018Dropdown extends Component<Ago2018DropdownProps, Ago2018DropdownState> {
    constructor(props: Ago2018DropdownProps) {
        super(props);

        this.state = {
            active: this.props.active ? this.props.active : false,
            closing: false
        };

        this.handleDrpClick = this.handleDrpClick.bind(this);
    }

    public render(tsx: H) {
        const menuClasses = {
            "drp-ago2018__menu": true,
            "drp-ago2018__menu--active": this.state.active && !this.state.closing
        };

        if (!this.props.children || !this.props.children[0] || !this.props.children[1]) {
            console.error("The Ago2018Dropdown component requires 2 children");
            return;
        }

        return (
            <BasicDropdown
                key={this.props.key}
                active={this.state.active}
                onToggle={this.handleDrpClick}
                tabindex={this.props.tabindex}
            >
                {this.props.children[0]}
                <div classes={menuClasses}>
                    {this.props.children[1]}
                </div>
            </BasicDropdown>
        );
    }

    public componentWillReceiveProps(nextProps: Ago2018DropdownProps) {
        if (nextProps.active === false && this.props.active === true) {
            this.close();
        }
    }

    private close(triggerToggle?: boolean) {
        this.setState({ closing: true });
        setTimeout(() => {
            this.setState({ active: false, closing: false });
            if (this.props.onToggle && triggerToggle) {
                this.props.onToggle();
            }
        }, 200);
    }

    private handleDrpClick() {
        if (this.state.active) {
            this.close(true);
        } else if (!this.state.closing) {
            this.setState({ active: true });
            if (this.props.onToggle) {
                this.props.onToggle();
            }
        }
    }
}