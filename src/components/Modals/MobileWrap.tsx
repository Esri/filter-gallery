import { Component, H, ComponentProps } from "../../Component";
import SvgButton from "../Buttons/SvgButton";
import { JSX } from "../../Component";

export interface MobileWrapProps extends ComponentProps {
    /**
     * Title of the `MobileWrap`.
     * @type {string}
     */
    title: string;

    /**
     * Visibility state of the `MobileWrap`.
     * @type {boolean}
     */
    open: boolean;

    /**
     * Handler for closing the `MobileWrap`.
     * @type {function}
     */
    onClose?: () => void;

    /**
     * If true, the `MobileWrap` will fill the full screen height.
     * @type {boolean}
     */
    maxHeight?: boolean;

    /**
     * Footer to render at the bottom of the `MobileWrap`.
     * @type {object}
     */
    footer?: JSX.Element | JSX.Element[];
}

export interface MobileWrapState {
    closing: boolean;
    open: boolean;
}

/**
 * Modal component for displaying a set of options in a mobile friendly card.
 * Generally used as a replacement for dropdowns in mobile setting.
 */
export default class MobileWrap extends Component<MobileWrapProps, MobileWrapState> {
    constructor(props: MobileWrapProps) {
        super(props);

        this.state = {
            closing: false,
            open: this.props.open
        };

        this.handleClose = this.handleClose.bind(this);
    }

    public componentWillReceiveProps(nextProps: MobileWrapProps) {
        if (this.props.open !== nextProps.open && !this.state.closing) {
            if (!nextProps.open) {
                this.setState({ closing: true });
                setTimeout(() => {
                    this.setState({ open: false, closing: false });
                }, 200);
            } else {
                this.setState({ open: nextProps.open });
            }
        }
    }

    public render(tsx: H) {
        const containerClasses = {
            "mod__mob-wrap-container": true,
            "mod__mob-wrap-container--closed": !this.state.open,
            "mod__mob-wrap-container--closing": this.state.closing
        };

        const bodyClasses = {
            "mod__mob-wrap-body": true,
            "mod__mob-wrap-body--max-height": this.props.maxHeight,
            "mod__mob-wrap-body--closing": this.state.closing
        };

        return (
            <div classes={containerClasses} key={this.props.key}>
                <div classes={bodyClasses}>
                    <div class="mod__mob-wrap-header">
                        <span class="mod__mob-wrap-title">{this.props.title}</span>
                        <SvgButton key="mobile-wrap-close" focusable={true} handleClick={this.handleClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M13.207 12.5l7.778 7.778-.707.707-7.778-7.778-7.778 7.778-.707-.707 7.778-7.778-7.778-7.778.707-.707 7.778 7.778 7.778-7.778.707.707z"></path>
                            </svg>
                        </SvgButton>
                    </div>
                    <div class="mod__mob-wrap-content">
                        {this.props.children}
                    </div>
                    {
                        this.props.footer ? (
                            <div class="mod__mob-wrap-footer">
                                {this.props.footer}
                            </div>
                        ) : null
                    }
                </div>
            </div>
        );
    }

    private handleClose() {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
}
