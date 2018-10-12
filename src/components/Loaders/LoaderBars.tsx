import { H } from "../../Component";

export interface LoaderBarsProps {
    /**
     * Unique key for the component.
     * @type {string}
     */
    key: string;

    /**
     * Optional text to display under the loader bars.
     * @type {string}
     */
    text?: string;
}

/**
 * Set of animated loader bars.
 */
export default ({ key, text }: LoaderBarsProps, tsx: H) => (
    <div class="load-bars__container" key={key}>
        <div class="load-bars__bars" />
        {
            text ?
            <span class="load-bars__text">{text}</span> :
            null
        }
    </div>
);
