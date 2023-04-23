import { useLoadingStatus } from "@core";
import { View } from "@tarojs/components";
import { autoShowLoading } from "utils";
import { PropsWithChildren } from "react";

function AppLoading(props: PropsWithChildren<any>) {
    const globalLoading = useLoadingStatus();
    autoShowLoading(globalLoading);
    const { children } = props;
    return <View>{children}</View>;
}

export default AppLoading;
