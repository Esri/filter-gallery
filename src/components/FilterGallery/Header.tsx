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
    title: string;

    /**
     * HTML to inject into the header instead of the default.
     * @type {string}
     */
    injectedHTML?: string;
}

export default class Header extends Component<HeaderProps> {
    public render(tsx: H) {
        return (
            <header class="fg__header" innerHTML={this.props.injectedHTML ? this.props.injectedHTML : undefined}>
                <div class="fg__header-title-section">
                    <title class="fg__header-title">{this.props.title}</title>
                </div>
            </header>
        );
    }
}
