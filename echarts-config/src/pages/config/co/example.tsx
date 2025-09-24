import { Popover } from "antd";

const format = (example) => {
    const u = [];
    example.forEach((item) => {
        const items = item.split("\n").map((item) => item.slice(0, 100));
        u.push(...items);
    });
    return u;
};

export function Example({ example }: { example: string[] | null }) {
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
