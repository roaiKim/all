import type { State } from "@core";
import type { State as AttributeState } from "module/attribute/type";
import type { State as AddressState } from "module/client/address/type";
import type { State as ManagementState } from "module/client/management/type";
import type { State as PackageState } from "module/client/package/type";
import type { State as HeaderState } from "module/common/header/type";
import type { State as LoginState } from "module/common/login/type";
import type { State as MainState } from "module/common/main/type";
import type { State as MenusState } from "module/common/menus/type";
import type { State as HomeState } from "module/home/type";
import type { State as MaterialState } from "module/material/type";
import type { State as ScenarioState } from "module/scenario/type";
import type { State as SceneChapterState } from "module/scene-chapter/type";
import type { State as SceneryState } from "module/scenery/type";

export interface RootState extends State {
    app: {
        header: HeaderState;
        login: LoginState;
        main: MainState;
        menus: MenusState;
        home: HomeState;
        management: ManagementState;
        address: AddressState;
        package: PackageState;
        scenario: ScenarioState;
        sceneChapter: SceneChapterState;
        material: MaterialState;
        scenery: SceneryState;
        attribute: AttributeState;
    };
}
