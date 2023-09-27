import { View, Image } from "@tarojs/components";
import { RootState } from "type/state";
import { connect } from "react-redux";
import { NavList } from "component/nav-list";
import logo from "asset/img/global/logo.png";
import "./index.less";

interface UserProps extends ReturnType<typeof mapStateToProps> {}

function User(props: UserProps) {
    return (
        <View className="ro-user-page">
            <NavList>
                <NavList.NavListItem title="头像">
                    <Image style={{ width: 35, height: 35 }} src={logo} mode="aspectFit"></Image>
                </NavList.NavListItem>
                <NavList.NavListItem
                    title="电话"
                    rightValue="17376833333"
                    onClick={() => {
                        console.log("ddd-点击");
                    }}
                />
                <NavList.NavListItem title="邮箱" rightValue="123gggg@smartcomma.com" />
                <NavList.NavListItem arrow="right" title="修改密码" />
            </NavList>
        </View>
    );
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(User);
