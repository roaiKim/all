import { View } from "@tarojs/components";
import { RootState } from "type/state";
import { connect } from "react-redux";
import "./index.less";

interface {1} extends ReturnType<typeof mapStateToProps> {}

function {2}(props: {1}) {
    return <View className="ro-{4}-page"> Hello {2}</View>;
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)({2});
