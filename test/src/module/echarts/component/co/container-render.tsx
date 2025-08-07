import { PropsWithChildren, useMemo } from "react";
import classNames from "classnames";
import { EchartsTreeState } from "../config";

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
    const cyclicKey = useMemo(() => {
        return [parentkey, id].filter(Boolean).join(".");
    }, [parentkey, id]);

    const [containerClass, childrenClass] = useMemo(() => {
        return [
            classNames({ "ec-container-box": level == 1, "ec-children-box": level > 1 }),
            classNames({ "ec-container-desc": level == 1, "ec-children-desc": level > 1 }),
        ];
    }, [level]);

    console.log("---cyclicKey---", cyclicKey);
    return (
        <div className={containerClass}>
            <span>{field.name}</span>
            <span>{field.description}</span>
            <OnlyRender condition={!!descendant?.length}>
                <div className={childrenClass}>
                    <OnlyRender condition={level > 1}>
                        <span>{field.name}</span>
                        <span>{field.description}</span>
                    </OnlyRender>
                    {descendant?.map((item) => (
                        <ContainerRender parentkey={cyclicKey} key={item.id} field={item} />
                    ))}
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
