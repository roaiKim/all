import { State } from "@core";
import { State as ExampleState } from "pages/zz-example/type";
import { State as HomeState } from "pages/index/type";
import { State as ProfileState } from "pages/user/type";

export interface RootState extends State {
    app: {
        example: ExampleState;
        home: HomeState;
        profile: ProfileState;
    };
}
