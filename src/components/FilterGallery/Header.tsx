import * as i18n from "dojo/i18n!../../nls/resources";
import { connect, Component, H } from "../../Component";

export interface HeaderProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * Title for the browser.
     * @type {string}
     */
    dialogTitle: string;
}

export default class Header extends Component<HeaderProps> {
    public render(tsx: H) {
        return (
            <header class="fg__header">
                <div class="fg__header-title-section">
                    <h4 class="fg__header-title">{this.props.dialogTitle}</h4>
                </div>
            </header>
        );
    }
}
