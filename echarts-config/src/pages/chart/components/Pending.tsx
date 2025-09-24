import React, { useEffect, useState } from "react";
import { GolbalService } from "@service/api/GolbalService";
import CarPng from "./v2_sinspm.png";
import UserPng from "./v2_sinsw8.png";
import Compose from "./Compose";

const Pending: React.FC = () => {
    // 替代Vue的reactive，使用useState管理状态
    const [modal, setModal] = useState({
        待提货: 0,
        待派送: 0,
    });

    // 获取数据的函数，对应Vue中的getData
    const getData = () => {
        GolbalService.getPending().then((res: any) => {
            // 更新状态，替代Vue的响应式赋值
            setModal({
                待提货: res.待提货,
                待派送: res.待派送,
            });
        });
    };

    // 替代Vue的onMounted生命周期钩子
    useEffect(() => {
        getData();
    }, []); // 空依赖数组表示只在组件挂载时执行一次

    return (
        <Compose title="待办事项" className="pending-module">
            <div style={{ padding: "0 20px 20px" }}>
                <div className="flex background">
                    <div>
                        <div style={{ fontSize: "18px" }}>待提货</div>
                        <div style={{ fontWeight: "bold", fontSize: "28px" }}>{modal.待提货}</div>
                    </div>
                    <div>
                        <div className="img">
                            <img src={UserPng} alt="用户图标" />
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: "18px" }}>待派送</div>
                        <div style={{ fontWeight: "bold", fontSize: "28px" }}>{modal.待派送}</div>
                    </div>
                    <div>
                        <div className="img">
                            <img src={CarPng} alt="车辆图标" />
                        </div>
                    </div>
                </div>
            </div>
        </Compose>
    );
};

export default Pending;
