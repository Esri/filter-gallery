import { Component, H } from "../Component";

export interface RootComponentProps {
    key: string;
}

export default class RootComponent extends Component<RootComponentProps> {
    public render(tsx: H) {
        return <h3>Hello</h3>;
    }
}
