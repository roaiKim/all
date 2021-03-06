import React, { useState } from "react";
import { PlusCircleOutlined } from "@icon";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";
import { Collapse, Input, Table } from "antd";
import { DataDictionaryRecords, SubTree } from "../type";
import { PageLimitResponse } from "type";
import { actions } from "module/data-dictionary";
import InputModal from "./InputModal";

const { Panel } = Collapse;

interface DataDictionaryProps extends DispatchProp {
    records: DataDictionaryRecords | null;
    subTrees: Record<string, SubTree[]>;
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

interface TreeContent {
    code: string;
    text: string;
}

async function transformChineseToPinYin(chinese: string) {
    const { pinyin } = await import(/* webpackChunkName: "pinyin-pro-s" */ "pinyin-pro");
    return pinyin(chinese, { toneType: "none", type: "array" });
}

function DataDictionary(props: DataDictionaryProps) {
    const { records, subTrees, dispatch } = props;
    const [adding, setAdding] = useState(false);
    const [subTree, setSubTree] = useState<TreeContent | null>(null);
    const [inputValue, setInputValue] = useState("");

    const onAddTreeOuter = (config: boolean) => setAdding(config);

    const closeAddStatus = () => {
        setAdding(false);
        setInputValue("");
    };

    const onTreeCreateOrUpdate = async () => {
        if (inputValue) {
            const py = await transformChineseToPinYin(inputValue);
            const code = py.join("_").toUpperCase();
            if (!records) {
                // 新增
                const pramas = {
                    content: JSON.stringify([
                        {
                            code,
                            text: inputValue,
                        },
                    ]),
                };
                dispatch(actions.createTree(pramas, closeAddStatus));
            } else {
                const { content: stringContent } = records;
                const content = JSON.parse(stringContent);
                const pramas = {
                    content: JSON.stringify([
                        ...content,
                        {
                            code,
                            text: inputValue,
                        },
                    ]),
                };
                dispatch(actions.updateTree(pramas, closeAddStatus));
            }
        } else {
            // setAdding(false);
        }
    };

    const onAddSubTree = async (text: string) => {
        if (text) {
            const py = await transformChineseToPinYin(text);
            const code = py.join("_").toUpperCase();
            const pramas = { code, text };
            dispatch(actions.addSubTree(subTree!.code, pramas, closeAddStatus));
        }
    };

    const tree = JSON.parse(records?.content || "[]");

    return (
        <div className="ro-data-dictionary-module-container">
            <InputModal show={!!subTree} setShow={setSubTree} onSubmit={onAddSubTree}></InputModal>
            <div className="ro-tree-container">
                <Collapse
                    accordion
                    ghost
                    onChange={(key) => {
                        if (!(subTrees && subTrees[key as string])) {
                            dispatch(actions.getSubTree(key as string));
                        }
                    }}
                >
                    {tree.map((item: TreeContent) => (
                        <Panel header={item.text} key={item.code}>
                            {subTrees[item.code] ? subTrees[item.code]?.map((item1) => <span key={item1.code}>{item1.text}</span>) : null}
                            <PlusCircleOutlined onClick={() => setSubTree(item)} style={{ fontSize: 16, cursor: "pointer", marginLeft: 25 }} />
                        </Panel>
                    ))}
                    <div className="ro-tree-add-btn">
                        {adding ? (
                            <div>
                                <Input
                                    onChange={(event) => setInputValue(event.target.value)}
                                    onBlur={onTreeCreateOrUpdate}
                                    placeholder="请输入类型"
                                    bordered={false}
                                />
                            </div>
                        ) : (
                            <PlusCircleOutlined onClick={() => onAddTreeOuter(true)} style={{ fontSize: 16, cursor: "pointer" }} />
                        )}
                    </div>
                </Collapse>
            </div>
            <div className="ro-table-container">{/* <Table rowKey="id" columns={columns} dataSource={records || []} /> */}</div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    records: state.app.dataDictionary.records,
    subTrees: state.app.dataDictionary.subTrees,
});

export default connect(mapStateToProps)(DataDictionary);
