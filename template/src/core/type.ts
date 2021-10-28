import { RouterState } from "connected-react-router";

export interface LoadingState {
    [loading: string]: number;
}
export interface WebsiteState {
    width?: number;
    height?: number;
}
export interface State {
    app: {};
    loading: LoadingState;
    router: RouterState;
    website: WebsiteState;
}
