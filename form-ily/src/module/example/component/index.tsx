import React from "react";
import "./index.less";
import { AdvancedSelect } from "components/advanced-select";

interface HomeState {
    name?: string;
}

interface HomeProps {
    // name: string | null;
}

export default class Home extends React.PureComponent<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {};
    }

    override render() {
        // const { name } = this.props;

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
