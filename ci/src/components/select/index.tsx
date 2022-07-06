import { Button, Select } from "antd";
import { useEffect, useState } from "react";
import { SetView, ViewState } from "utils/hooks/usePageModal";
import "./index.less";

export interface CustomerFormComponentProps<T = any> {
    onChange: (...args: T[]) => T;
}

interface PageTitleProps extends CustomerFormComponentProps {
    keyName?: string;
    labelName?: string;
}

export function BaseSelect(props: PageTitleProps) {
    const { onChange } = props;

    const [dataSource, setDataSource] = useState<{ label: string; value: any }[]>([]);

    useEffect(() => {
        setTimeout(() => {
            const source = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => ({ label: `天下第${item}`, value: `${item}` }));
            setDataSource(source);
        }, 3000);
    }, []);
    console.log("--select--", props);
    return (
        <div className="ro-select-container">
            <Select
                options={dataSource}
                // mode="multiple"
                allowClear
                onChange={(value) => {
                    if (!value?.length) {
                        onChange([]);
                    } else {
                        const source = [];
                        if (Array.isArray(value) && value.length) {
                            dataSource.forEach((item) => {
                                if (value.includes(item.value)) {
                                    source.push(item);
                                }
                            });
                            onChange(source);
                        } else {
                            const values = dataSource.find((item) => item.value === value) || [];
                            console.log("-select-values-", value, dataSource);
                            onChange([values["value"], values["label"]], values);
                        }
                    }
                    console.log("--values--", value);
                }}
                size="small"
            ></Select>
        </div>
    );
}
