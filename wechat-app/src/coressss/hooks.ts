import { useSelector } from "react-redux";
import { State } from "./reducer";

export function useLoadingStatus(identifier = "global"): boolean {
    return useSelector((state: State) => state.loading[identifier] > 0);
}
