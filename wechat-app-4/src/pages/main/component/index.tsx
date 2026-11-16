import { connect } from "react-redux";
import { View } from "@tarojs/components";
import { isDevelopment } from "config/static-envs";
import { RootState } from "type/state";

function Main() {
    return <View className="ro-main-page"></View>;
}

const mapStateToProps = (state: RootState) => {
    if (isDevelopment) {
        console.log("%credux-state", "color: yellow", state);
    }
    return {};
};

export default connect(mapStateToProps)(Main);
