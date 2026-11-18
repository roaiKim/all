import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import { AtButton, AtIcon } from "taro-ui";
import { Background } from "@component/background";
import { loginPage } from "@config/static-envs";
import { actions } from "@pages/main";
import { Button, Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { RootState } from "@type/state";
import { roPushHistory } from "@utils";
import logo from "@asset/img/global/logo.png";
import "./index.less";

interface ProfileProps extends ReturnType<typeof mapStateToProps> {
    name: string;
}

function Profile(props: ProfileProps) {
    const { loggedin, loginInfo } = props;
    const dispatch = useDispatch();

    return (
        <Background>
            <View className="ro-profile-page">
                <View className="ro-top-bg">
                    <View className="ro-user-info">
                        {/* <Image src={logo}></Image> */}
                        <AtIcon value="user" color="#fff"></AtIcon>
                        {loggedin ? (
                            <View>
                                <View>{loginInfo.full_name}</View>
                                <View className="user-cars">粤B.123456</View>
                            </View>
                        ) : (
                            <View
                                onClick={() => {
                                    roPushHistory(loginPage);
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
                        <View
                            className="ro-title"
                            onClick={() => {
                                roPushHistory("/pages/common/profile-center/user/index");
                            }}
                        >
                            个人信息
                        </View>
                        <AtIcon size={18} value="chevron-right"></AtIcon>
                    </View>
                    <View className="ro-user-line">
                        <AtIcon size={20} value="shopping-bag"></AtIcon>
                        <View
                            className="ro-title"
                            // onClick={() => {
                            //     roPushHistory("/pages/common/profile-center/address/index");
                            // }}
                        >
                            收货地址
                        </View>
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
        </Background>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        loggedin: state.app.main.loggedin,
        loginInfo: state.app.main.loginInfo,
    };
};

export default connect(mapStateToProps)(Profile);
