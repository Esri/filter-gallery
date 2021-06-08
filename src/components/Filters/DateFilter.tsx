import componentI18n = require("dojo/i18n!./nls/resources");

import { Component, H, ComponentProps } from "../../Component";

import AccordionDropdown from "../Dropdowns/AccordionDropdown";
import DateRangeSelector, { DateRangeSection } from "../DateSelection/DateRangeSelector";

export interface CreatedFilterProps extends ComponentProps {

    /**
     * Title for the DateFilter
     */
    title: string;

    /**
     * Handler for when a date range is selected.
     * @type {function}
     */
    onDateSelect: (section?: DateRangeSection, range?: { start: number, end: number, label: string }) => void;

    /**
     * Currently selected date for the filter.
     * @type {object}
     */
    dateFilter: { start: number, end: number } | undefined;

    /**
     * Currently selected section for the filter.
     * @type {string}
     */
    dateSection: DateRangeSection | undefined;

    /**
     * If this option is enabled the filter will start in the active state
     * @type {boolean}
     */
    startActive?: boolean;
}

/**
 * A filter accordion for created date.
 */
export default class CreatedFilter extends Component<CreatedFilterProps> {
    constructor(props: CreatedFilterProps) {
        super(props);

        this.handleDateRangeSelect = this.handleDateRangeSelect.bind(this);
        this.handleClearFilter = this.handleClearFilter.bind(this);
    }

    public render(tsx: H) {
        return (
            <AccordionDropdown
                key="created-filter-accordion"
                title={this.props.title}
                clearable={!!this.props.dateFilter}
                onClear={this.handleClearFilter}
                startActive={this.props.startActive}
            >
                <ul
                    aria-label={this.props.title}
                    class="ftr-created__tree"
                    id="created-filter-accordion-tree"
                    role="tree"
                >
                    <DateRangeSelector
                        key="date-range-selector"
                        selectedOption={this.props.dateSection}
                        range={this.props.dateFilter}
                        onDateRangeSelect={this.handleDateRangeSelect}
                    />
                </ul>
            </AccordionDropdown>
        );
    }

    private handleDateRangeSelect(section?: DateRangeSection, range?: {start: number, end: number, label: string}) {
        this.props.onDateSelect(section, range);
    }

    private handleClearFilter() {
        this.props.onDateSelect();
    }
}
