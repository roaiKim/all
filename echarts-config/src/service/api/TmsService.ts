import { ajax } from "@http";

export class TmsService {
    /**
     *
     * @returns 货主赋能
     */
    static orderAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/orderAnalysis");
    }

    /**
     *
     * @returns TOP10货主
     */
    static topClientAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/topClientAnalysis");
    }

    /**
     *
     * @returns 订单分布
     */
    static topProvinceAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/topProvinceAnalysis");
    }

    /**
     *
     * @returns 运力链接
     */
    static capacityAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/capacityAnalysis");
    }

    /**
     *
     * @returns TOP10承运商
     */
    static topCarrierAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/topCarrierAnalysis");
    }

    /**
     *
     * @returns 总统计
     */
    static carAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/carAnalysis");
    }

    /**
     *
     * @returns 今日订单统计
     */
    static todayOrderAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/todayOrderAnalysis");
    }

    /**
     *
     * @returns 通知
     */
    static notice(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/notice");
    }

    /**
     *
     * @returns 每个省的订单
     */
    static provinceMonitor(provinceName: string): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/driver/car/provinceMonitor?province=" + provinceName);
    }

    /**
     *
     * @returns 某个省的订单数据
     */
    static provinceStatistics(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/driver/car/provinceStatistics");
    }

    /**
     *
     * @returns 用户数量
     */
    static userAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/userAnalysis");
    }

    /**
     *
     * @returns 运力发展趋势
     */
    static carEnergyCurrentMonthAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/carEnergyCurrentMonthAnalysis");
    }

    /**
     *
     * @returns 车型统计
     */
    static carClassificationAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/carClassificationAnalysis");
    }

    /**
     *
     * @returns 能源类型
     */
    static carEnergyAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/carEnergyAnalysis");
    }

    /**
     *
     * @returns 月度货量
     */
    static monthCargoQuantityAnalysis(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/dashboard/monthCargoQuantityAnalysis");
    }
}
