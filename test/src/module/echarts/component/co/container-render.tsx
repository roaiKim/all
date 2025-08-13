import { PropsWithChildren, useContext, useMemo, useState } from "react";
import { Tag, Tooltip } from "antd";
import classNames from "classnames";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { EchartsTreeState } from "../config";

import { expandPathContext } from "..";

interface ContainerRenderProps {
    field: EchartsTreeState;
    parentkey: string;
}

interface OnlyRenderProps {
    condition: boolean;
}

export function OnlyRender(props: PropsWithChildren<OnlyRenderProps>) {
    const { condition, children } = props;
    if (!condition) {
        return null;
    }
    return <>{children}</>;
}

export function DescriptView(props: Pick<EchartsTreeState, "shortDescroption" | "description">) {
    const { shortDescroption, description } = props;
    if (!description?.length) {
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
            <p className="ec-description">{shortDescroption}</p>
        </Tooltip>
    );
}

export function ContainerRender(props: ContainerRenderProps) {
    const { field, parentkey } = props;
    const { descendant = [], level, id } = field;
    const { expandPath = [], calcPath } = useContext(expandPathContext);
    const isTopLevel = level === 1;
    const cyclicKey = useMemo(() => [parentkey, id].filter(Boolean).join("."), [parentkey, id]);

    const [containerClass, childrenClass] = useMemo(() => {
        return [
            classNames({ "ec-container-box": level == 1, "ec-children-box": level > 1, [`level-${level}`]: true }),
            classNames({ "ec-container-desc": level == 1, "ec-children-desc": level > 1 }),
        ];
    }, [level]);

    const isFold = expandPath.includes(cyclicKey);

    // console.log("---cyclicKey---", cyclicKey);
    // console.log("---expandPath---", expandPath, cyclicKey, expandPath.includes(cyclicKey));
    console.log("---expandPath---", isFold);
    return (
        <div style={{ borderColor: isFold ? "red" : "#ccc" }} className={containerClass}>
            <span>
                <Tag style={{ fontSize: 14, padding: 5, borderRadius: 5 }} color="purple">
                    {field.name}
                </Tag>
            </span>
            <DescriptView description={field.description} shortDescroption={field.shortDescroption} />
            <OnlyRender condition={!!descendant?.length && (isFold || isTopLevel)}>
                <div className={childrenClass} style={{ borderColor: "inherit" }}>
                    <OnlyRender condition={level > 1}>
                        <Tag style={{ fontSize: 14, padding: 5, borderRadius: 5 }} color="purple">
                            {field.name}
                        </Tag>
                    </OnlyRender>
                    {descendant?.map((item) => (
                        <ContainerRender parentkey={cyclicKey} key={item.id} field={item} />
                    ))}
                </div>
            </OnlyRender>
            <OnlyRender condition={!!descendant?.length && level > 1}>
                <div>
                    <div
                        className={classNames("ec-fold", { "is-fold": isFold })}
                        onClick={() => {
                            calcPath(cyclicKey);
                        }}
                    ></div>
                    <OnlyRender condition={isFold}>
                        <div className="ec-arrow-container">
                            <div className="ec-arrow-right" title="向右箭头"></div>
                        </div>
                    </OnlyRender>
                </div>
            </OnlyRender>
        </div>
    );
}

// export function ChildrenRender(props: ContainerRenderProps) {
//     const { field } = props;
//     const { descendant = [] } = field;
//     console.log("---fffffffff", field);

//     return (
//         <div className="ec-children-container">
//             <span>{field.name}</span>
//             <OnlyRender condition={!!descendant?.length}>
//                 <div className="ec-children-desc">
//                     <span>{field.name}</span>
//                     {descendant?.map((item) => (
//                         <ChildrenRender key={item.id} field={item} />
//                     ))}
//                 </div>
//             </OnlyRender>
//         </div>
//     );
// }
