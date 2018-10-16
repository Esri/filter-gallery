import { Component, H, ComponentProps } from "../../Component";

export interface OverlayProps extends ComponentProps {
    /**
     * Indicates whether the overlay is currently closing.
     * @type {boolean}
     */
    closing?: boolean;

    /**
     * Indicates whether the overlay is scrollable.
     * @type {boolean}
     */
    scrollable?: boolean;

    /**
     * Animate by sliding in/out instead or growing. Options are `left` or `right`.
     * - `left`: The overlay will slide in from the left.
     * - `right`: The overlay will slide in from the right.
     * @type {string}
     */
    slide?: "left" | "right";
}

/**
 * A full-screen takeover modal component in calcite web style.
 */
export default class Overlay extends Component<OverlayProps> {
    public componentWillReceiveProps(nextProps: OverlayProps) {
        if (this.props.scrollable !== false && nextProps.scrollable === false) {
            const overlays = document.getElementsByClassName("mod__overlay-container");
            if (overlays[0]) {
                overlays[0].scrollTop = 0;
            }
        }
    }

    public render(tsx: H) {
        const overlayClasses = {
            "mod__overlay-container": true,
            "mod__overlay-container--closing": this.props.closing,
            "mod__overlay-container--no-scroll": this.props.scrollable === false,
            "mod__overlay-container--slide-left": this.props.slide === "left",
            "mod__overlay-container--slide-right": this.props.slide === "right"
        };

        return (
            <div
                classes={overlayClasses}
                key={this.props.key}
            >
                {this.props.children}
            </div>
        );
    }
}