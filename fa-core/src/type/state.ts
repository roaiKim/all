import { State } from "@core";
import { State as HomeState } from "module/home/type";
import { State as ExampleState } from "module/example/type";
import { State as MainState } from "module/main/type";
import { State as GameOneState } from "module/game/gameOne/type";
import { State as GameTwoState } from "module/game/gameTwo/type";
import { State as DataDictionaryState } from "module/data-dictionary/type";

export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
        gameOne: GameOneState;
        gameTwo: GameTwoState;
        example: ExampleState;
        dataDictionary: DataDictionaryState;
    };
}
