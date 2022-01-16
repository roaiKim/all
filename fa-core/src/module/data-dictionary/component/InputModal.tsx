import React, { useState } from "react";
import { PlusCircleOutlined } from "@icon";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";
import { Collapse, Input, Modal, Table } from "antd";
import { DataDictionaryRecords } from "../type";
import { PageLimitResponse } from "type";
import { actions } from "module/data-dictionary";

interface InputModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

function InputModal(props: InputModalProps) {
    const { show, setShow } = props;
    const [inputValue, setInputValue] = useState("");

    const handleClose = () => {
        setShow(false);
        setInputValue("");
    };

    const handleOk = () => {
        //
        handleClose();
    };

    return (
        <Modal title="--" visible={show} onOk={handleOk} onCancel={handleClose}>
            <Input
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="请输入"
                // bordered={false}
            />
        </Modal>
    );
}

export default InputModal;
