import { View, Text, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import { RootState } from "type/state";
import { actions } from "../index.module";
import "./index.less";

interface HomeProps {
    name: string | null;
}

function Home(props: HomeProps) {
    const { name } = props;
    const dispatch = useDispatch();

    return (
        <View className="ro-home-page">
            <Text>Hello world! Welcome {name} </Text>
            <Button
                onClick={() => {
                    Taro.redirectTo({ url: "index?id=1" });
                }}
            >
                跳转
            </Button>
            <Button
                onClick={() => {
                    Taro.redirectTo({ url: "/pages/user/index" });
                }}
            >
                个人中心
            </Button>
            <Button
                onClick={() => {
                    dispatch(actions.reset());
                }}
            >
                重置
            </Button>
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        name: state.app.home.name,
        autoLoading: showLoading(state, "auto"),
    };
};

export default connect(mapStateToProps)(Home);
