import { FunctionalComponent } from "../../stencil-public-runtime";
import { JSXBase } from "../../stencil-public-runtime";
export declare type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
interface CalciteHeadingProps extends JSXBase.HTMLAttributes {
  level: HeadingLevel;
}
export declare function constrainHeadingLevel(level: number): HeadingLevel;
export declare const CalciteHeading: FunctionalComponent<CalciteHeadingProps>;
export {};
