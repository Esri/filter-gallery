export declare type HourDisplayFormat = "12" | "24";
export declare type Meridiem = "AM" | "PM";
export declare type MinuteOrSecond = "minute" | "second";
export interface Time {
  hour: string;
  minute: string;
  second: string;
}
export declare type TimeFocusId = "hour" | MinuteOrSecond | "meridiem";
export declare const maxTenthForMinuteAndSecond = 5;
export declare function getMeridiem(hour: string): Meridiem;
export declare function getMeridiemHour(hour: string): string;
export declare function parseTimeString(value: string): Time;
export declare function formatTimeString(value: string): string;
export declare function formatTimePart(number: number): string;
