import React from "react";
import { UserOutlined, ShoppingCartOutlined, CameraOutlined, CarOutlined } from "@icon";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";
import { Table } from "antd";
import { DataDictionaryRecords } from "../type";
import { PageLimitResponse } from "type";

interface DataDictionaryProps extends DispatchProp {
    records: PageLimitResponse<DataDictionaryRecords[]> | null;
}

function DataDictionary(props: DataDictionaryProps) {
    const columns = [
        {
            title: "data",
            dataIndex: "code",
        },
        {
            title: "text",
            dataIndex: "text",
        },
        {
            title: "content",
            dataIndex: "content",
        },
        {
            title: "description",
            dataIndex: "description",
        },
    ];

    const { records } = props;
    console.log(records);
    return (
        <div className="ro-example-component-container">
            <div style={{ width: 300 }}>
                <Table columns={columns} dataSource={records?.list || []} />
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    records: state.app.dataDictionary.records,
});

export default connect(mapStateToProps)(DataDictionary);
