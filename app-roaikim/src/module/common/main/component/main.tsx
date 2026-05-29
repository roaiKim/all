import React, { type PropsWithChildren } from "react";
import { Outlet, useLocation, useParams } from "react-router";
import { BookmarkTabs } from "components/bookmark-tabs";
import { header_height } from "config/static-constant";
import { HeaderComponent } from "module/common/header/type";
import { MenuComponent } from "module/common/menus/type";
import { joinLessPrefix } from "utils/framework";

export default function (props: PropsWithChildren) {
    const { children } = props;
    return (
        <React.Fragment>
            <div className={joinLessPrefix("left-page")}>
                <MenuComponent activeName=""></MenuComponent>
            </div>
            <div className={joinLessPrefix("right-page")}>
                <HeaderComponent></HeaderComponent>
                <main className={joinLessPrefix("main-page")} style={{ height: `calc(100% - ${header_height}px)` }}>
                    {children}
                </main>
            </div>
        </React.Fragment>
    );
    // return (
    //     <div className={joinLessPrefix("container")}>
    //         <MenuComponent activeName=""></MenuComponent>
    //         <div className={joinLessPrefix("right-page")}>
    //             <HeaderComponent></HeaderComponent>
    //             <main className={joinLessPrefix("main-page")} style={{ height: `calc(100% - ${header_height}px)` }}>
    //                 {children}
    //             </main>
    //         </div>
    //     </div>
    // );
}
