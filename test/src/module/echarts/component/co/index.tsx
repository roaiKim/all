import { useContext, useMemo } from "react";
import { Popover, Tag } from "antd";
import classNames from "classnames";
import { Container } from "./container";
import { DescriptView } from "./descript-view";
import { Example } from "./example";
import { OnlyRender } from "./only-render";
import { EchartsTreeState } from "../config";

import { expandPathContext } from "..";

interface MainProps {
    field: EchartsTreeState;
    parentkey: string;
}

export function Main(props: MainProps) {
    const { field, parentkey } = props;
    const { descendant = [], level, id, example } = field;
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
    if (isTopLevel) {
        console.log("---field---", field);
    }
    console.log("---expandPath---", field);
    return (
        <div style={{ borderColor: isFold ? "red" : "#ccc" }} className={containerClass}>
            <span>
                <Tag style={{ fontSize: 14, padding: 5, borderRadius: 5 }} color="purple">
                    {field.name}
                </Tag>
            </span>
            <DescriptView description={field.description} shortDescroption={field.shortDescroption} />
            <OnlyRender condition={!!example?.length}>
                <Example example={example} />
            </OnlyRender>
            <OnlyRender condition={!!descendant?.length && (isFold || isTopLevel)}>
                <div className={childrenClass} style={{ borderColor: "inherit" }}>
                    <OnlyRender condition={level > 1}>
                        <Tag style={{ fontSize: 14, padding: 5, borderRadius: 5 }} color="purple">
                            {field.name}
                        </Tag>
                    </OnlyRender>
                    {descendant?.map((item) => (
                        <Main parentkey={cyclicKey} key={item.id} field={item} />
                    ))}
                </div>
            </OnlyRender>
            <Container field={field} cyclicKey={cyclicKey} parentkey={parentkey} />
            <OnlyRender condition={!!descendant?.length && level > 1}>
                <div
                    onClick={() => {
                        calcPath(cyclicKey);
                    }}
                >
                    <div className={classNames("ec-arrow-container", { "is-fold": isFold })}></div>
                    <OnlyRender condition={isFold}>
                        <div className="ec-arrow-right">{/* <div className="ec-arrow-right" title="向右箭头"></div> */}</div>
                    </OnlyRender>
                </div>
            </OnlyRender>
        </div>
    );
}
