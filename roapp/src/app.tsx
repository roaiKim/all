import { window } from "@tarojs/runtime";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import AppLoading from "./app.loading";
import { app } from "../core/app";
import "./app.less";

if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.global._REDEX_STORE_RO = () => app.store.getState();
}

// class App extends Component {
//     componentDidMount() {}

//     componentDidShow() {}

//     componentDidHide() {}

//     componentDidCatchError() {}

//     // this.props.children 是将要会渲染的页面
//     render() {
//         return <Provider store={app.store}>{this.props.children}</Provider>;
//     }
// }

function App(props: PropsWithChildren<any>) {
    const { children } = props;
    return (
        <Provider store={app.store}>
            <AppLoading>{children}</AppLoading>
        </Provider>
    );
}

export default App;
