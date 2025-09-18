import React from "react";
import AbnormalQuality from "./components/AbnormalQuality";
import Analyze from "./components/Analyze";
import FinancialOrderNode from "./components/FinancialOrderNode";
import GoldService from "./components/GoldService";
// import Oft from "./components/oft";
import Operations from "./components/Operations";
import Pending from "./components/Pending";
import Settlement from "./components/Settlement";
import StrongCargoOwner from "./components/StrongCargoOwner";
import "./index.less";

const Dashboard: React.FC = () => {
    return (
        <div className="screen">
            <div className="flex flex-top-margin">
                <div className="flex-margin" style={{ marginRight: 0, flexGrow: 9 }}>
                    <div className="box">
                        <Pending />
                    </div>
                </div>
                <div className="flex-margin" style={{ flexGrow: 10 }}>
                    <div className="box" style={{ height: "100%" }}>
                        <Operations />
                    </div>
                </div>
            </div>

            <div className="flex flex-top-margin">
                <div style={{ flex: 1.3, marginRight: 0 }} className="flex-margin">
                    <div className="box">
                        <Analyze />
                    </div>
                    <div className="box" style={{ marginTop: "15px" }}>
                        <Settlement />
                    </div>
                </div>
                <div className="flex1 flex-margin">
                    <div className="box" style={{ height: "100%" }}>
                        <FinancialOrderNode />
                    </div>
                </div>
            </div>

            {/* <div
                className="box"
                style={{
                    height: "100%",
                    width: "calc(100% - 30px)",
                    marginLeft: "15px",
                }}
            >
                <Oft />
            </div> */}

            <div className="flex flex-top-margin">
                <div style={{ marginRight: 0 }} className="flex-margin flex1">
                    <div className="box" style={{ height: "100%" }}>
                        <StrongCargoOwner />
                    </div>
                </div>
                <div className="flex1 flex-margin">
                    <div className="box" style={{ height: "100%" }}>
                        <GoldService />
                    </div>
                </div>
            </div>

            <div className="flex flex-top-margin" style={{ paddingBottom: "20px" }}>
                <div className="flex-margin flex1">
                    <div className="box">
                        <AbnormalQuality />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
