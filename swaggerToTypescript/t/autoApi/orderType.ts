// 这个文件是 'yarn api' 自动生成的, 谨慎修改;

export interface AppUploadVoucherDTO {
    attachmentList: Attachment[];
    orderId: number;
    remark: string;
    stowageOrderSegmentId: number;
}
export interface Attachment {
    businessId: number;
    createTime: string;
    createUser: string;
    createUserId: number;
    downloadFileName: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    id: number;
    orderId: number;
    orderNumber: string;
    orderType: number;
    origin: number;
    receiptName: string;
    receiverName: string;
    remark: string;
    senderName: string;
    status: number;
    updateTime: string;
    updateUser: string;
    url: string;
    workItem: string;
}
export interface CarryCargoManifestDTO {
    attachmentList: Attachment[];
    manifests: OrderReceiverDTO[];
    otherCarCode: string;
    portDate: string;
    resourceVehicleId: number;
    resourceVehicleName: string;
    sixUnionSingleNumber: string;
    specificationModel: string;
    stowageId: number;
}
export interface ChooseSignDTO {
    data: SignData[];
    stowageId: number;
}
export interface Customs {
    attachmentList: Attachment[];
    businessType: string;
    clientId: number;
    clientName: string;
    createTime: string;
    customsBroker: string;
    customsMethod: number;
    customsNumber: string;
    customsTypeId: number;
    customsTypeName: string;
    downloadCount: number;
    header: string;
    id: number;
    inOut: number;
    logs: CustomsLog[];
    operatorId: number;
    operatorName: string;
    orderId: number;
    orders: CustomsOrder[];
    portDate: string;
    portId: number;
    portName: string;
    preRecordedSingleNumber: string;
    remark: string;
    resourceVehicleName: string;
    singleNumber: string;
    sixUnionSingleNumber: string;
    status: number;
    stowageId: number;
    stowageNumber: string;
    updateTime: string;
}
export interface CustomsDTO {
    attachmentList: Attachment[];
    businessType: string;
    customsBroker: string;
    customsMethod: number;
    customsNumber: string;
    customsTypeId: number;
    customsTypeName: string;
    header: string;
    id: number;
    inOut: number;
    logs: CustomsLog[];
    orders: CustomsOrderDTO[];
    portDate: string;
    portId: number;
    portName: string;
    preRecordedSingleNumber: string;
    remark: string;
    singleNumber: string;
    sixUnionSingleNumber: string;
    status: number;
}
export interface CustomsDownloadLog {
    createTime: string;
    customsId: number;
    id: number;
    operatorId: number;
    operatorName: string;
}
export interface CustomsLog {
    createTime: string;
    customsId: number;
    id: number;
    operationType: number;
    operatorId: number;
    operatorName: string;
}
export interface CustomsLogDTO {
    attachmentList: Attachment[];
    customsNumber: string;
    id: number;
    preRecordedSingleNumber: string;
}
export interface CustomsOrder {
    attachmentList: Attachment[];
    clientId: number;
    clientName: string;
    customerNumber: string;
    customsId: number;
    id: number;
    netWeight: number;
    orderId: number;
    orderNumber: string;
    quantity: number;
    status: number;
    volume: number;
    weight: number;
}
export interface CustomsOrderDTO {
    attachmentList: Attachment[];
    billingWeight: number;
    boardCount: number;
    customsId: number;
    id: number;
    netWeight: number;
    orderId: number;
    quantity: number;
    volume: number;
    weight: number;
}
export interface DeliverySignDTO {
    attachmentList: Attachment[];
    id: number;
}
export interface DynamicConditionField {
    conditionSymbol: string;
    fieldValues: object;
    fields: string;
    linkSymbol: string;
}
export interface DynamicSortField {
    asc: boolean;
    field: string;
}
export interface FreightVolumeAdjustmentDTO {
    id: number;
    totalBillingWeight: number;
    totalBoardCount: number;
    totalGrossWeight: number;
    totalNetWeight: number;
    totalQuantity: number;
    totalVolume: number;
}
export interface ImportOrderDTO {
    aging: number;
    arrivalTime: string;
    billingMethod: number;
    businessModelId: number;
    businessModelName: string;
    carTypeList: OrderCarTypeVo[];
    clientId: number;
    clientName: string;
    clientShortName: string;
    currencyId: number;
    currencyName: string;
    customerNumber: string;
    customerNumberBackup: string;
    customsBroker: string;
    customsFlag: number;
    customsMethod: number;
    departureArea: string;
    departureCity: string;
    departureProvince: string;
    departureStreet: string;
    departureTime: string;
    destinationArea: string;
    destinationCity: string;
    destinationProvince: string;
    destinationStreet: string;
    id: number;
    index: number;
    insuredValue: number;
    isInsurance: number;
    liftingModeId: number;
    liftingModeName: string;
    orderLegalId: number;
    orderLegalName: string;
    orderNumber: string;
    period: number;
    portClearanceRequirement: string;
    projectId: number;
    projectName: string;
    quotationId: number;
    quotationLineId: number;
    quotationNumber: string;
    receivers: OrderReceiver[];
    remark: string;
    routeId: number;
    routeName: string;
    routerSegments: OrderRouterSegment[];
    routerStations: OrderRouterStation[];
    salesmanId: number;
    salesmanName: string;
    senders: OrderSender[];
    serviceItemId: number;
    serviceItemName: string;
    specialInstruction: string;
    totalBillingWeight: number;
    totalBoardCount: number;
    totalGrossWeight: number;
    totalNetWeight: number;
    totalQuantity: number;
    totalVolume: number;
    traditionalBusiness: TraditionalBusiness;
    transitTime: string;
    transportMethodId: number;
    transportMethodName: string;
}
export interface MatchQuotationExpenseVO {
    bottomFee: number;
    calculateCostBillId: number;
    calculateCostBillName: string;
    chargeMethod: number;
    checkConditions: QuotationExpenseCheckVO[];
    contrastCalculateCostType: number;
    currencyId: number;
    currencyName: string;
    endValue: number;
    exchangeRate: number;
    exchangeRateConversion: number;
    expenseItemId: number;
    expenseItemName: string;
    express: string;
    fieldKey: string;
    fieldName: string;
    fixedValue: number;
    frontExpress: string;
    intervalMethod: number;
    isRequired: number;
    isTextsIncluded: number;
    legalId: number;
    legalName: string;
    listBillDay: string;
    mergeMethod: number;
    objectId: number;
    objectName: string;
    oldUnitPrice: number;
    payeeId: number;
    payeeName: string;
    payerId: number;
    payerName: string;
    quotationExpenseId: number;
    quotationExpenseUnitId: number;
    quotationExpenseUnitIntervalId: number;
    quotationLineId: number;
    settlementCost: number;
    settlementCurrencyId: number;
    settlementCurrencyName: string;
    shareRuleId: number;
    shareRuleName: string;
    standardTotalCost: number;
    startValue: number;
    taxes: number;
    title: string;
    topFee: number;
    totalCost: number;
    transportCount: number;
    unitId: number;
    unitName: string;
    unitPrice: number;
}
export interface MatchQuotationVO {
    calculateCostBillId: number;
    departureArea: string;
    departureCity: string;
    departureProvince: string;
    departureStreet: string;
    destinationArea: string;
    destinationCity: string;
    destinationProvince: string;
    destinationStreet: string;
    quotationExpenses: MatchQuotationExpenseVO[];
    quotationId: number;
    quotationLineId: number;
    quotationNumber: string;
    settlementCurrencyId: number;
    settlementCurrencyName: string;
    standardCurrencyId: number;
    standardCurrencyName: string;
}
export interface Order {
    abnormalLineList: OrderAbnormal[];
    aging: number;
    arrivalTime: string;
    attachmentList: Attachment[];
    billingMethod: number;
    businessModelId: number;
    businessModelName: string;
    carTypeId: number;
    carTypeList: OrderCarType[];
    carTypeName: string;
    clientId: number;
    clientName: string;
    clientShortName: string;
    createTime: string;
    currencyId: number;
    currencyName: string;
    customerNumber: string;
    customerNumberBackup: string;
    customsBroker: string;
    customsFlag: number;
    customsMethod: number;
    departureArea: string;
    departureCity: string;
    departureProvince: string;
    departureStreet: string;
    departureTime: string;
    destinationArea: string;
    destinationCity: string;
    destinationProvince: string;
    destinationStreet: string;
    id: number;
    insuredValue: number;
    isInsurance: number;
    liftingModeId: number;
    liftingModeName: string;
    operatorId: number;
    operatorName: string;
    orderLegalId: number;
    orderLegalName: string;
    orderNumber: string;
    period: number;
    portClearanceRequirement: string;
    projectId: number;
    projectName: string;
    quotationId: number;
    quotationLineId: number;
    quotationNumber: string;
    receiptCount: number;
    receiverCount: number;
    receivers: OrderReceiver[];
    remark: string;
    routeId: number;
    routeName: string;
    routerSegments: OrderRouterSegment[];
    routerStations: OrderRouterStation[];
    salesmanId: number;
    salesmanName: string;
    senderCount: number;
    senders: OrderSender[];
    serviceItemId: number;
    serviceItemName: string;
    signTime: string;
    sixUnionSingleNumber: string;
    source: number;
    specialInstruction: string;
    status: number;
    totalBillingWeight: number;
    totalBoardCount: number;
    totalGrossWeight: number;
    totalNetWeight: number;
    totalQuantity: number;
    totalVolume: number;
    traditionalBusiness: TraditionalBusiness;
    transitTime: string;
    transportMethodId: number;
    transportMethodName: string;
    updateTime: string;
}
export interface OrderAbnormal {
    abnormalLevel: number;
    abnormalLinkId: number;
    abnormalLinkName: string;
    abnormalType: number;
    abnormalTypeId: number;
    abnormalTypeName: string;
    attachmentList: Attachment[];
    clientId: number;
    clientName: string;
    createTime: string;
    creatorId: number;
    creatorName: string;
    departure: string;
    destination: string;
    handleList: OrderAbnormalHandle[];
    handleRemark: string;
    handleStatus: number;
    handleTime: string;
    handlerId: number;
    handlerName: string;
    id: number;
    orderId: number;
    orderNumber: string;
    remark: string;
    reportClient: number;
    responsiblePartyId: number;
    responsiblePartyName: string;
    stowageId: number;
}
export interface OrderAbnormalHandle {
    createTime: string;
    handleRemark: string;
    id: number;
    operatorId: number;
    operatorName: string;
    orderAbnormalId: number;
    responsiblePartyId: number;
    responsiblePartyName: string;
    status: number;
}
export interface OrderAbnormalVO {
    abnormalLevel: number;
    abnormalLinkId: number;
    abnormalLinkName: string;
    abnormalTypeId: number;
    abnormalTypeName: string;
    attachmentList: Attachment[];
    createTime: string;
    creatorId: number;
    creatorName: string;
    handleRemark: string;
    handleStatus: number;
    handleTime: string;
    handlerId: number;
    handlerName: string;
    orderId: number;
    remark: string;
    reportClient: number;
    responsiblePartyId: number;
    responsiblePartyName: string;
}
export interface OrderCarType {
    carCount: number;
    carTypeId: number;
    carTypeName: string;
    id: number;
    orderId: number;
}
export interface OrderCarTypeVo {
    carCount: number;
    carTypeId: number;
    carTypeName: string;
    id: number;
    orderId: number;
}
export interface OrderCargoCount {
    netWeight: number;
    quantity: number;
    volume: number;
    weight: number;
}
export interface OrderCountVO {
    all: number;
    confirmed: number;
    signed: number;
    transporting: number;
    unconfirmed: number;
    unsigned: number;
}
export interface OrderDTO {
    aging: number;
    arrivalTime: string;
    billingMethod: number;
    businessModelId: number;
    businessModelName: string;
    carTypeList: OrderCarTypeVo[];
    clientId: number;
    clientName: string;
    clientShortName: string;
    currencyId: number;
    currencyName: string;
    customerNumber: string;
    customerNumberBackup: string;
    customsBroker: string;
    customsFlag: number;
    customsMethod: number;
    departureArea: string;
    departureCity: string;
    departureProvince: string;
    departureStreet: string;
    departureTime: string;
    destinationArea: string;
    destinationCity: string;
    destinationProvince: string;
    destinationStreet: string;
    id: number;
    insuredValue: number;
    isInsurance: number;
    liftingModeId: number;
    liftingModeName: string;
    orderLegalId: number;
    orderLegalName: string;
    orderNumber: string;
    period: number;
    portClearanceRequirement: string;
    projectId: number;
    projectName: string;
    quotationId: number;
    quotationLineId: number;
    quotationNumber: string;
    receivers: OrderReceiver[];
    remark: string;
    routeId: number;
    routeName: string;
    routerSegments: OrderRouterSegment[];
    routerStations: OrderRouterStation[];
    salesmanId: number;
    salesmanName: string;
    senders: OrderSender[];
    serviceItemId: number;
    serviceItemName: string;
    specialInstruction: string;
    totalBillingWeight: number;
    totalBoardCount: number;
    totalGrossWeight: number;
    totalNetWeight: number;
    totalQuantity: number;
    totalVolume: number;
    traditionalBusiness: TraditionalBusiness;
    transitTime: string;
    transportMethodId: number;
    transportMethodName: string;
}
export interface OrderQuotationMatchDTO {
    aging: number;
    arrivalTime: string;
    businessModelName: string;
    clientId: number;
    departureTime: string;
    projectId: number;
    quotationId: number;
    quotationLineId: number;
    receivers: OrderReceiver[];
    senders: OrderSender[];
}
export interface OrderReceiver {
    adjustmentFlag: number;
    arrivalTime: string;
    attachmentList: Attachment[];
    billingWeight: number;
    boardCount: number;
    cargoValue: number;
    carryCargoNumber: string;
    contactNumber: string;
    contacts: string;
    deliveryRequirement: string;
    deliveryType: number;
    description: string;
    distributionMark: string;
    haveGoodsDetails: number;
    hkCustoms: number;
    id: number;
    itemName: string;
    mobilePhoneNumber: string;
    netWeight: number;
    orderId: number;
    orderReceiverMaterialsList: OrderReceiverMaterials[];
    quantity: number;
    receiverAddress: string;
    receiverArea: string;
    receiverId: number;
    receiverLatitude: number;
    receiverLongitude: number;
    receiverName: string;
    status: number;
    uid: string;
    volume: number;
    weight: number;
    weights: number;
}
export interface OrderReceiverDTO {
    carryCargoNumber: string;
    hkCustoms: number;
    id: number;
    orderNumber: string;
    receiverAddress: string;
}
export interface OrderReceiverMaterials {
    billingWeight: number;
    boxNumber: string;
    boxShape: string;
    id: number;
    mark: string;
    orderReceiverId: number;
    packagingTypeId: number;
    packagingTypeName: string;
    productName: string;
    quantity: number;
    sealNumber: string;
    volume: number;
    weight: number;
}
export interface OrderRouterSegment {
    agingDuration: number;
    agingType: number;
    arrivalTime: string;
    billingWeight: number;
    boardCount: number;
    businessModelId: number;
    businessModelName: string;
    carrier: string;
    carrierId: number;
    createTime: string;
    customsFlag: number;
    departureTime: string;
    description: string;
    distributionMark: string;
    eid: string;
    endStationId: number;
    id: number;
    isMerge: number;
    isSplit: number;
    isTransferSplit: number;
    itemName: string;
    mergeId: number;
    netWeight: number;
    operatorId: number;
    operatorName: string;
    orderId: number;
    orderNumber: string;
    portId: number;
    portName: string;
    quantity: number;
    remark: string;
    segmentAssigners: OrderRouterSegmentAssigner[];
    segmentNumber: string;
    segmentOrganizations: OrderRouterSegmentOrganization[];
    segmentType: string;
    sid: string;
    splitId: number;
    startStationId: number;
    stowageStatus: number;
    transferSplitId: number;
    transportModeId: number;
    transportModeName: string;
    transportRequirement: string;
    type: string;
    typeCode: string;
    updateTime: string;
    volume: number;
    weight: number;
}
export interface OrderRouterSegmentAssignDTO {
    assigners: OrderRouterSegmentAssigner[];
    ids: number;
    organizations: OrderRouterSegmentOrganization[];
}
export interface OrderRouterSegmentAssigner {
    assigner: string;
    assignerId: number;
    id: number;
    operatorId: number;
    operatorName: string;
    segmentId: number;
    updateTime: string;
}
export interface OrderRouterSegmentCarrierDTO {
    businessModelId: number;
    businessModelName: string;
    carrier: string;
    carrierId: number;
    ids: number;
    transportModeId: number;
    transportModeName: string;
}
export interface OrderRouterSegmentOrganization {
    id: number;
    operatorId: number;
    operatorName: string;
    organization: string;
    organizationId: number;
    segmentId: number;
    updateTime: string;
}
export interface OrderRouterSegmentPageListVo {
    agingDuration: number;
    agingType: number;
    arrivalTime: string;
    billingWeight: number;
    boardCount: number;
    businessModelId: number;
    businessModelName: string;
    carrier: string;
    carrierId: number;
    clientName: string;
    contactNumber: string;
    contacts: string;
    createTime: string;
    customerNumber: string;
    customerNumberBackup: string;
    customsFlag: number;
    customsList: Customs[];
    departureTime: string;
    description: string;
    distributionMark: string;
    endStation: string;
    endStationAliasId: number;
    endStationAliasName: string;
    endStationId: number;
    endStationLatitude: number;
    endStationLongitude: number;
    id: number;
    itemName: string;
    mobilePhoneNumber: string;
    netWeight: number;
    operatorId: number;
    operatorName: string;
    orderCustomerService: string;
    orderId: number;
    orderNumber: string;
    period: number;
    portId: number;
    portName: string;
    quantity: number;
    remark: string;
    serviceItemId: number;
    serviceItemName: string;
    specialInstruction: string;
    startStation: string;
    startStationAliasId: number;
    startStationAliasName: string;
    startStationId: number;
    startStationLatitude: number;
    startStationLongitude: number;
    stowageOrderSegmentId: number;
    transitTime: string;
    transportModeId: number;
    transportModeName: string;
    transportRequirement: string;
    transportStatus: number;
    type: string;
    typeCode: string;
    updateTime: string;
    volume: number;
    weight: number;
}
export interface OrderRouterSegmentQueryVo {
    conditionFields: DynamicConditionField[];
    keyword: string;
    limit: number;
    offset: number;
    sortFields: DynamicSortField[];
}
export interface OrderRouterSegmentSplitDTO {
    id: number;
    orderNumber: string;
    quantity: number;
    remark: string;
    segmentNumber: string;
    splitId: number;
    volume: number;
    weight: number;
}
export interface OrderRouterSegmentSplitVo {
    arrivalTime: string;
    businessModelId: number;
    businessModelName: string;
    carrier: string;
    carrierId: number;
    departureTime: string;
    description: string;
    distributionMark: string;
    id: number;
    itemName: string;
    orderId: number;
    orderNumber: string;
    quantity: number;
    segmentNumber: string;
    segmentType: string;
    splitSegments: OrderRouterSegment[];
    transportModeId: number;
    transportModeName: string;
    transportRequirement: string;
    volume: number;
    weight: number;
}
export interface OrderRouterSegmentTransferSplitDTO {
    orderRouterStation: OrderRouterStation;
    splitSegments: OrderSegmentTransferSplit[];
}
export interface OrderRouterStation {
    address: string;
    addressAliasId: number;
    addressAliasName: string;
    areaName: string;
    cityName: string;
    createTime: string;
    id: number;
    isTemporary: number;
    latitude: number;
    longitude: number;
    operatorId: number;
    operatorName: string;
    orderId: number;
    orderReceiverOrSenderId: number;
    provinceName: string;
    remark: string;
    rsid: string;
    stationIdx: number;
    stayDuration: number;
    streetName: string;
    type: number;
    uid: string;
}
export interface OrderSegmentTransferSplit {
    segmentId: number;
    splitItems: OrderSegmentTransferSplitItem[];
}
export interface OrderSegmentTransferSplitItem {
    arrivalTime: string;
    departureTime: string;
    endStationId: number;
    orderNumber: string;
    remark: string;
    segmentNumber: string;
    startStationId: number;
}
export interface OrderSender {
    attachmentList: Attachment[];
    billingWeight: number;
    boardCount: number;
    cargoValue: number;
    contactNumber: string;
    contacts: string;
    deliveryType: number;
    departureTime: string;
    description: string;
    distributionMark: string;
    haveGoodsDetails: number;
    id: number;
    itemName: string;
    mobilePhoneNumber: string;
    netWeight: number;
    orderId: number;
    orderSenderMaterialsList: OrderSenderMaterials[];
    pickUpRequirement: string;
    quantity: number;
    senderAddress: string;
    senderArea: string;
    senderId: number;
    senderLatitude: number;
    senderLongitude: number;
    senderName: string;
    status: number;
    uid: string;
    volume: number;
    weight: number;
    weights: number;
}
export interface OrderSenderMaterials {
    billingWeight: number;
    boxNumber: string;
    boxShape: string;
    id: number;
    mark: string;
    orderSenderId: number;
    packagingTypeId: number;
    packagingTypeName: string;
    productName: string;
    quantity: number;
    sealNumber: string;
    volume: number;
    weight: number;
}
export interface Page<T> {
    current: number;
    pages: number;
    records: T[];
    size: number;
    total: number;
}
export interface QuotationExpenseCheckVO {
    fieldKey: string;
    fieldName: string;
    id: number;
    name: string;
    quotationExpenseId: number;
    type: string;
    value: string;
}
export interface ReceiptFileVo {
    businessId: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    id: number;
    orderId: number;
    orderType: number;
    origin: number;
    receiptName: string;
    remark: string;
    sendCarId: number;
}
export interface Response<T> {
    code: number;
    data: T;
    msg: string;
    success: boolean;
}
export interface ScanCodeDTO {
    driverId: number;
    driverName: string;
    orderRouterSegmentIds: number;
    resourceVehicleId: number;
    resourceVehicleName: string;
    specificationModel: string;
}
export interface SegmentAssignerDTO {
    assigner: string;
    assignerId: number;
}
export interface SegmentCarrierDTO {
    carrier: string;
    carrierId: number;
}
export interface SegmentOrganizationDTO {
    organization: string;
    organizationId: number;
}
export interface SignData {
    id: number;
    signType: number;
}
export interface Stowage {
    adjustmentMethod: number;
    arrivalTime: string;
    associatePaymentCarrierId: number;
    associatePaymentCarrierName: string;
    attachmentCount: number;
    attachmentList: Attachment[];
    billingMethod: number;
    businessModelId: number;
    businessModelName: string;
    carrierDispatch: number;
    carrierId: number;
    carrierName: string;
    carrierType: number;
    contactPersons: StowageContactPerson[];
    createTime: string;
    currencyId: number;
    currencyName: string;
    departureArea: string;
    departureCity: string;
    departureProvince: string;
    departureStreet: string;
    departureTime: string;
    destinationArea: string;
    destinationCity: string;
    destinationProvince: string;
    destinationStreet: string;
    driverId: number;
    driverName: string;
    existException: number;
    handleStatus: number;
    id: number;
    isCustomsClearance: number;
    operatorId: number;
    operatorName: string;
    orderRouterSegments: OrderRouterSegmentPageListVo[];
    otherCarCode: string;
    packageRequirement: string;
    phone: string;
    phoneBackup: string;
    portDate: string;
    quotationId: number;
    quotationLineId: number;
    quotationNumber: string;
    remark: string;
    resourceVehicleId: number;
    resourceVehicleName: string;
    sendCarNumber: string;
    signTime: string;
    signType: number;
    singleNumber: string;
    sixUnionSingleNumber: string;
    source: number;
    specialInstruction: string;
    specificationModel: string;
    status: number;
    stowageNumber: string;
    stowageRouteConfigs: StowageRouteConfig[];
    totalBillingWeight: number;
    totalBoardCount: number;
    totalGrossWeight: number;
    totalNetWeight: number;
    totalQuantity: number;
    totalVolume: number;
    transportModeId: number;
    transportModeName: string;
    updateTime: string;
}
export interface StowageAbnormal {
    abnormalLevel: number;
    abnormalLinkId: number;
    abnormalLinkName: string;
    abnormalTypeId: number;
    abnormalTypeName: string;
    attachmentList: Attachment[];
    carrierName: string;
    createTime: string;
    creatorId: number;
    creatorName: string;
    departure: string;
    destination: string;
    handleList: StowageAbnormalHandle[];
    handleRemark: string;
    handleStatus: number;
    handleTime: string;
    handlerId: number;
    handlerName: string;
    id: number;
    orderList: StowageAbnormalOrder[];
    remark: string;
    reportClient: number;
    responsiblePartyId: number;
    responsiblePartyName: string;
    stowageId: number;
    stowageNumber: string;
}
export interface StowageAbnormalHandle {
    createTime: string;
    handleRemark: string;
    id: number;
    operatorId: number;
    operatorName: string;
    responsiblePartyId: number;
    responsiblePartyName: string;
    status: number;
    stowageAbnormalId: number;
}
export interface StowageAbnormalOrder {
    clientId: number;
    clientName: string;
    id: number;
    orderId: number;
    orderNumber: string;
    status: number;
    stowageAbnormalId: number;
}
export interface StowageAbnormalVO {
    abnormalLevel: number;
    abnormalLinkId: number;
    abnormalLinkName: string;
    abnormalTypeId: number;
    abnormalTypeName: string;
    attachmentList: Attachment[];
    createTime: string;
    creatorId: number;
    creatorName: string;
    handleRemark: string;
    handleStatus: number;
    handleTime: string;
    handlerId: number;
    handlerName: string;
    orderList: StowageAbnormalOrder[];
    remark: string;
    reportClient: number;
    responsiblePartyId: number;
    responsiblePartyName: string;
    stowageId: number;
}
export interface StowageAssigner {
    assigner: string;
    assignerId: number;
    id: number;
    operatorId: number;
    operatorName: string;
    stowageId: number;
    updateTime: string;
}
export interface StowageAssignerDTO {
    stowageAssignerList: StowageAssigner[];
    stowageId: number;
}
export interface StowageContactPerson {
    id: number;
    name: string;
    phone: string;
    stowageId: number;
}
export interface StowageCountVO {
    all: number;
    confirmed: number;
    signed: number;
    unconfirmed: number;
    unsigned: number;
}
export interface StowageDTO {
    arrivalTime: string;
    associatePaymentCarrierId: number;
    associatePaymentCarrierName: string;
    billingMethod: number;
    businessModelId: number;
    businessModelName: string;
    carrierDispatch: number;
    carrierId: number;
    carrierName: string;
    carrierType: number;
    contactPersons: StowageContactPerson[];
    createTime: string;
    currencyId: number;
    currencyName: string;
    customsId: number;
    departureArea: string;
    departureCity: string;
    departureProvince: string;
    departureStreet: string;
    departureTime: string;
    destinationArea: string;
    destinationCity: string;
    destinationProvince: string;
    destinationStreet: string;
    driverId: number;
    driverName: string;
    id: number;
    isCustomsClearance: number;
    numberPlateId: number;
    numberPlateName: string;
    operatorId: number;
    operatorName: string;
    orderRouterSegmentIds: number;
    otherCarCode: string;
    packageRequirement: string;
    phone: string;
    phoneBackup: string;
    portDate: string;
    preConfigured: number;
    quotationId: number;
    quotationLineId: number;
    quotationNumber: string;
    remark: string;
    resourceVehicleId: number;
    resourceVehicleName: string;
    singleNumber: string;
    sixUnionSingleNumber: string;
    specialBusiness: string;
    specialInstruction: string;
    specificationModel: string;
    status: number;
    stowageNumber: string;
    totalBillingWeight: number;
    totalBoardCount: number;
    totalGrossWeight: number;
    totalNetWeight: number;
    totalQuantity: number;
    totalVolume: number;
    transportModeId: number;
    transportModeName: string;
    updateTime: string;
}
export interface StowageQuotationMatchDTO {
    aging: number;
    arrivalTime: string;
    businessModelName: string;
    carrierId: number;
    departureTime: string;
    orderRouterSegmentIds: number;
    projectId: number;
    quotationId: number;
    quotationLineId: number;
    specificationModel: string;
}
export interface StowageRouteConfig {
    address: string;
    arriveTime: string;
    createTime: string;
    id: number;
    latitude: number;
    leaveTime: string;
    longitude: number;
    nodeType: number;
    orderId: number;
    orderRouterSegment: OrderRouterSegmentPageListVo;
    orderRouterSegmentId: number;
    position: number;
    stowage: Stowage;
    stowageId: number;
    transportInfo: TransportInfo;
    updateTime: string;
}
export interface StowageRouterDTO {
    id: number;
    name: string;
    remark: string;
    routerSegments: StowageRouterSegmentDTO[];
    routerStations: StowageRouterStationDTO[];
}
export interface StowageRouterPageListVo {
    createTime: string;
    createUser: string;
    createUserId: number;
    endStation: string;
    id: number;
    name: string;
    operatorId: number;
    operatorName: string;
    remark: string;
    routerStations: StowageRouterStation[];
    startStation: string;
    status: number;
    updateTime: string;
}
export interface StowageRouterQueryVo {
    endStation: string;
    endStationId: number;
    keyword: string;
    limit: number;
    offset: number;
    startStation: string;
    startStationId: number;
    transferStation: string;
    transferStationId: number;
}
export interface StowageRouterSegmentAssigner {
    assigner: string;
    assignerId: number;
    id: number;
    operatorId: number;
    operatorName: string;
    segmentId: number;
    updateTime: string;
}
export interface StowageRouterSegmentCarrier {
    carrier: string;
    carrierId: number;
    id: number;
    operatorId: number;
    operatorName: string;
    segmentId: number;
    updateTime: string;
}
export interface StowageRouterSegmentDTO {
    agingDuration: number;
    agingType: number;
    businessModelId: number;
    businessModelName: string;
    customsFlag: number;
    endStation: string;
    endStationId: number;
    endStationIdx: number;
    id: number;
    portId: number;
    portName: string;
    remark: string;
    routerId: number;
    segmentAssigners: SegmentAssignerDTO[];
    segmentCarriers: SegmentCarrierDTO[];
    segmentIdx: number;
    segmentOrganizations: SegmentOrganizationDTO[];
    startStation: string;
    startStationId: number;
    startStationIdx: number;
    transportModeId: number;
    transportModeName: string;
    type: string;
    typeCode: string;
    typeId: number;
}
export interface StowageRouterSegmentOrganization {
    id: number;
    operatorId: number;
    operatorName: string;
    organization: string;
    organizationId: number;
    segmentId: number;
    updateTime: string;
}
export interface StowageRouterSegmentVo {
    agingDuration: number;
    agingType: number;
    businessModelId: number;
    businessModelName: string;
    createTime: string;
    createUser: string;
    createUserId: number;
    customsFlag: number;
    endStation: string;
    endStationId: number;
    endStationIdx: number;
    id: number;
    operatorId: number;
    operatorName: string;
    portId: number;
    portName: string;
    remark: string;
    routerId: number;
    segmentAssigners: StowageRouterSegmentAssigner[];
    segmentCarriers: StowageRouterSegmentCarrier[];
    segmentIdx: number;
    segmentOrganizations: StowageRouterSegmentOrganization[];
    startStation: string;
    startStationId: number;
    startStationIdx: number;
    transportModeId: number;
    transportModeName: string;
    type: string;
    typeCode: string;
    typeId: number;
    updateTime: string;
}
export interface StowageRouterStation {
    address: string;
    addressAliasId: number;
    addressAliasName: string;
    addressType: number;
    areaId: number;
    areaName: string;
    cityId: number;
    cityName: string;
    createTime: string;
    id: number;
    latitude: number;
    longitude: number;
    operatorId: number;
    operatorName: string;
    provinceId: number;
    provinceName: string;
    remark: string;
    routerId: number;
    stationIdx: number;
    stayDuration: number;
    streetId: number;
    streetName: string;
    type: number;
}
export interface StowageRouterStationDTO {
    address: string;
    addressAliasId: number;
    addressAliasName: string;
    addressType: number;
    areaId: number;
    areaName: string;
    cityId: number;
    cityName: string;
    latitude: number;
    longitude: number;
    provinceId: number;
    provinceName: string;
    remark: string;
    stationIdx: number;
    stayDuration: number;
    streetId: number;
    streetName: string;
    type: number;
}
export interface StowageRouterStationSegmentVo {
    id: number;
    name: string;
    remark: string;
    routerSegments: StowageRouterSegmentVo[];
    routerStations: StowageRouterStation[];
}
export interface TraditionalBusiness {
    cabinNumber: string;
    flightNumber: string;
    id: number;
    orderId: number;
    paymentMethodId: number;
    paymentMethodName: string;
    paymentPlace: string;
    portOfDepartureId: number;
    portOfDepartureName: string;
    portOfDestinationId: number;
    portOfDestinationName: string;
    shippingTermsId: number;
    shippingTermsName: string;
    traditionalBusinessReceiverOrSenderList: TraditionalBusinessReceiverOrSender[];
    wayOfDeliveryId: number;
    wayOfDeliveryName: string;
}
export interface TraditionalBusinessReceiverOrSender {
    address: string;
    addressType: number;
    areaId: number;
    areaName: string;
    associatedWarehouseId: number;
    associatedWarehouseName: string;
    cargoPartyCode: string;
    cargoPartyName: string;
    cellphoneNumber: string;
    clientId: number;
    clientName: string;
    companyId: number;
    contactName: string;
    contactNumber: string;
    createTime: string;
    createUser: string;
    defaultShipperId: number;
    defaultShipperName: string;
    detailAddress: string;
    id: number;
    latitude: number;
    longitude: number;
    operatorId: number;
    operatorName: string;
    specialRequirements: string;
    status: number;
    traditionalBusinessId: number;
    type: number;
    updateTime: string;
    updateUser: string;
}
export interface TransportInfo {
    receiveOrSendContactName: string;
    receiveOrSendContactNumber: string;
    receiveOrSendName: string;
    totalBoardCount: number;
    totalBoxCount: number;
    totalGrossWeight: number;
    totalNetWeight: number;
    totalQuantity: number;
    totalVolume: number;
}
export interface UpdateStowageDTO {
    resourceVehicleId: number;
    resourceVehicleName: string;
    singleNumber: string;
    stowageContactPerson: StowageContactPerson;
    stowageId: number;
}
export interface WaybillGoodsInfo {
    cargoTypeClassificationCode: string;
    cargoTypeClassificationName: string;
    cube: number;
    descriptionOfGoods: string;
    goodsItemGrossWeight: number;
    id: number;
    materialsId: number;
    totalNumberOfPackages: number;
    waybillId: number;
}
export interface WaybillInsurance {
    carCode: string;
    carrierId: number;
    carrierName: string;
    createTime: string;
    createUserId: number;
    createUserName: string;
    driverName: string;
    electronicPolicyFlag: number;
    id: number;
    insuredAmount: number;
    insuredCardNumber: string;
    insuredCardType: number;
    insuredEmail: string;
    insuredMobileNumber: string;
    insuredName: string;
    number: string;
    payableAmount: number;
    policyholderCardNumber: string;
    policyholderCardType: number;
    policyholderEmail: string;
    policyholderMobileNumber: string;
    policyholderName: string;
    sendCarId: number;
    sendCarNumber: string;
    updateTime: string;
}
export interface WaybillInsuranceQueryCondition {
    companyId: number;
    endTime: string;
    keywords: string;
    pageNo: number;
    pageSize: number;
    startTime: string;
}
export interface WaybillQueryCondition {
    endTime: string;
    keyword: string;
    limit: number;
    offset: number;
    startTime: string;
    status: number;
}
export interface WaybillVO {
    actualCarrierBusinessLicense: string;
    actualCarrierId: string;
    actualCarrierName: string;
    businessTypeCode: string;
    businessTypeName: string;
    carrier: string;
    clientId: number;
    clientName: string;
    consignmentDateTime: string;
    deleteIds: number;
    driverName: string;
    drivingLicense: string;
    id: number;
    insuranceCompanyCode: string;
    insuranceCompanyName: string;
    operatorId: number;
    operatorName: string;
    orderConsignee: string;
    orderConsigneeId: string;
    orderConsignor: string;
    orderConsignorId: string;
    orderDespatchActualDateTime: string;
    orderGoodsReceiptDateTime: string;
    orderGoodsReceiptPlace: string;
    orderLoadingCountrySubdivisionCode: string;
    orderPlaceOfLoading: string;
    orderReceiptCountrySubdivisionCode: string;
    originalDocumentNumber: string;
    permitNumber: string;
    policyNumber: string;
    remark: string;
    sendCarDespatchActualDateTime: string;
    sendCarGoodsReceiptDateTime: string;
    sendCarGoodsReceiptPlace: string;
    sendCarId: number;
    sendCarLoadingCountrySubdivisionCode: string;
    sendCarNumber: string;
    sendCarPlaceOfLoading: string;
    sendCarReceiptCountrySubdivisionCode: string;
    sendToProDateTime: string;
    serialNumber: string;
    shippingNoteNumber: string;
    status: number;
    totalMonetaryAmount: number;
    transportTypeCode: string;
    transportTypeName: string;
    unifiedSocialCreditIdentifier: string;
    vehicleAmount: number;
    vehicleNumber: string;
    vehiclePlateColorCode: string;
    vehiclePlateColorName: string;
    waybillGoodsInfoList: WaybillGoodsInfo[];
}
export interface 公共分页对象 {
    businessModelName: string;
    carrierId: number;
    driver: string;
    driverId: number;
    endOrderDate: string;
    endWorkDate: string;
    existException: number;
    isCustomsClearance: number;
    keywords: string;
    limit: number;
    offset: number;
    operatorId: number;
    pageNo: number;
    pageSize: number;
    projectIds: number;
    resourceVehicleName: string;
    sixUnionSingleNumber: string;
    source: number;
    startOrderDate: string;
    startWorkDate: string;
    status: number;
    transportMethodName: string;
    transportModeId: number;
}
