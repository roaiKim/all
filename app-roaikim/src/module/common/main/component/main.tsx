import { Outlet, useLocation, useParams } from "react-router";
import { BookmarkTabs } from "components/bookmark-tabs";
import { header_height } from "config/static-constant";
import { HeaderComponent } from "module/common/header/type";
import { MenuComponent } from "module/common/menus/type";
import type { PropsWithChildren } from "react";
import { joinLessPrefix } from "utils/framework";

export default function (props: PropsWithChildren) {
    const { children } = props;
    return (
        <div className={joinLessPrefix("main-page")}>
            <MenuComponent activeName=""></MenuComponent>
            <div className={joinLessPrefix("right-page")}>
                <HeaderComponent></HeaderComponent>
                {children}
            </div>
        </div>
    );
}
