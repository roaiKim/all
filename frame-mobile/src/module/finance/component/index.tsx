import { connect } from "react-redux";
import { showLoading } from "@core";
import { RootState } from "type/state";
import "./index.less";

interface FinanceProps extends ReturnType<typeof mapStateToProps> {}

function Finance(props: FinanceProps) {
    return <div className="ro-finance-module">hello Finance</div>;
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Finance);
