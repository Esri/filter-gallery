import { VNode } from "../../stencil-public-runtime";
import { HeadingLevel } from "../functional/CalciteHeading";
/**
 * @slot - A slot for adding `calcite-pick-list-item` elements.
 */
export declare class CalcitePickListGroup {
  /**
   * The title used for all nested `calcite-pick-list` rows.
   *
   */
  groupTitle: string;
  /**
   * Number at which section headings should start for this component.
   */
  headingLevel: HeadingLevel;
  el: HTMLCalcitePickListGroupElement;
  render(): VNode;
}
