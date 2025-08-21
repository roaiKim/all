import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { EchartsTreeState } from "../config";

export function DescriptView(props: Pick<EchartsTreeState, "shortDescroption" | "description">) {
    const { shortDescroption, description } = props;
    if (!description?.length) {
        if (shortDescroption?.length > 30) {
            return (
                <Tooltip placement="topLeft" title={<div>{shortDescroption}</div>}>
                    <p className="ec-description">
                        <QuestionCircleOutlined style={{ fontSize: 14, color: "#108ee9", marginRight: 5 }} />
                        {shortDescroption}
                    </p>
                </Tooltip>
            );
        }
        return <p className="ec-description">{shortDescroption}</p>;
    }
    return (
        <Tooltip
            placement="topLeft"
            title={
                <div>
                    {description?.map((item) => (
                        <p key={item} className="ec-description">
                            {item}
                        </p>
                    ))}
                </div>
            }
        >
            <p className="ec-description">
                <QuestionCircleOutlined style={{ fontSize: 14, color: "#108ee9", marginRight: 5 }} />
                {shortDescroption}
            </p>
        </Tooltip>
    );
}
