import Header from "../header";
import Operate from "../operate";
import PrintBody from "../print-body";
import Rule from "../rule";
import "./index.less";

export default function Assemble() {
    return (
        <div className="print-container">
            <Header />
            <Operate />
            <Rule></Rule>
            <PrintBody />
        </div>
    );
}
