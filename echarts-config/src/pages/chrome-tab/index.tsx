import { FacebookOutlined, GoogleOutlined, LinkedinOutlined } from "@ant-design/icons";
import ChromeTabSvg from "./tab-path";
import "./index.less";

const ChromeTab = () => {
    return (
        <div className="chrome-tabs">
            <div className="chrome-tabs-content">
                <div className="chrome-tab">
                    <div className="chrome-tab-dividers"></div>
                    <div className="chrome-tab-background">
                        <ChromeTabSvg />
                    </div>
                    <div className="chrome-tab-content">
                        <div className="chrome-tab-favicon">
                            <LinkedinOutlined />
                        </div>
                        <div className="chrome-tab-title">X</div>
                        <div className="chrome-tab-close"></div>
                    </div>
                </div>
                <div className="chrome-tab">
                    <div className="chrome-tab-dividers"></div>
                    <div className="chrome-tab-background">
                        <ChromeTabSvg />
                    </div>
                    <div className="chrome-tab-content">
                        <div className="chrome-tab-favicon">
                            <GoogleOutlined />
                        </div>
                        <div className="chrome-tab-title">Google</div>
                        <div className="chrome-tab-close"></div>
                    </div>
                </div>
                <div className="chrome-tab active">
                    <div className="chrome-tab-dividers"></div>
                    <div className="chrome-tab-background">
                        <ChromeTabSvg />
                    </div>
                    <div className="chrome-tab-content">
                        <div className="chrome-tab-favicon">
                            <FacebookOutlined />
                        </div>
                        <div className="chrome-tab-title">Facebook</div>
                        <div className="chrome-tab-close"></div>
                    </div>
                </div>
            </div>
            <div className="chrome-tabs-bottom-bar"></div>
        </div>
    );
};

export default ChromeTab;
