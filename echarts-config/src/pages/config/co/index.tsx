import { useContext, useMemo } from "react";
import { Popover, Tag } from "antd";
import classNames from "classnames";
import { Container } from "./container";
import { DescriptView } from "./descript-view";
import { Example } from "./example";
import { RenderBy } from "./only-render";
import type { EchartsTreeState } from "../config";

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
            classNames({ "ec-row": true, "ec-container-desc": level == 1, "ec-children-desc": level > 1 }),
        ];
    }, [level]);

    const isFold = expandPath.includes(cyclicKey);
    if (isTopLevel) {
        console.log("---field---", field);
    }

    return (
        <div style={{ borderColor: isFold ? "red" : "#ccc" }} className={containerClass}>
            <div>
                <Tag style={{ fontSize: 14, padding: 5, borderRadius: 5 }} color="purple">
                    {field.name}
                </Tag>
            </div>
            <DescriptView description={field.description} shortDescroption={field.shortDescroption} />
            <RenderBy when={!!example?.length}>
                <Example example={example} />
            </RenderBy>
            <RenderBy when={!!descendant?.length && (isFold || isTopLevel)}>
                <div className={childrenClass} style={{ borderColor: "inherit" }}>
                    <RenderBy when={level > 1}>
                        <Tag style={{ fontSize: 14, padding: 5, borderRadius: 5 }} color="purple">
                            {field.name}
                        </Tag>
                    </RenderBy>
                    {descendant?.map((item) => (
                        <Main parentkey={cyclicKey} key={item.id} field={item} />
                    ))}
                </div>
            </RenderBy>
            <Container field={field} cyclicKey={cyclicKey} parentkey={parentkey} />
            <RenderBy when={!!descendant?.length && level > 1}>
                <div
                    onClick={() => {
                        calcPath(cyclicKey);
                    }}
                >
                    <div className={classNames("ec-arrow-container", { "is-fold": isFold })}></div>
                    <RenderBy when={isFold}>
                        <div className="ec-arrow-right">{/* <div className="ec-arrow-right" title="向右箭头"></div> */}</div>
                    </RenderBy>
                </div>
            </RenderBy>
        </div>
    );
}
