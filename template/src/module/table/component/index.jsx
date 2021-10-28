import React from "react";
import { connect } from "react-redux";
import dayJs from "dayjs";
import { actions } from "module/table";
import { TableComponent } from "@component";
import "./index.less";

class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    columns = [
        {
            title: "娃哈哈",
            dataIndex: "taskItemNo",
            key: "taskItemNo",
            width: 230,
        },
        {
            title: "娃哈哈",
            dataIndex: "formNo",
            key: "formNo",
            width: 200,
        },
        {
            title: "娃哈哈",
            dataIndex: "location",
            key: "location",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "bin",
            key: "bin",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "owner",
            key: "owner",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "partClass",
            key: "partClass",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "grnNo",
            key: "grnNo",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "partNo",
            key: "partNo",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "keyword",
            key: "keyword",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "inventoryQty",
            key: "qoh",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "unitOfQty",
            key: "unitOfQty",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "inventoryQty",
            key: "inventoryQty",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "aup",
            key: "aup",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "value",
            key: "value",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "confirmStatus",
            key: "confirmStatus",
            width: 180,
        },
        {
            title: "娃哈哈",
            dataIndex: "confirmedAt",
            key: "confirmedAt",
            width: 170,
        },
        {
            title: "娃哈哈",
            dataIndex: "confirmedBy",
            key: "confirmedBy",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "approvalStatus",
            key: "approvalStatus",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "approvedAt",
            key: "approvedAt",
            width: 170,
        },
        {
            title: "娃哈哈",
            dataIndex: "approvedBy",
            key: "approvedBy",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "adjustmentStatus",
            key: "adjustmentStatus",
            width: 150,
        },
        {
            title: "娃哈哈",
            dataIndex: "adjustmentAction",
            key: "adjustmentAction",
            width: 155,
        },
        {
            title: "娃哈哈",
            dataIndex: "adjustedAt",
            key: "adjustedAt",
            width: 170,
        },
        {
            title: "娃哈哈",
            dataIndex: "adjustedBy",
            key: "adjustedBy",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "status",
            key: "status",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "stockTakeRequired",
            key: "stockTakeRequired",
            width: 160,
        },
        {
            title: "娃哈哈",
            dataIndex: "documents",
            key: "documents",
            width: 160,
        },
        {
            title: "娃哈哈",
            dataIndex: "checkBy",
            key: "checkBy",
            width: 170,
        },
        {
            title: "娃哈哈",
            dataIndex: "lastCheckDate",
            key: "lastCheckDate",
            width: 170,
        },
        {
            title: "娃哈哈",
            dataIndex: "assignedTo",
            key: "assignedTo",
            width: 170,
        },
        {
            title: "娃哈哈",
            dataIndex: "assignedAt",
            key: "assignedAt",
            width: 170,
        },
        {
            title: "娃哈哈",
            dataIndex: "assignedBy",
            key: "assignedBy",
            width: 170,
        },
        {
            title: "娃哈哈",
            dataIndex: "updatedBy",
            key: "updatedBy",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "updatedAt",
            key: "updatedAt",
            width: 170,
        },
        {
            title: "娃哈哈",
            dataIndex: "createdBy",
            key: "createdBy",
            width: 120,
        },
        {
            title: "娃哈哈",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 140,
            render: (date) => date && dayJs(date).format("YYYY-MM-DD HH:mm:ss"),
        },
    ];

    toLogin = () => {
        const { dispatch } = this.props;
        dispatch(actions.toLogin());
    };

    render() {
        const { source, location } = this.props;

        return (
            <article className="ro-module-wrap ro-table-module">
                <div className="ro-table-wrap">
                    <TableComponent
                        title="customer table"
                        // OperationAction={<span>567</span>}
                        showSelects
                        showNumber
                        onDownload={this.toLogin}
                        onAdd
                        columns={this.columns}
                        dataSource={source ? source.list : null}
                    />
                </div>
            </article>
        );
    }
}

const mapStateToProps = (state) => ({
    source: state.app.table.table,
});

export default connect(mapStateToProps)(Main);
