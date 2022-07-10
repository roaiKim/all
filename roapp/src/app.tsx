import { Component } from "react";
import { Provider } from "react-redux";
import { app } from "../core/app";
import "./app.less";

class App extends Component {
    componentDidMount() {}

    componentDidShow() {}

    componentDidHide() {}

    componentDidCatchError() {}

    // this.props.children 是将要会渲染的页面
    render() {
        return <Provider store={app.store}>{this.props.children}</Provider>;
    }
}

export default App;
