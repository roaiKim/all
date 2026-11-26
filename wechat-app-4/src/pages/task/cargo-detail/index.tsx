import { Loading, Module, register } from "@core";
import { DriverExecutionService } from "@api/DriverExecutionService";
import { RootState } from "@type/state";
import Main from "./component";
import { State } from "./type";

const initialCargoDetailState: State = {
    mode: "pickup",
    tasks: [],
};

class CargoDetailModule extends Module<RootState, "cargoDetail"> {
    onEnter(params): void {
        this.setState({ mode: params.mode === "receipt" ? "receipt" : "pickup" });
        this.fetchCargo(params);
    }

    @Loading()
    async fetchCargo(params) {
        const response = await DriverExecutionService.queryCargo({
            entrustId: params.entrustId,
            taskId: params.taskId,
            pickupPointId: params.pickupPointId,
            unloadPointId: params.unloadPointId,
            orderId: params.orderId,
        });
        this.setState({ tasks: response.tasks || [] });
    }
}

const module = register(new CargoDetailModule("cargoDetail", initialCargoDetailState));
export const actions = module.getActions();

export default module.connect(Main);
