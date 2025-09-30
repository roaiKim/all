import { AppleOutlined, FacebookOutlined, GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import ChromeTabSvg from "./tab-path";
import "./index.less";

function ChromeStyleTab() {
    return (
        <div className="ro-container ro-chrome-tabs">
            <div className="ro-box">
                <div className="ro-item">
                    <div className="ro-bg">
                        <ChromeTabSvg />
                    </div>
                    <div className="ro-context">
                        <div className="ro-icon">
                            <GithubOutlined />
                        </div>
                        <div className="ro-text">Github</div>
                        <div className="ro-close"></div>
                    </div>
                </div>
                <div className="ro-item">
                    <div className="ro-bg">
                        <ChromeTabSvg />
                    </div>
                    <div className="ro-context">
                        <div className="ro-icon">
                            <GoogleOutlined />
                        </div>
                        <div className="ro-text">Google</div>
                        <div className="ro-close"></div>
                    </div>
                </div>
                <div className="ro-item">
                    <div className="ro-bg">
                        <ChromeTabSvg />
                    </div>
                    <div className="ro-context">
                        <div className="ro-icon">
                            <AppleOutlined />
                        </div>
                        <div className="ro-text">Apple</div>
                        <div className="ro-close"></div>
                    </div>
                </div>
                <div className="ro-item active">
                    <div className="ro-bg">
                        <ChromeTabSvg />
                    </div>
                    <div className="ro-context">
                        <div className="ro-icon">
                            <FacebookOutlined />
                        </div>
                        <div className="ro-text">Fackbook</div>
                        <div className="ro-close"></div>
                    </div>
                </div>
            </div>
            <div className="ro-bottom-bar"></div>
        </div>
    );
}

export default ChromeStyleTab;
