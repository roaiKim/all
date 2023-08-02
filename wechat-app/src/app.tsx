import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { bootstrap } from "utils/bootstrap";
import { app } from "core/app";
import "taro-ui/dist/style/index.scss";
import "asset/less/index.less";
import AppLoading from "./app.loading";
import "./app.less";

bootstrap();

function App(props: PropsWithChildren<any>) {
    const { children } = props;

    return (
        <Provider store={app.store}>
            <AppLoading>{children}</AppLoading>
        </Provider>
    );
}

export default App;
