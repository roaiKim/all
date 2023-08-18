import { Button, Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import logo from "asset/img/global/logo.png";
import { AtButton, AtIcon } from "taro-ui";
import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import { RootState } from "type/state";
import { actions } from "pages/main/index.module";
import { roPushHistory } from "utils";
import "./index.less";

interface ProfileProps extends ReturnType<typeof mapStateToProps> {
    name: string;
}

function Profile(props: ProfileProps) {
    const { loggedin, loginInfo } = props;
    const dispatch = useDispatch();

    return (
        <View className="ro-profile-page">
            <View className="ro-top-bg">
                <View className="ro-user-info">
                    <Image src={logo}></Image>
                    {loggedin ? (
                        <View>{loginInfo.username}</View>
                    ) : (
                        <View
                            onClick={() => {
                                roPushHistory("/pages/login/index");
                            }}
                        >
                            立即登录
                        </View>
                    )}
                </View>
            </View>
            <View className="ro-bottom-user">
                <View className="ro-user-line">功能管理</View>
                <View className="ro-user-line">
                    <AtIcon size={20} value="user"></AtIcon>
                    <View className="ro-title">个人信息</View>
                    <AtIcon size={18} value="chevron-right"></AtIcon>
                </View>
                <View className="ro-user-line">
                    <AtIcon size={20} value="shopping-bag"></AtIcon>
                    <View className="ro-title">收货地址</View>
                    <AtIcon size={18} value="chevron-right"></AtIcon>
                </View>
            </View>
            {loggedin && (
                <AtButton
                    circle
                    className="ro-logout-btn"
                    size="small"
                    onClick={() => {
                        dispatch(actions.logOutConfirm());
                    }}
                >
                    <View className="ro-logout-text">
                        <AtIcon className="infoicon" size={16} value="share-2"></AtIcon>退出当前账号
                    </View>
                </AtButton>
            )}
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        loggedin: state.app.main.loggedin,
        loginInfo: state.app.main.loginInfo,
    };
};

export default connect(mapStateToProps)(Profile);
