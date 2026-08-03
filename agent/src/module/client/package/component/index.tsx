import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface PackageProps {}

function Package(props: PackageProps) {
    return <div className={joinLessPrefix("package-page")}>Hello Package</div>;
}

export default Package;
