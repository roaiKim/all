import { Loading, Module, register } from "@core";
import { captureError } from "utils";
import { OrderService } from "service/public-api/OrderService";
import { RootState } from "type/state";
import { State } from "./type";

const initialOrderSearchState: State = {
    name: "orderSearch",
    dataSource: [],
};

class OrderSearchModule extends Module<RootState, "orderSearch"> {
    onShow() {
        this.getOrderList();
    }

    @Loading()
    async getOrderList() {
        const response = await OrderService.getOrder({
            conditionBodies: [],
            orders: [
                {
                    ascending: false,
                    orderBy: "updateTime",
                },
            ],
            limit: 999,
            offset: 0,
            pageNo: 1,
            pageSize: 999,
        }).catch((error) => {
            this.setState({ dataSource: [] });
            captureError(error);
            return Promise.reject();
        });
        this.setState({
            dataSource: response.data || [],
        });
    }
}

const module = register(new OrderSearchModule("orderSearch", initialOrderSearchState));
const actions = module.getActions();

export { actions, module };
