import { useLocation, useParams } from "react-router";
import { BookmarkTabs } from "components/bookmark-tabs";
import { header_height } from "config/static-constant";
import { MenuComponent } from "module/common/menus/type";
import { joinLessPrefix } from "utils/framework";

export default function (props) {
    return (
        <div className={joinLessPrefix("main-page")}>
            {/* <div className={joinLessPrefix("left-nav")}>
                <div className={joinLessPrefix("main-logo")} style={{ height: header_height }}>
                    lgoo
                </div>
                <div className={joinLessPrefix("main-nav")}>nav</div>
            </div> */}
            <MenuComponent activeName=""></MenuComponent>
            <div className={joinLessPrefix("right-page")}>
                <div className={joinLessPrefix("main-header")} style={{ minHeight: header_height }}>
                    <BookmarkTabs />
                </div>
                <div className={joinLessPrefix("page-container")}>page</div>
            </div>
        </div>
    );
}
