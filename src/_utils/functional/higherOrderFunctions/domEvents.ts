/**
 * Wraps a click event to onEnter
 * @param clickBack - event handler to apply to onEnter
 */
export const onEnter = (clickBack: (e: any) => void) => (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
        clickBack(e);
    }
};