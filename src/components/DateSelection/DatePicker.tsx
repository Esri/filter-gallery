import { Component, H, ComponentProps } from "../../Component";
import * as DateTextBox from "dijit/form/DateTextBox";

export interface DatePickerProps extends ComponentProps {
    /**
     * A unique key for the `DatePicker` component.
     * @type {string}
     */
    key: string;

    /**
     * The currently selected date for the date picker.
     * @type {Date}
     */
    value?: Date;

    /**
     * Constraints to limit the selectable dates from the picker.
     * @type {object}
     */
    constraints?: {
        /**
         * The earliest selectable date from the picker.
         * @type {Date}
         */
        min?: Date;

        /**
         * The latest selectable date from the picker.
         * @type {Date}
         */
        max?: Date;
    };

    /**
     * Handler for when a date is selected from the picker.
     * @type {function}
     */
    onDateChange: (date: Date) => void;
}

export interface ComponentState {
    dijit?: dijit.form.DateTextBox;
}

/**
 * A date picker in calcite web style.
 */
export default class DatePicker extends Component<DatePickerProps, ComponentState> {
    constructor(props: DatePickerProps) {
        super(props);

        this.processDijit = this.processDijit.bind(this);
        this.createDijit = this.createDijit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    render(tsx: H) {
        return (
            <div
                key={this.props.key}
                id={this.props.key}
                class="margin-right-1"
                afterCreate={this.processDijit}
            />
        );
    }

    public componentWillReceiveProps(nextProps: DatePickerProps) { 
        // adding a check to make sure that the textbox exists
        // side effect of patches from this issue https://devtopia.esri.com/WebGIS/arcgis-portal-app/issues/16499 
        if (nextProps.constraints !== this.props.constraints && this.state.dijit && this.state.dijit["textbox"]) {
            this.state.dijit.set("constraints", { ...nextProps.constraints });
        }
    }

    private processDijit(node: Element) {
        if (this.state.dijit) {
            this.state.dijit.destroy();
        }

        const dijit = this.createDijit(node);
        dijit.on("change", this.handleDateChange);
        this.setState({ dijit });
    }

    private createDijit(node: Element) {
        return new DateTextBox({
            value: this.props.value,
            constraints: { ...this.props.constraints }
        }, node);
    }

    private handleDateChange(date: Date) {
        this.props.onDateChange(date);
    }
}
