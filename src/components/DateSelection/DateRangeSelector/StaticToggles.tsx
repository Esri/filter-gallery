import { Component, H, ComponentProps } from "../../../Component";
import Toggle, { ToggleOption } from "../../Buttons/Toggle";
import { DateRangeSection } from ".";

export interface StaticTogglesProps extends ComponentProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * Array of toggle options to show.
     * @type {array}
     */
    options: ToggleOption[];

    /**
     * Handler for when an option is clicked.
     * @type {function}
     */
    handleOptionClick: (optionName: string) => void;

    /**
     * The currently selected date range.
     * @type {string}
     */
    selectedOption?: DateRangeSection;

    /**
     * The current value for the custom date range.
     * @type {object}
     */
    customRange?: {
        /**
         * The start of the custom date range in epoch time.
         * @type {number}
         */
        start: number,

        /**
         * The end of the custom date range in epoch time.
         * @type {number}
         */
        end: number
    };
}

/**
 * Date range selection toggles making up the `DateRangeSelector` other than the date picker.
 */
export default class StaticToggles extends Component<StaticTogglesProps> {
    constructor(props: StaticTogglesProps) {
        super(props);
    }

    public render(tsx: H) {
        return this.props.options.map((option) => {
            return (
                <Toggle
                    key={option.value}
                    name={option.displayName}
                    value={option.value}
                    selectedToggle={this.props.selectedOption}
                    childOptions={option.childOptions}
                    onToggleClick={this.props.handleOptionClick}
                />
            );
        });
    }
}
