import { VNode } from "../../stencil-public-runtime";
/**
 * @slot - A slot for adding elements that reference a 'calcite-tooltip' by the 'selector' property.
 */
export declare class CalciteTooltipManager {
  el: HTMLCalciteTooltipManagerElement;
  tooltipEl: HTMLCalciteTooltipElement;
  hoverTimeouts: WeakMap<HTMLCalciteTooltipElement, number>;
  clickedTooltip: HTMLCalciteTooltipElement;
  /**
   * CSS Selector to match reference elements for tooltips. Reference elements will be identified by this selector in order to open their associated tooltip.
   * @default `[data-calcite-tooltip-reference]`
   */
  selector: string;
  queryTooltip: (element: HTMLElement) => HTMLCalciteTooltipElement;
  clearHoverTimeout: (tooltip: HTMLCalciteTooltipElement) => void;
  closeExistingTooltip: () => void;
  focusTooltip: ({ tooltip, value }: {
    tooltip: HTMLCalciteTooltipElement;
    value: boolean;
  }) => void;
  toggleTooltip: (tooltip: HTMLCalciteTooltipElement, value: boolean) => void;
  hoverToggle: ({ tooltip, value }: {
    tooltip: HTMLCalciteTooltipElement;
    value: boolean;
  }) => void;
  hoverTooltip: ({ tooltip, value }: {
    tooltip: HTMLCalciteTooltipElement;
    value: boolean;
  }) => void;
  activeTooltipHover: (event: MouseEvent) => void;
  hoverEvent: (event: MouseEvent, value: boolean) => void;
  focusEvent: (event: FocusEvent, value: boolean) => void;
  render(): VNode;
  keyUpHandler(event: KeyboardEvent): void;
  mouseEnterShow(event: MouseEvent): void;
  mouseLeaveHide(event: MouseEvent): void;
  clickHandler(event: MouseEvent): void;
  focusShow(event: FocusEvent): void;
  blurHide(event: FocusEvent): void;
}
