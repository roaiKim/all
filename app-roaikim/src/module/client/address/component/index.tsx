import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface AddressProps {}

function Address(props: AddressProps) {
    return <div className={joinLessPrefix("address-page")}>Hello Address</div>;
}

export default Address;
