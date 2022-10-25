import React, { useMemo, useState } from "react";
import { Select } from "antd";
import { observer } from "@formily/react";
import { Form } from "@formily/core";

interface AdvancedSelectProps {
    defaultValue?: any[];
    optionLabel?: string; // 下拉选择中 options显示的值
    optionValue?: string | number; // 下拉选择中 options的value
    options?: any[]; // list 数组 可以配合 optionLabel optionValue
    text?: string; // data-dictionary 数据字典
    url?: string | ((...arg: any[]) => any[]);
    form?: Form<any>;
}

function select(props: AdvancedSelectProps) {
    const { options, optionLabel, optionValue, text, url, form } = props;

    const [type] = useState(() => {
        if (options) {
            return 1;
        } else if (text) {
            return 2;
        } else if (url) {
            if (typeof url === "string") {
                return 3;
            } else if (typeof url === "function") {
                return 4;
            }
        } else {
            throw new Error("AdvancedSelect组件参数缺少, options, text, url 不能同时为空");
        }
    });
    console.log("--form--", form?.values.input);
    const [optionsList, setOptionsList] = useState(() => {
        if (options) {
            if (optionValue || optionLabel) {
                return options.map((item) => ({
                    label: item[optionLabel || "name"],
                    value: item[optionValue || "id"],
                }));
            }
            return options;
        }
        return [];
    });

    return (
        <Select
            // mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="Please select"
            // defaultValue={["a10", "c12"]}
            options={optionsList}
            onChange={() => {}}
        ></Select>
    );
}

export const AdvancedSelect = observer(select);
