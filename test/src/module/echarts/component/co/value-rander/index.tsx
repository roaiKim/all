import { NumberValueRander } from "./number-value";
import { EchartsNodeType } from "../../config";

export default function (type: keyof typeof EchartsNodeType) {
    switch (type) {
        case "number":
            return <NumberValueRander> </NumberValueRander>;

        default:
            return null;
    }
}
