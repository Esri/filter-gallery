import * as componentI18n from "dojo/i18n!../../../nls/resources";

import { Component, H } from "../../../Component";
import DatePicker from "../DatePicker";
import StaticToggles from "./StaticToggles";
import { ToggleOption } from "../../Buttons/Toggle";
import getDateRange from "./_utils/getDateRange";

/**
 * Time range for date selection.
 * @type {string}
 */
export type DateRangeSection = "today" | "yesterday" | "last7Days" | "last30Days" | "custom";

export interface DateRangeSelectorProps {
    /**
     * A unique key for the component.
     */
    key: string;

    /**
     * The selected date range.
     */
    selectedOption?: DateRangeSection;

    /**
     * The date range for the custom option.
     * @type {object}
     */
    range?: {
        /**
         * The start date of the custom date range in epoch time.
         * @type {number}
         */
        start: number;

        /**
         * The end date of the custom date range in epoch time.
         * @type {number}
         */
        end: number;
    };

    /**
     * Handler for when the date range is changed.
     * @type {function}
     */
    onDateRangeSelect: (section?: DateRangeSection, range?: { start: number, end: number, label: string }) => void;
}

export interface DateRangeSelectorState {
    uid: string;
    options: ToggleOption[];
    customStart?: Date;
    customEnd?: Date;
    customRange?: {
        start: number,
        end: number
    };
}

/**
 * UI component for selecting a date range.
 */
export default class DateRangeSelector extends Component<DateRangeSelectorProps, DateRangeSelectorState> {
    constructor(props: DateRangeSelectorProps) {
        super(props);

        this.state = {
            uid: Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5),
            customStart: props.selectedOption === "custom" && props.range ? new Date(props.range.start) : undefined,
            customEnd: props.selectedOption === "custom" && props.range ? new Date(props.range.end) : undefined,
            customRange: props.selectedOption === "custom" && props.range ? props.range : undefined,
            options: [
                { value: "today", displayName: componentI18n.dateSelection.today },
                { value: "yesterday", displayName: componentI18n.dateSelection.yesterday },
                { value: "last7Days", displayName: componentI18n.dateSelection.last7Days },
                { value: "last30Days", displayName: componentI18n.dateSelection.last30Days },
                { value: "custom", displayName: componentI18n.dateSelection.custom }
            ]
        };

        this.handleFromDateChange = this.handleFromDateChange.bind(this);
        this.handleToDateChange = this.handleToDateChange.bind(this);
        this.handleOptionClick = this.handleOptionClick.bind(this);
    }

    public render(tsx: H) {
        const customSelectClasses = {
            "hide": this.props.selectedOption !== "custom",
            "margin-left-1": true,
            "margin-right-0": true,
            "date__selector": true,
            "date__selector--hide": this.props.selectedOption !== "custom"
        };

        return (
            <div>
                <StaticToggles
                    key="date-range-static-toggles"
                    options={this.state.options}
                    selectedOption={this.props.selectedOption}
                    customRange={this.state.customRange}
                    handleOptionClick={this.handleOptionClick}
                />
                <div classes={customSelectClasses}>
                    <label>
                        {componentI18n.dateSelection.from}
                        <div class="date-selector__pick-wrapper">
                            <DatePicker
                                key={`from-picker-${this.state.uid}`}
                                onDateChange={this.handleFromDateChange}
                                value={this.state.customStart}
                                constraints={this.state.customEnd ? { max: this.state.customEnd } : undefined}
                            />
                        </div>
                    </label>
                    <label>
                        {componentI18n.dateSelection.to}
                        <div class="date-selector__pick-wrapper">
                            <DatePicker
                                key={`to-picker-${this.state.uid}`}
                                onDateChange={this.handleToDateChange}
                                value={this.state.customEnd}
                                constraints={this.state.customStart ? { min: this.state.customStart } : undefined}
                            />
                        </div>
                    </label>
                </div>
            </div>
        );
    }

    private handleFromDateChange(date: Date) {
        if (!!this.state.customEnd) {
            this.setState({
                customStart: date,
                customRange: {
                    start: date.getTime(),
                    end: this.state.customEnd.getTime()
                }
            });
            this.props.onDateRangeSelect(
                "custom",
                getDateRange("custom", this.state.customRange)
            );
        } else {
            this.setState({ customStart: date });
        }
    }

    private handleToDateChange(date: Date) {
        if (!!this.state.customStart) {
            this.setState({
                customEnd: date,
                customRange: {
                    start: this.state.customStart.getTime(),
                    end: date.getTime()
                }
            });
            this.props.onDateRangeSelect(
                "custom",
                getDateRange("custom", this.state.customRange)
            );
        } else {
            this.setState({ customEnd: date });
        }
    }

    private handleOptionClick(value: string) {
        if (this.props.selectedOption === value) {
            this.props.onDateRangeSelect();
        } else {
            this.props.onDateRangeSelect(
                value as DateRangeSection,
                getDateRange(value, this.state.customRange)
            );
        }
    }
}