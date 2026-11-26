import { DriverExecutionCargoTask } from "@api/DriverExecutionService";

export type CargoMode = "pickup" | "receipt";

export const CARGO_MODE_TITLES: Record<CargoMode, string> = {
    pickup: "提货明细",
    receipt: "送货明细",
};

export interface State {
    mode: CargoMode;
    tasks: DriverExecutionCargoTask[];
}
