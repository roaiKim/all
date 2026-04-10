import React, { useState } from "react";
import { connect, type DispatchProp, useDispatch } from "react-redux";
import { useLoadingStatus } from "@core";
import { message } from "antd";
import { LockOutlined, SafetyCertificateOutlined, ThunderboltOutlined, UserOutlined } from "@ant-design/icons";
import { BubbleField } from "components/bubble-field";
import { LoginClock } from "components/login-clock";
import { ProxySelector } from "components/proxy-selector";
import { LOGIN_REMEMBER_PASSWORD, LOGIN_REMEMBER_USERNAME } from "config/static-constant";
import { actions } from "module/common/login";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import { decrypted, encrypted } from "utils/function/crypto";
import { StorageService } from "utils/StorageService";
import "./index.less";

interface LoginProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

interface LoginState {
    username: string;
    password: string;
}

function Login(props: LoginProps) {
    const { companyInfo } = props;
    const { logo, headerLogo, platformName } = companyInfo || {};
    const brandLogo = logo || headerLogo;
    const brandName = platformName || "Rosen CI";
    const loading = useLoadingStatus("login-loading");
    const dispatch = useDispatch();

    const [state, setState] = useState<LoginState>(() => {
        const userName = StorageService.get<string>(encrypted(LOGIN_REMEMBER_USERNAME));
        const password = StorageService.get<string>(encrypted(LOGIN_REMEMBER_PASSWORD));

        return {
            username: decrypted(userName || ""),
            password: decrypted(password || ""),
        };
    });

    const onChange = (record: Partial<LoginState>) => {
        setState((prevState) => ({ ...prevState, ...record }));
    };

    const onSubmit = () => {
        if (!state.username || !state.password) {
            message.success("请输入账号和密码");
            return;
        }

        StorageService.set<string>(encrypted(LOGIN_REMEMBER_USERNAME), encrypted(state.username));
        StorageService.set<string>(encrypted(LOGIN_REMEMBER_PASSWORD), encrypted(state.password));
        dispatch(actions.login(state.username, state.password));
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            onSubmit();
        }
    };

    return (
        <div className={joinLessPrefix("login-module")}>
            <BubbleField
                bubbleCount={18}
                className={joinLessPrefix("login-bubble-field")}
                density="normal"
                horizontalRanges={[
                    [4, 60],
                    [80, 96],
                ]}
                sidesOnly
            />
            <div className={joinLessPrefix("login-shell")}>
                <div className={joinLessPrefix("login-window")}>
                    <div className={joinLessPrefix("window-toolbar")}>
                        <div className={joinLessPrefix("window-controls")}>
                            <span className={`${joinLessPrefix("window-control")} ${joinLessPrefix("window-close")}`}></span>
                            <span className={`${joinLessPrefix("window-control")} ${joinLessPrefix("window-minimize")}`}></span>
                            <span className={`${joinLessPrefix("window-control")} ${joinLessPrefix("window-zoom")}`}></span>
                        </div>
                        <div className={joinLessPrefix("window-title")}>{brandName}</div>
                    </div>
                    <div className={joinLessPrefix("login-panel")}>
                        <div className={joinLessPrefix("login-sidebar")}>
                            <div className={joinLessPrefix("login-brand")}>
                                <div className={joinLessPrefix("logo")}>
                                    {brandLogo ? <img src={brandLogo} alt={brandName}></img> : <span>{brandName.slice(0, 1)}</span>}
                                </div>
                                <div className={joinLessPrefix("login-brand-copy")}>
                                    <span className={joinLessPrefix("login-eyebrow")}>macOS Workspace</span>
                                    <h1>{brandName}</h1>
                                    <p>像 Mac 桌面一样干净、柔和，登录后继续你的工作流。</p>
                                </div>
                            </div>
                            <LoginClock />
                            <div className={joinLessPrefix("login-preview")}>
                                <div className={joinLessPrefix("preview-header")}>
                                    <span>今日工作台</span>
                                    <span>实时同步</span>
                                </div>
                                <div className={`${joinLessPrefix("preview-card")} ${joinLessPrefix("preview-card-primary")}`}>
                                    <strong>已连接到协作空间</strong>
                                    <p>项目、订单与关键流程将在登录后同步到你的桌面视图。</p>
                                </div>
                                <div className={joinLessPrefix("preview-grid")}>
                                    <div className={joinLessPrefix("preview-card")}>
                                        <span className={joinLessPrefix("login-highlight-icon")}>
                                            <SafetyCertificateOutlined />
                                        </span>
                                        <div>
                                            <strong>安全认证</strong>
                                            <p>保持访问权限和账号校验统一管理。</p>
                                        </div>
                                    </div>
                                    <div className={joinLessPrefix("preview-card")}>
                                        <span className={`${joinLessPrefix("login-highlight-icon")} ${joinLessPrefix("login-highlight-icon-alt")}`}>
                                            <ThunderboltOutlined />
                                        </span>
                                        <div>
                                            <strong>高效协同</strong>
                                            <p>快速进入任务、跟进节点、保持交付节奏。</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={joinLessPrefix("login-main")}>
                            <div className={joinLessPrefix("login-card")}>
                                <div className={joinLessPrefix("login-card-header")}>
                                    <span className={joinLessPrefix("login-tag")}>Sign In</span>
                                    <h2>欢迎回来</h2>
                                    <p>请使用你的账号登录，像打开 Mac 应用一样继续当前工作。</p>
                                </div>
                                <div className={joinLessPrefix("login-container")}>
                                    <label className={joinLessPrefix("login-field")}>
                                        <span className={joinLessPrefix("login-field-label")}>用户名</span>
                                        <div className={joinLessPrefix("login-input")}>
                                            <span className={joinLessPrefix("login-input-icon")}>
                                                <UserOutlined />
                                            </span>
                                            <input
                                                autoComplete="username"
                                                value={state.username}
                                                type="text"
                                                placeholder="请输入用户名"
                                                onChange={(event) => {
                                                    onChange({ username: event.target.value });
                                                }}
                                                onKeyDown={onKeyDown}
                                            ></input>
                                        </div>
                                    </label>
                                    <label className={joinLessPrefix("login-field")}>
                                        <span className={joinLessPrefix("login-field-label")}>密码</span>
                                        <div className={joinLessPrefix("login-input")}>
                                            <span className={joinLessPrefix("login-input-icon")}>
                                                <LockOutlined />
                                            </span>
                                            <input
                                                autoComplete="current-password"
                                                value={state.password}
                                                type="password"
                                                placeholder="请输入密码"
                                                onChange={(event) => {
                                                    onChange({ password: event.target.value });
                                                }}
                                                onKeyDown={onKeyDown}
                                            ></input>
                                        </div>
                                    </label>
                                    <button disabled={loading} type="button" onClick={onSubmit}>
                                        {loading ? "登录中..." : "登录"}
                                    </button>
                                </div>
                                <div className={joinLessPrefix("login-footer")}>
                                    <span>建议使用已开通权限的账号登录，如有异常请联系管理员。</span>
                                </div>
                                <ProxySelector />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    companyInfo: state.app.login.companyInfo,
});

export default connect(mapStateToProps)(Login);
