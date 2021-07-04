import React from "react";
import { TableComponent } from "@component";
import { connect } from "react-redux";
import "./index.less";

class Main extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 230,
        },
        {
            title: "Path",
            dataIndex: "absolutePath",
            key: "absolutePath",
            width: 230,
        },
    ]

    render() {
        const { source } = this.props;
        return (
            <article className="ro-module-wrap ro-file-module">
                <div className="ro-table-wrap">
                    <TableComponent
                        title="customer table"
                        showNumber
                        columns={this.columns}
                        dataSource={source ? source.list : null}
                    />
                </div>
            </article>
        );
    }

}

const mapStateToProps = (state) => ({
    source: state.app.file.list,
});

export default connect(mapStateToProps)(Main);
