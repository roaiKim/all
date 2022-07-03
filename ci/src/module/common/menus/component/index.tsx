import { Menu } from "antd";
import { connect } from "react-redux";
import { RootState } from "type/state";
import { State } from "../type";
import "./index.less";

interface MeunComponentProps {
    menus: State["menus"];
}

function MeunComponent(props: MeunComponentProps) {
    const { menus } = props;
    return (
        <menu className="ro-meuns-module">
            <Menu items={menus || []} mode="inline" />
        </menu>
    );
}

const mapStateToProps = (state: RootState) => ({
    menus: state.app.menus.menus,
});

export default connect(mapStateToProps)(MeunComponent);
