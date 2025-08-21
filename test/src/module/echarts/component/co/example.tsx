import { useMemo } from "react";
import { Popover, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { EchartsTreeState } from "../config";

const format = (example) => {
    const u = [];
    example.forEach((item) => {
        const items = item.split("\n").map((item) => item.slice(0, 100));
        u.push(...items);
    });
    return u;
};

export function Example({ example }: { example: string[] }) {
    return (
        <Popover
            content={
                <pre>
                    {format(example).map((item) => (
                        <p key={item}>{item}</p>
                    ))}
                </pre>
            }
            title="示例"
            trigger={["click"]}
        >
            <p style={{ color: "red", cursor: "pointer" }}>示例</p>
        </Popover>
    );
}
