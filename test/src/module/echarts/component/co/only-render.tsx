import { PropsWithChildren } from "react";

interface OnlyRenderProps {
    condition: boolean;
}

export function OnlyRender(props: PropsWithChildren<OnlyRenderProps>) {
    const { condition, children } = props;
    if (!condition) {
        return null;
    }
    return <>{children}</>;
}
