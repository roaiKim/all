import { AppleOutlined, FacebookOutlined, GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import ChromeTabSvg from "./tab-path";
import "./index.less";

interface TabState {
    /**
     * 图标
     */
    icon?: React.ReactNode;

    /**
     * 显示title
     */
    label?: React.ReactNode;

    /**
     * 是显示关闭按钮
     * default true
     */
    allowClose?: boolean;

    /**
     * 是否disabled
     * default false
     */
    disabled?: boolean;
}

interface ChromeStyleTabProps {
    /**
     * tabs 数据
     */
    tabs: TabState[];

    /**
     * 是否可拖拽
     */
    draggable?: boolean;

    /**
     *
     * @param tab 当前点击的元素
     * @param index 当前点击元素的index
     * @returns void
     */
    onClick?: (tab: TabState, index: number) => void;

    /**
     *
     * @param tab 当前点击的元素
     * @param index 当前点击元素的index
     * @param tabs close 后的元素的copy副本
     * @returns void
     */
    onClose?: (tab: TabState, index: number, tabs: TabState[]) => void;
}

function ChromeStyleTab(props: ChromeStyleTabProps) {
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
                <div className="ro-item active">
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
                <div className="ro-item">
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
