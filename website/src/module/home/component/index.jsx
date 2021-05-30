import React from "react";
import {
    UserOutlined, ShoppingCartOutlined, CameraOutlined, CarOutlined,
} from "@icon";
import "./index.less";

class Main extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <article className="ro-module-wrap ro-home-module">
                <div className="ro-info-wrap">
                    <div className="ro-info-box">
                        <UserOutlined className="ro-info-box-icon" />
                        <div className="ro-info-box-count">
                            <p>Total User</p>
                            <p>12,548</p>
                        </div>
                    </div>
                    <div className="ro-info-box">
                        <ShoppingCartOutlined className="ro-info-box-icon" />
                        <div className="ro-info-box-count">
                            <p>New Orders</p>
                            <p>16,748</p>
                        </div>
                    </div>
                    <div className="ro-info-box">
                        <CameraOutlined className="ro-info-box-icon" />
                        <div className="ro-info-box-count">
                            <p>Last Week Earnings</p>
                            <p>$45,251</p>
                        </div>
                    </div>
                    <div className="ro-info-box">
                        <CarOutlined className="ro-info-box-icon" />
                        <div className="ro-info-box-count">
                            <p>Products Delivered</p>
                            <p>5,124</p>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

}

export default Main;
