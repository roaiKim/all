function ajax(a, b, c, d) {
    return new Promise(() => {});
}

export {ajax};
export interface Page<Customs> {current: number;pages: number;records: Customs[];size: number;total: number;};
export interface Page<OrderAbnormal> {current: number;pages: number;records: OrderAbnormal[];size: number;total: number;};
export interface Page<OrderRouterSegmentPageListVo> {current: number;pages: number;records: OrderRouterSegmentPageListVo[];size: number;total: number;};
export interface Page<Order> {current: number;pages: number;records: Order[];size: number;total: number;};