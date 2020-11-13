import * as componentI18n from "dojo/i18n!../../../../nls/resources";
import * as dojoDate from "dojo/date/locale";

export default (optionValue: string, customRange?: { start: number, end: number }) => {
    const day = 86400000; // milliseconds
    const date = new Date();
    const now = date.getTime();
    date.setHours(0, 0, 0, 0);
    const todayStart = date.getTime();
    switch (optionValue) {
        case "today":
            return {
                start: todayStart,
                end: now,
                label: componentI18n.dateSelection.today
            };
        case "yesterday":
            return {
                start: todayStart - day,
                end: todayStart,
                label: componentI18n.dateSelection.yesterday
            };
        case "last7Days":
            return {
                start: now - (day * 7),
                end: now,
                label: componentI18n.dateSelection.last7Days
            };
        case "last30Days":
            return {
                start: now - (day * 30),
                end: now,
                label: componentI18n.dateSelection.last30Days
            };
        case "custom":
            if (!!customRange) {
                const startDate = new Date(customRange.start);
                const startString = dojoDate.format(startDate, { selector: "date", formatLength: "short" });
                const endDate = new Date(customRange.end);
                const endString = dojoDate.format(endDate, { selector: "date", formatLength: "short" });
    
                return {
                    ...customRange,
                    label: `${startString}—${endString}`
                };
            }
            return undefined;
        default:
            return undefined;
    }
};
