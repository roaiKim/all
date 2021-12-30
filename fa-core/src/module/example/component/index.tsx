import React from "react";
import { UserOutlined, ShoppingCartOutlined, CameraOutlined, CarOutlined } from "@icon";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";
import { AdvancedSelect } from "components/advanced-select";

interface HomeState {
    name?: string;
}

interface HomeProps extends DispatchProp {
    name: string | null;
}

class Home extends React.PureComponent<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {};
    }

    override render() {
        const { name } = this.props;

        return (
            <div className="ro-example-component-container">
                <div style={{ width: 300 }}>
                    <AdvancedSelect
                        optionLabel="op"
                        optionValue="ha"
                        options={[
                            {
                                op: "io",
                                ha: "iop",
                            },
                            {
                                op: "io1",
                                ha: "iop1",
                            },
                            {
                                op: "io2",
                                ha: "iop2",
                            },
                        ]}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    name: state.app.example.name,
});

export default connect(mapStateToProps)(Home);
