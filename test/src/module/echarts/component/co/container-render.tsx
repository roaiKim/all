import { PropsWithChildren, useContext, useMemo, useState } from "react";
import classNames from "classnames";
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
            <span>{field.name}</span>
            <p className="ec-description">{field.description?.slice(0, 15)}</p>
            <OnlyRender condition={!!descendant?.length && (isFold || isTopLevel)}>
                <div className={childrenClass} style={{ borderColor: "inherit" }}>
                    <OnlyRender condition={level > 1}>
                        <span>{field.name}</span>
                        <p className="ec-description">{field.description?.slice(0, 15)}</p>
                    </OnlyRender>
                    {descendant?.map((item) => (
                        <ContainerRender parentkey={cyclicKey} key={item.id} field={item} />
                    ))}
                </div>
            </OnlyRender>
            <OnlyRender condition={!!descendant?.length && level > 1}>
                <div
                    className={classNames("ec-fold", { "is-fold": isFold })}
                    onClick={() => {
                        calcPath(cyclicKey);
                    }}
                ></div>
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
