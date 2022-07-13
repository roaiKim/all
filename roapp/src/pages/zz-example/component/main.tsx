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
                    // 重定向 url 的参数可以在数据模型层的onEntry方法的第一个参数中获取
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
                    // 调用 数据模型层的 方法
                    dispatch(actions.reset());
                }}
            >
                重置
            </Button>
            <Button
                onClick={() => {
                    // 点击这个按钮会出现二次弹窗
                    dispatch(actions.delete());
                }}
            >
                删除
            </Button>
        </View>
    );
}
// 从 Redux 中获取数据
const mapStateToProps = (state: RootState) => {
    return {
        name: state.app.home.name,
        autoLoading: showLoading(state, "auto"),
    };
};

export default connect(mapStateToProps)(Home);
