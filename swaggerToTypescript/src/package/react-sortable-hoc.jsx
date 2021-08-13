import React from "react";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import arrayMove from 'array-move';

const SortableItem = SortableElement(({value}) => <li className="rol-li" style={{padding: 15, border: "1px solid red", width: 260, cursor: "grab"}}>{value}</li>);

const SortableList = SortableContainer(({items}) => {
  return (
    <ul style={{width: 320, border: "1px solid blue"}}>
      {items.map(({key, title}, index) => (
        <SortableItem key={`item-${key}`} index={index} value={title} />
      ))}
    </ul>
  );
});

export default class SortableComponent extends React.Component {
  state = {
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10', 'Item 11', 'Item 12'],
    columns: [
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
            width: 140,
            render: (date) => date && dayJs(date).format("YYYY-MM-DD HH:mm:ss"),
        },
    ]
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    console.log("dasda ", oldIndex, newIndex);
    if (oldIndex === newIndex) {
        return false;
    }
    this.setState(({columns}) => ({
        columns: arrayMove(columns, oldIndex, newIndex),
    }));
  };

  render() {
    console.log("render");
    return <SortableList items={this.state.columns} onSortEnd={this.onSortEnd} />;
  }
}

