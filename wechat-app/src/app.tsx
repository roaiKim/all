import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { bootstrap } from "utils/initiator";
import ErrorHandler from "utils/initiator/errorListener";
import { app } from "core/app";
import AppLoading from "./app.loading";
import "./app.less";

bootstrap({ errorListener: new ErrorHandler() });

function App(props: PropsWithChildren<any>) {
    const { children } = props;

    return (
        <Provider store={app.store}>
            <AppLoading>{children}</AppLoading>
        </Provider>
    );
}

export default App;
