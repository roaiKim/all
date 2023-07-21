import { useLoadingStatus } from "@core";
import { View } from "@tarojs/components";
import { autoShowLoading } from "utils";
import { PropsWithChildren, useEffect } from "react";

function AppLoading(props: PropsWithChildren<any>) {
    const globalLoading = useLoadingStatus();

    useEffect(() => {
        autoShowLoading(globalLoading);
    }, [globalLoading]);

    const { children } = props;
    return <View>{children}</View>;
}

export default AppLoading;
