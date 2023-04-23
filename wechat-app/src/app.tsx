import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { app } from "core/app";
import AppLoading from "./app.loading";
import { cacheServices } from "./utils/service-register";
import "./app.less";

console.log("---cacheServices--", cacheServices);

function App(props: PropsWithChildren<any>) {
    const { children } = props;

    return (
        <Provider store={app.store}>
            <AppLoading>{children}</AppLoading>
        </Provider>
    );
}

export default App;
