import React, { useState } from "react";
import { PlusCircleOutlined } from "@icon";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";
import { Collapse, Input, Table } from "antd";
import { DataDictionaryRecords } from "../type";
import { PageLimitResponse } from "type";

const { Panel } = Collapse;

interface DataDictionaryProps extends DispatchProp {
    records: PageLimitResponse<DataDictionaryRecords[]> | null;
}

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

function DataDictionary(props: DataDictionaryProps) {
    const { records } = props;
    const [addiong, setAdding] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const text = `A dog is a type of domesticated animal.`;

    const onAddTreeOuter = (config: boolean) => setAdding(config);

    const onInputBlur = () => {
        if (inputValue) {
            alert("inputValue -- " + inputValue);
        }
    };

    return (
        <div className="ro-data-dictionary-module-container">
            <div className="ro-tree-container">
                <Collapse accordion ghost>
                    <Panel header="This is panel header 1" key="1">
                        <p>{text}</p>
                    </Panel>
                    <Panel header="This is panel header 2" key="2">
                        <p>{text}</p>
                    </Panel>
                    <div className="ro-tree-add-btn">
                        {addiong ? (
                            <div>
                                <Input
                                    onChange={(event) => setInputValue(event.target.value)}
                                    onBlur={onInputBlur}
                                    placeholder="请输入类型"
                                    bordered={false}
                                />
                            </div>
                        ) : (
                            <PlusCircleOutlined
                                onClick={() => onAddTreeOuter(true)}
                                style={{ fontSize: 16, cursor: "pointer" }}
                            />
                        )}
                    </div>
                </Collapse>
            </div>
            <div className="ro-table-container">
                <Table rowKey="id" columns={columns} dataSource={records?.list || []} />
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    records: state.app.dataDictionary.records,
});

export default connect(mapStateToProps)(DataDictionary);
