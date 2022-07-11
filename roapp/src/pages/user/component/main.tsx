import { View, Text } from "@tarojs/components";
import { connect } from "react-redux";
import { showLoading } from "@core";
import { RootState } from "type/state";
import "./index.less";

interface HomeProps {
    name: string | null;
}

function Profile(props: HomeProps) {
    const { name } = props;
    console.log("name--", name);
    return (
        <View className="ro-user-page">
            <Text>Hello Profile {name} </Text>
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        name: state.app.profile.name,
        autoLoading: showLoading(state, "auto"),
    };
};

export default connect(mapStateToProps)(Profile);
