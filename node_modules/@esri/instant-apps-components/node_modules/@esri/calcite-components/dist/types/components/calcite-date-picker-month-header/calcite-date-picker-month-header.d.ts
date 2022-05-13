import { EventEmitter, VNode } from "../../stencil-public-runtime";
import { DateLocaleData } from "../calcite-date-picker/utils";
import { Scale } from "../interfaces";
import { HeadingLevel } from "../functional/CalciteHeading";
export declare class CalciteDatePickerMonthHeader {
  el: HTMLCalciteDatePickerMonthHeaderElement;
  /** Already selected date. */
  selectedDate: Date;
  /** Focused date with indicator (will become selected date if user proceeds) */
  activeDate: Date;
  /**
   * Number at which section headings should start for this component.
   */
  headingLevel: HeadingLevel;
  /** Minimum date of the calendar below which is disabled. */
  min: Date;
  /** Maximum date of the calendar above which is disabled. */
  max: Date;
  /** User's language and region as BCP 47 formatted string. */
  locale: string;
  /** Localized string for previous month. */
  intlPrevMonth: string;
  /** Localized string for next month. */
  intlNextMonth: string;
  /** specify the scale of the date picker */
  scale: Scale;
  /** CLDR locale data for translated calendar info */
  localeData: DateLocaleData;
  /**
   *  Changes to active date
   */
  calciteDatePickerSelect: EventEmitter<Date>;
  connectedCallback(): void;
  render(): VNode;
  renderContent(dir: string): VNode;
  private yearInput;
  nextMonthDate: Date;
  prevMonthDate: Date;
  setNextPrevMonthDates(): void;
  /**
   * Increment year on UP/DOWN keys
   */
  private onYearKey;
  private yearChanged;
  private prevMonthClick;
  private prevMonthKeydown;
  private nextMonthClick;
  private nextMonthKeydown;
  private handleArrowClick;
  /**
   * Parse localized year string from input,
   * set to active if in range
   */
  private setYear;
}
