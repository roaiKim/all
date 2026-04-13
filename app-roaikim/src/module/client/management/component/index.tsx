import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface ManagementProps {}

function Management(props: ManagementProps) {
    return <div className={joinLessPrefix("management-page")}>Hello Management</div>;
}

export default Management;
