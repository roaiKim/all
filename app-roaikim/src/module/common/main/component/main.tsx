import { useLocation, useParams } from "react-router";
import { joinLessPrefix } from "utils/framework";

export default function (props) {
    return (
        <div className={joinLessPrefix("main-page")}>
            <div>
                <div>lgoo</div>
                <div>nav</div>
            </div>
            <div>
                <div>header</div>
                <div>page</div>
            </div>
        </div>
    );
}
