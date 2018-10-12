import { Component, H, ComponentProps } from "../../Component";

export interface ToggleSwitchProps extends ComponentProps {
    /**
     * A unique key distinguishing this component from its siblings.
     * @type {string}
     */
    key: string;

    /**
     * Text to display next to the toggle switch.
     * @type {string}
     */
    label: string

    /**
     * Handler for when the toggle is selected.
     * @type {function}
     */
    handleToggleClick: (e?: any) => void;

    /**
     * Selected state of the ToggleSwitch.
     * @type {boolean}
     */
    value: boolean;

    /**
     * Optional id attribute for the toggle switch input.
     * @type {string}
     */
    id?: string;
}

/**
 * A prominent checkbox component for binary options.
 */
export default class ToggleSwitch extends Component<ToggleSwitchProps> {
    public render(tsx: H) {
        const { label, handleToggleClick, value, id } = this.props;

        return (
            <label class="btn-toggle-switch__toggle" key={id ? id : "toggle-switch"}>
                <span class="btn-toggle-switch__label">{label}</span>
                <input
                    id={`${id}-input`}
                    type="checkbox"
                    class="btn-toggle-switch__input"
                    onchange={handleToggleClick}
                    checked={value}
                />
                <span
                    id={`${id}-switch`}
                    class="btn-toggle-switch__switch"
                />
            </label>
        );
    }
}
