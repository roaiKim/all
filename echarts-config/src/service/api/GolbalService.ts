import { ajax } from "@http";
import type { QualityAbnormalItem } from "@src/pages/home/components/AbnormalQuality";
import type { OperateAnalysisItem } from "@src/pages/home/components/Analyze";
import type { OrderNodeResponse } from "@src/pages/home/components/FinancialOrderNode";
import type { DriverData } from "@src/pages/home/components/GoldService";
import type { OftAnalysisResponse } from "@src/pages/home/components/oft";
import type { FinancialData } from "@src/pages/home/components/Settlement";

export class GolbalService {
    static getDictionary(code: string): Promise<Record<string, any>[]> {
        return ajax("GET", `/api/common/dictionary/getDictionaryByTypeAndStatus/${code}`, {});
    }

    static getByUserId(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/admin/account/dataPermissionTree/getByUserId");
    }

    static getPending(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/index/todo");
    }

    static getOrderTransportCapacityStatistics(params: any): Promise<Record<string, any>[]> {
        return ajax("GET", `/api/system/index/orderTransportCapacityStatistics?type=${params.type}`);
    }

    static getOrderTransportShippingReceiptStatistics(params: any): Promise<Record<string, any>[]> {
        return ajax("GET", `/api/system/index/orderTransportShippingReceiptStatistics?type=${params.type}`);
    }

    static getTodayOperateAnalysis(): Promise<OperateAnalysisItem[]> {
        return ajax("GET", `/api/system/index/todayOperateAnalysis`);
    }

    static getSettlementAnalysis(params: any): Promise<FinancialData> {
        return ajax("GET", `/api/system/index/settlementAnalysis?yearOfMonth=${params.type}`);
    }

    static getOrderNodeAnalysis(params: any): Promise<OrderNodeResponse> {
        return ajax("GET", `/api/system/index/orderNodeAnalysis?yearOfMonth=${params.type}`);
    }

    static getTopClientAnalysis(params: any): Promise<Record<string, any>[]> {
        return ajax("GET", `/api/system/index/topClientAnalysis?yearOfMonth=${params.yearOfMonth}&type=${params.type}`);
    }

    static getTopDriverAnalysis(params: any): Promise<DriverData[]> {
        return ajax("GET", `/api/system/index/topDriverAnalysis?yearOfMonth=${params.yearOfMonth}&type=${params.type}`);
    }

    static getAbnormalQuality(params: any): Promise<{ data: QualityAbnormalItem[] }> {
        return ajax("POST", `/api/tms/exceptionTransportOrder/advanced-page`, params);
    }

    static oftAnalysis(params: any): Promise<OftAnalysisResponse> {
        return ajax("GET", `/api/system/index/oftAnalysis`, params);
    }
}
