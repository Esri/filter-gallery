import { Component, H } from "../../Component";
import Header from "./Header";
import Body from "./Body";

export interface RootComponentProps {
    key: string;
}

export default class RootComponent extends Component<RootComponentProps> {
    public render(tsx: H) {
        return (
            <main class="fg__container">
                <Header key="header" dialogTitle="Filter Gallery" />
                <Body key="body" />
            </main>
        );
    }
}
