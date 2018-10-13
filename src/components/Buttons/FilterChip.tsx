import * as i18n from "dojo/i18n!../../nls/resources";
import { Component, H, ComponentProps } from "../../Component";

export interface FilterChipProps extends ComponentProps {
    /**
     * The string id for the chip/filter.
     * @type {string}
     */
    filterId: string;
    /**
     * Handler for when the "x" is clicked on the chip.
     * @type {function}
     */
    handleRemoveFilter: (e: any) => void;
    /**
     * The text to show in the chip.
     * @type {string}
     */
    text: string;
    /**
     * If true, the close button will not be available on the chip.
     * @type {boolean}
     */
    static?: boolean;
    /**
     * Controls the visual appearance of the chip.
     * @type {string}
     */
    theme?: "light" | "dark";
}

/**
 * A removable UI chip generally used for search filters.
 */
export default class FilterChip extends Component<FilterChipProps> {
    public render(tsx: H) {
        const { filterId, handleRemoveFilter, text } = this.props;

        const labelClasses = {
            "btn-ftr-chip__label": true,
            "btn-ftr-chip__label--dark": this.props.theme === "dark"
        };

        return (
            <span
                id={`filter-chip-${text}`}
                classes={labelClasses}
                key={text}
            >
                {text}
                {
                    !this.props.static ? (
                        <button
                            aria-label={`${i18n.buttons.clear}: ${text}`}
                            value={filterId}
                            id={`filter-chip-x-${text}`}
                            class="btn-ftr-chip__remove"
                            onclick={handleRemoveFilter}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                // Maquette does NOT support svg classes in IE, must use inline styling
                                // class="btn-ftr-chip__svg"
                                style={`
                                    fill: currentColor;
                                    pointer-events: none;
                                    display: inline-block;
                                    width: 1em;
                                    height: 1em;
                                    vertical-align: -0.15em;
                                    padding-right: .15em;
                                `}
                            >
                                <path d="M18.404 16l9.9 9.9-2.404 2.404-9.9-9.9-9.9 9.9L3.696 25.9l9.9-9.9-9.9-9.898L6.1 3.698l9.9 9.899 9.9-9.9 2.404 2.406-9.9 9.898z" />
                            </svg>
                        </button>
                    ) : null
                }
            </span>
        );
    }
}
