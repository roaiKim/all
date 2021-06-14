import React from "react";
import {
    Form, Input, Button, Checkbox,
} from "antd";
import "./index.less";
import { connect } from "react-redux";
import { actions } from "module/main";
import Loading from "aComponent/Loading";

class Main extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            videoComplete: false,
        };
    }

  submit = (value) => {
      const { dispatch } = this.props;
      dispatch(actions.login(value));
  };

  videoLoaded = () => {
      this.setState({ videoComplete: true });
  }

  render() {
      const { videoComplete } = this.state;

      return (
          <div className="ro-login-wrap-bg">
              {!videoComplete && <Loading />}
              <div className="ro-form-wrap" style={{ opacity: videoComplete ? 1 : 0 }}>
                  <video className="ro-login-vider-bg" autoPlay muted loop onLoadedData={this.videoLoaded}>
                      <source src="https://public-upsky.oss-cn-shenzhen.aliyuncs.com/bg.mp4" type="video/mp4" />
                      <track default kind="captions" srcLang="en" />
                  </video>
                  <div className="ro-login-wrap">
                      <Form
                          name="basic"
                          initialValues={{ remember: true }}
                          onFinish={this.submit}
                      >
                          <Form.Item
                              name="name"
                              rules={[{ required: true, message: "Please input your username!" }]}
                          >
                              <Input size="large" placeholder="请输入用户名" />
                          </Form.Item>

                          <Form.Item
                              name="password"
                              rules={[{ required: true, message: "Please input your password!" }]}
                          >
                              <Input.Password size="large" placeholder="请输入密码" />
                          </Form.Item>

                          <Form.Item name="remember" valuePropName="checked">
                              <Checkbox>记住我</Checkbox>
                          </Form.Item>
                          <Form.Item>
                              <Button type="primary" htmlType="submit"> 登录 </Button>
                          </Form.Item>
                      </Form>
                  </div>
              </div>
          </div>
      );
  }

}

export default connect()(Main);
