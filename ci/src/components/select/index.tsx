import { useEffect, useState } from "react";
import { Select, SelectProps } from "antd";
import { BaseOptionType, DefaultOptionType } from "antd/lib/select";
import "./index.less";

interface PageTitleProps extends SelectProps<any, BaseOptionType | DefaultOptionType> {
    keyName?: string;
    labelName?: string;
    onChange: (...args: any[]) => void;
}

export function BaseSelect(props: PageTitleProps) {
    const { onChange, value, children, onBlur, onFocus, size, ...antdProps } = props;

    const [dataSource, setDataSource] = useState<{ label: string; value: any }[]>([]);

    useEffect(() => {
        setTimeout(() => {
            const source = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => ({ label: `天下第${item}`, value: `${item}` }));
            setDataSource(source);
        }, 1000);
    }, []);
    // console.log("--select--", props);
    return (
        <div className="ro-select-container">
            <Select
                options={dataSource}
                mode="multiple"
                // value={null}
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
