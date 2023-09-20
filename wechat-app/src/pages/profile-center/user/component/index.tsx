import { View } from "@tarojs/components";
import { RootState } from "type/state";
import { connect } from "react-redux";
import "./index.less";

interface UserProps extends ReturnType<typeof mapStateToProps> {}

function User(props: UserProps) {
    return <View className="ro-user-page"> Hello User</View>;
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(User);
