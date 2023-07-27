import { useLoadingStatus } from "@core";
import { View } from "@tarojs/components";
import { autoShowLoading } from "utils/functions";
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
