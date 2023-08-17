import { Loading, Module, register } from "@core";
import { RootState } from "type/state";
import { OrderService } from "service/public-api/OrderService";
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
        });
        this.setState({
            dataSource: response.data || [],
        });
    }
}

const module = register(new OrderSearchModule("orderSearch", initialOrderSearchState));
const actions = module.getActions();

export { module, actions };
