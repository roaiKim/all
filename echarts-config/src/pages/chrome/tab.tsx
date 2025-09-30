import { GoogleOutlined } from "@ant-design/icons";
import ChromeTabSvg from "./tab-path";

export function Tab() {
    return (
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
    );
}
