import { Component, H, ComponentProps } from "../../Component";

export interface BasicDropdownProps extends ComponentProps {
    /**
     * A unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * Controls whether or not the dropdown is open.
     * @type {boolean}
     */
    active?: boolean;

    /**
     * Optional handler for when a key is pressed on the dropdown.
     * @type {function}
     */
    handleButtonKeyDown?: (e: KeyboardEvent) => any;

    /**
     * Optional handler for when the dropdown is clicked.
     * @type {function}
     */
    onToggle?: () => void;

    /**
     * Optional value for the `tabindex` attribute of the dropdown button.
     */
    tabindex?: string;
}

export interface BasicDropdownState {
    active: boolean;
}

export default class BasicDropdown extends Component<BasicDropdownProps, BasicDropdownState> {
    constructor(props: BasicDropdownProps) {
        super(props);

        this.state = {
            active: false
        };

        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleDropdownClick = this.handleDropdownClick.bind(this);
        this.handleButtonKeyDown = this.handleButtonKeyDown.bind(this);
        this.registerCloseHandler = this.registerCloseHandler.bind(this);
        this.close = this.close.bind(this);
    }

    public render(tsx: H) {
        const active = this.props.active === undefined ? this.state.active : this.props.active;

        if (!this.props.children || !this.props.children[0] || !this.props.children[1]) {
            console.error("The BasicDropdown component requires 2 children");
            return;
        }

        const button = this.props.children[0];
        let dropdown = null;
        if (active) {
            dropdown = this.props.children[1];
        }

        let renderHook = null;
        if (active) {
            renderHook = (
                <div
                    key="open-dropdown-hook"
                    id={`${this.props.key}-hook`}
                    afterCreate={this.registerCloseHandler}
                    style="display: none;"
                />
            );
        }

        return (
            <div
                class="drp-basic__container"
                onclick={this.handleDropdownClick}
            >
                {renderHook}
                <span
                    id={this.props.key}
                    class="drp-basic__button"
                    onclick={this.handleBtnClick}
                    onkeydown={this.handleButtonKeyDown}
                    role="button"
                    tabindex={this.props.tabindex ? this.props.tabindex : "0"}
                >
                    {button}
                </span>
                {dropdown}
            </div>
        );
    }

    public componentWillReceiveProps(nextProps: BasicDropdownProps) {
        if (this.props.active === true && nextProps.active === false) {
            document.body.removeEventListener("click", this.close);
        } 
    }

    public close() {
        if (this.props.active === undefined) {
            this.setState({ active: false });
        } else if (this.props.onToggle) {
            this.props.onToggle();
        }
        document.body.removeEventListener("click", this.close);
    }

    private handleBtnClick(e: Event) {
        e.stopPropagation();
        if (this.props.active === undefined) {
            this.setState({ active: !this.state.active });
        } else if (this.props.onToggle) {
            this.props.onToggle();
        } else {
            this.setState({ active: !this.state.active });
        }
    }

    private handleDropdownClick(e: Event) {
        e.stopPropagation();
        this.setState({ active: !this.state.active });
    }

    private handleButtonKeyDown(e: KeyboardEvent) {
        if (e.keyCode === 13 || e.keyCode ===  32) {
            e.preventDefault();
            this.handleBtnClick(e);
        } else if (this.props.handleButtonKeyDown) {
            this.props.handleButtonKeyDown(e);
        }
    }

    private registerCloseHandler() {
        document.body.addEventListener("click", this.close);
    }
}