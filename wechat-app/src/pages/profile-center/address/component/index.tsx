import { View } from "@tarojs/components";
import { RootState } from "type/state";
import { connect } from "react-redux";
import { AtButton, AtIcon, AtTabs, AtTabsPane } from "taro-ui";
import { roDispatch } from "@core";
import Empty from "component/Empty";
import { roPushHistory } from "utils";
import { actions } from "pages/profile-center/address/index.module";
import "./index.less";
import AddressCard from "./address-card";

interface AddressProps extends ReturnType<typeof mapStateToProps> {}

function Address(props: AddressProps) {
    const { Q, P, tabKey } = props;
    return (
        <View className="ro-address-page">
            <View style={{ paddingBottom: 60 }}>
                <AtTabs
                    animated={false}
                    current={tabKey}
                    tabList={[{ title: "取件地址" }, { title: "派件地址" }]}
                    onClick={(e) => {
                        roDispatch(actions.toggleTabkey(e));
                    }}
                >
                    <AtTabsPane current={tabKey} index={0}>
                        <View className="tab-box">
                            {Q?.length > 0 ? (
                                Q.map((item, index) => <AddressCard key={index} address={item}></AddressCard>)
                            ) : (
                                <Empty title="暂无取件地址"></Empty>
                            )}
                        </View>
                    </AtTabsPane>
                    <AtTabsPane current={tabKey} index={1}>
                        <View className="tab-box">
                            {P?.length > 0 ? (
                                P.map((item, index) => <AddressCard key={index} address={item}></AddressCard>)
                            ) : (
                                <Empty title="暂无派件地址"></Empty>
                            )}
                        </View>
                    </AtTabsPane>
                </AtTabs>
            </View>
            <AtButton
                className="g-btn-fixed"
                type="primary"
                onClick={() => {
                    roPushHistory("/pages/profile-center/address/addition");
                }}
            >
                <View className="confirm-text">
                    <AtIcon className="add-icon" size={14} value="add"></AtIcon>
                    新建地址
                </View>
            </AtButton>
        </View>
    );
}

const mapStateToProps = (state: RootState) => ({
    Q: state.app.address.Q,
    P: state.app.address.P,
    tabKey: state.app.address.tabKey,
});

export default connect(mapStateToProps)(Address);
