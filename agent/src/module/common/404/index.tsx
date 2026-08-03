import { joinLessPrefix } from "utils/framework";
import "./index.less";

export function MainComponent() {
    return <div className={joinLessPrefix("nofount-module")}>404</div>;
}
