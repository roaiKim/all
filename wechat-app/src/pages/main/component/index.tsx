import { View } from "@tarojs/components";
import { connect } from "react-redux";
import { RootState } from "type/state";
import { isDevelopment } from "utils/static-envs";

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
