import { InputRander } from "./input-value";
import { NumberValueRander } from "./number-value";
import { EchartsNodeType } from "../../config";

interface RenderFieldProps {
    type: keyof typeof EchartsNodeType;
}

export function RenderField(props: RenderFieldProps) {
    const { type } = props;

    switch (type) {
        case "number":
            return <NumberValueRander> </NumberValueRander>;
        case "string":
            return <InputRander> </InputRander>;

        default:
            return null;
    }
}
