import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { roApp } from "@core";
import MainComponent from "pages/main";
import { bootstrap } from "utils/bootstrap";
import AppLoading from "./app.loading";
import "asset/less/index.less";
import "./app.less";

import "asset/style/taro-ui.scss";

bootstrap();

function App(props: PropsWithChildren<any>) {
    const { children } = props;
    return (
        <Provider store={roApp.store}>
            <MainComponent></MainComponent>
            <AppLoading>{children}</AppLoading>
        </Provider>
    );
}

export default App;
