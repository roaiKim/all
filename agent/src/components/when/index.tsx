import type { PropsWithChildren } from "react";

interface WhenProps {
    when: boolean;
}
export function When(props: PropsWithChildren<WhenProps>) {
    if (props.when) {
        return props.children;
    }
    return null;
}
