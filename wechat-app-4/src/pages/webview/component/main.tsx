import { View, WebView } from "@tarojs/components";
import "./index.less";

function Main() {
    return (
        <View className="ro-webview-page">
            <WebView src="https://www.baidu.com"></WebView>
        </View>
    );
}

export default Main;
