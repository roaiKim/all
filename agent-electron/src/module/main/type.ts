export interface MainLoyoutRatio {
    left: number;
    center: number;
    right: number;
    top: number;
    bottom: number;
}

export interface State {
    name?: string;
    appLoadingStatus: "loading" | "done" | "error";
    initialed: boolean;
    mainLoyoutRatio: MainLoyoutRatio;
}
