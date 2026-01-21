import { ConfigProvider } from "antd";
import { cssToken } from "./css-config";
import Assemble from "./main";

export default function WebPrint() {
    return (
        <ConfigProvider componentSize="small" prefixCls="roaikim" theme={{ token: cssToken }}>
            <Assemble />
        </ConfigProvider>
    );
}
