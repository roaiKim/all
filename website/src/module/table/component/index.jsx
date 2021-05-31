import React from "react";
import { connect } from "react-redux";
import { Table } from "antd";
import "./index.less";

class Main extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    columns = [
        {
            className: "text-overflow-ellipsis",
            title: "Stock Take Task No.",
            dataIndex: "taskItemNo",
            key: "taskItemNo",
            width: 230,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Form No.",
            dataIndex: "formNo",
            key: "formNo",
            width: 200,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Store",
            dataIndex: "location",
            key: "location",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Bin",
            dataIndex: "bin",
            key: "bin",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Owner",
            dataIndex: "owner",
            key: "owner",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "PartClass",
            dataIndex: "partClass",
            key: "partClass",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "GRN",
            dataIndex: "grnNo",
            key: "grnNo",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "PartNo",
            dataIndex: "partNo",
            key: "partNo",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Keyword",
            dataIndex: "keyword",
            key: "keyword",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "QOH",
            dataIndex: "inventoryQty",
            key: "qoh",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "UOI",
            dataIndex: "unitOfQty",
            key: "unitOfQty",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Inventory Qty",
            dataIndex: "inventoryQty",
            key: "inventoryQty",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "AUP",
            dataIndex: "aup",
            key: "aup",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Value",
            dataIndex: "value",
            key: "value",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "ConfirmStatus",
            dataIndex: "confirmStatus",
            key: "confirmStatus",
            width: 180,
        },
        {
            className: "text-overflow-ellipsis",
            title: "ConfirmedAt",
            dataIndex: "confirmedAt",
            key: "confirmedAt",
            width: 170,
        },
        {
            className: "text-overflow-ellipsis",
            title: "ConfirmedBy",
            dataIndex: "confirmedBy",
            key: "confirmedBy",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "ApprovalStatus",
            dataIndex: "approvalStatus",
            key: "approvalStatus",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "ApprovedAt",
            dataIndex: "approvedAt",
            key: "approvedAt",
            width: 170,
        },
        {
            className: "text-overflow-ellipsis",
            title: "ApprovedBy",
            dataIndex: "approvedBy",
            key: "approvedBy",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "AdjustmentStatus",
            dataIndex: "adjustmentStatus",
            key: "adjustmentStatus",
            width: 150,
        },
        {
            className: "text-overflow-ellipsis",
            title: "AdjustmentAction",
            dataIndex: "adjustmentAction",
            key: "adjustmentAction",
            width: 155,
        },
        {
            className: "text-overflow-ellipsis",
            title: "AdjustedAt",
            dataIndex: "adjustedAt",
            key: "adjustedAt",
            width: 170,
        },
        {
            className: "text-overflow-ellipsis",
            title: "AdjustedBy",
            dataIndex: "adjustedBy",
            key: "adjustedBy",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Stock Take Status",
            dataIndex: "status",
            key: "status",
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Stock Take Required",
            dataIndex: "stockTakeRequired",
            key: "stockTakeRequired",
            width: 160,
        },
        {
            className: "text-overflow-ellipsis",
            title: "Documents",
            dataIndex: "documents",
            key: "documents",
            excelNotRender: true,
            width: 160,
        },
        {
            className: "text-overflow-ellipsis",
            title: "CompletedBy",
            dataIndex: "checkBy",
            key: "checkBy",
            isNoneRenderColumn: true,
            width: 170,
        },
        {
            className: "text-overflow-ellipsis",
            title: "CompletedAt",
            dataIndex: "lastCheckDate",
            key: "lastCheckDate",
            isNoneRenderColumn: true,
            width: 170,
        },
        {
            className: "text-overflow-ellipsis",
            title: "AssignedTo",
            dataIndex: "assignedTo",
            key: "assignedTo",
            isNoneRenderColumn: true,
            width: 170,
        },
        {
            className: "text-overflow-ellipsis",
            title: "AssignedAt",
            dataIndex: "assignedAt",
            key: "assignedAt",
            isNoneRenderColumn: true,
            width: 170,
        },
        {
            className: "text-overflow-ellipsis",
            title: "AssignedBy",
            dataIndex: "assignedBy",
            key: "assignedBy",
            isNoneRenderColumn: true,
            width: 170,
        },
        {
            className: "text-overflow-ellipsis",
            title: "UpdatedBy",
            dataIndex: "updatedBy",
            key: "updatedBy",
            isNoneRenderColumn: true,
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "UpdatedAt",
            dataIndex: "updatedAt",
            key: "updatedAt",
            isNoneRenderColumn: true,
            width: 170,
        },
        {
            className: "text-overflow-ellipsis",
            title: "CreatedBy",
            dataIndex: "createdBy",
            key: "createdBy",
            isNoneRenderColumn: true,
            width: 120,
        },
        {
            className: "text-overflow-ellipsis",
            title: "CreatedAt",
            dataIndex: "createdAt",
            key: "createdAt",
            isNoneRenderColumn: true,
            width: 170,
        },
    ]

    render() {
        const { table } = this.props;

        return (
            <article className="ro-module-wrap ro-table-module">
                <Table
                    rowKey="id"
                    columns={this.columns}
                    dataSource={table ? table.list : null}
                    scroll={{
                        x: true,
                    }}
                    size="small"
                />
            </article>
        );
    }

}

const mapStateToProps = (state) => ({
    table: state.app.table.table,
});

export default connect(mapStateToProps)(Main);
