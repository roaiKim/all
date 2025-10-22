import { BrowserRouter } from "react-router";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./router";
import "./assets/less/index.less";

const app = document.getElementById("app");

if (app) {
    const root = ReactDOM.createRoot(app);

    root.render(
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
}
