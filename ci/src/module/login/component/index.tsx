import React, { useState } from "react";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";
import { actions } from "module/login";
import { CompanyInfoResponse } from "type";
import { object, string } from "yup";

interface LoginProps extends DispatchProp {
    companyInfo: CompanyInfoResponse | null;
}

interface LoginState {
    username: string;
    password: string;
}

function Login(props: LoginProps) {
    const { companyInfo } = props;
    const { logo } = companyInfo || {};

    const [state, setState] = useState<LoginState>({
        username: "",
        password: "",
    });

    const onChange = (record: Partial<LoginState>) => {
        setState((prevState) => ({ ...prevState, ...record }));
    };

    const onSubmit = () => {
        const longinSchema = object().shape({
            password: string().required("请输入密码"),
            username: string().required("请输入用户名"),
        });
        longinSchema
            .validate(state)
            .then(() => {
                const { dispatch } = props;
                dispatch(actions.login(state.username, state.password));
            })
            .catch((error) => {
                // Toast.show((error.errors || [])[0] || error);
            });
    };

    return (
        <div className="ro-login-module">
            <div className="ro-logo">{logo && <img src={logo} alt="logo"></img>}</div>
            <div className="ro-login-container">
                <input
                    value={state.username}
                    type="text"
                    placeholder="用户名"
                    onChange={(event) => {
                        onChange({ username: event.target.value });
                    }}
                ></input>
                <input
                    value={state.password}
                    type="password"
                    placeholder="密码"
                    onChange={(event) => {
                        onChange({ password: event.target.value });
                    }}
                ></input>
                <button onClick={onSubmit}>登录</button>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    companyInfo: state.app.login.companyInfo,
});

export default connect(mapStateToProps)(Login);
