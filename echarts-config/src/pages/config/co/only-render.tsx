import type { PropsWithChildren } from "react";

interface RenderByProps {
    when: boolean;
}

export function RenderBy(props: PropsWithChildren<RenderByProps>) {
    const { when, children } = props;
    if (!when) {
        return null;
    }
    return <>{children}</>;
}
