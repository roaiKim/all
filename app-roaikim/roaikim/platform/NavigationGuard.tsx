import React from "react";
import { connect, type DispatchProp, useSelector } from "react-redux";
import { unstable_usePrompt } from "react-router";
import type { State } from "../reducer";

interface NavigationGuardProps {
    message: string;
}

// interface StateProps {
//     isPrevented: boolean;
// }

// interface Props extends OwnProps, StateProps, DispatchProp {}

// class Component extends React.PureComponent<Props, State> {
//     override componentDidUpdate(prevProps: Readonly<Props>): void {
//         const { message, isPrevented } = this.props;
//         if (prevProps.isPrevented !== isPrevented) {
//             window.onbeforeunload = isPrevented ? () => message : null;
//         }
//     }

//     override render() {
//         const { isPrevented, message } = this.props;
//         return <Prompt message={message} when={isPrevented} />;
//     }
// }

// const mapStateToProps = (state: State): StateProps => ({ isPrevented: state.navigationPrevented });

// export const NavigationGuard = connect(mapStateToProps)(Component);

export function NavigationGuard(props: NavigationGuardProps) {
    const navigationPrevented = useSelector((state: State) => state.navigationPrevented);
    unstable_usePrompt({
        when: navigationPrevented,
        message: props?.message || "您确定要离开吗？未保存的更改将丢失！",
    });
    return null;
}
