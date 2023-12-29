import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Action } from "@core";
import { Button, ConfigProvider, Input, Pagination, PaginationProps, Table, TableProps } from "antd";
import { v4 } from "uuid";
import { AdvancedTableSource } from "type/api.type";
import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { Spinning } from "components/common/components/loading";
import { LoadingSVG } from "components/loadingSVG";
import { nameToPath } from "utils/function/loadComponent";
import { useElementResizeObserver } from "utils/hooks/useElementResizeObserver";
import { usePageLoading } from "utils/hooks/useLoading";
import { useModuleName } from "utils/hooks/useModuleName";
import { pageEmpty } from "./empty";
import { PageTitle } from "./header";
import { RenderEmpty } from "./render-empty";
import { ColumnsService } from "./type";
import { useColumns } from "./useColumns";
import { useDataSource } from "./useDataSource";
import { transformSelected } from "./utils";
import "./index.less";

const { Search } = Input;

interface Signature {
    name: string;
    actions: any;
}

// type RowSelection<T> = Omit<TableProps<T>["rowSelection"], "selectedRowKeys"> & { selectedRowKeys: any };
// interface AntTableProps<T> {
//     rowSelection: TableProps<T>["rowSelection"];
//     pagination: TableProps<T>["pagination"];
// }

type OverrideAntdPertity = "columns" | "pagination";

type ExcludeAntTableProps<T> = Omit<TableProps<T>, OverrideAntdPertity>;

interface PageTableProps<T> extends ExcludeAntTableProps<TableProps<T>> {
    /**
     * 是否是普通表格 (普通表格没有高级查询，列设置及搜索)
     */
    static?: boolean;
    /**
     * 列渲染参数
     */
    colService: typeof ColumnsService;
    /**
     *
     * @param request 表格的高级查询 自动获取
     * @returns
     */
    action?: (request?: Partial<any>) => Action<[request?: Partial<any>]>;
    /**
     * 用于表头请求的code
     */
    tableCode?: string;
    /**
     * 表格的高度
     * 如果无值
     * 1. 如果 page 会自动计算
     * 2. 非 page 会有默认值
     */
    height?: number;
    /**
     * 列表数据
     */
    tableSource: AdvancedTableSource<T>;
    /**
     * 是否是高级表格
     */
    advanced?: boolean;
    /**
     * 是否在主页面中 该值会影响计算表格的高度
     */
    page?: boolean;
    /**
     * 是否显示表格的选择框
     */
    isNoneSelect?: boolean;
    /**
     * 是否显示分页
     */
    isNonePagination?: boolean;
    /**
     * 是否显示序号
     */
    isNoneOrder?: boolean;
    /**
     * loading
     */
    loading?: boolean;
    /**
     * 分页器左边 DOM
     */
    paginationBefore?: React.ReactNode;
}

const showTotal: PaginationProps["showTotal"] = (total) => `共 ${total} 条`;
const defaultHeight = 165;

/**
 * @description 表格
 * @param props PageTableProps
 * @returns
 */
export function PageTable<T extends Record<string, any>>(props: PageTableProps<T>) {
    const {
        tableSource,
        height: originHeight,
        isNoneSelect,
        isNonePagination,
        loading,
        action,
        tableCode,
        rowSelection,
        page,
        colService,
        isNoneOrder,
        paginationBefore,
        ...restProps
    } = props;

    const { source } = tableSource;
    const { data, pageIndex, pageSize, total } = source || {};
    const dispatch = useDispatch();
    const containerRef = useRef({ elementRef: null, height: 0 });
    const [containerId] = useState(v4());

    /**
     * 依赖集合
     */
    const [dependent, setDependent] = useState({
        colunmDependent: "", // 表头 依赖
        sourceDependent: "", // 表格数据 依赖
    });

    /**
     * 获取表格是否loading，只有传action且page=true有效
     */
    const tableLoading = usePageLoading();

    // const { width, height } = useElementResizeObserver(document.querySelector(".ro-module-body"));

    /**
     * 模块的 moduleName
     */
    const moduleName = useModuleName();

    /**
     * 获取表头
     */
    const { columnLoading, columnError, columnInitialed, columns } = useColumns({
        moduleName: tableCode || nameToPath[moduleName] || moduleName,
        dependent: dependent.colunmDependent,
        colService,
        isNoneOrder,
        pageIndex,
        pageSize,
    });

    /**
     * 拉取数据
     */
    useEffect(() => {
        if (columnInitialed && action) {
            dispatch(action());
        }
    }, [columnInitialed, dependent.sourceDependent]);

    // useDataSource({
    //     fetch: actions.fetchPageTable,
    //     sourceRely,
    // });

    const updateColAndSource = (type: "col" | "source") => {
        // if (type === "col") {
        //     setColRely(v4());
        // } else if (type === "source") {
        //     setSourceRely(v4());
        // }
    };

    // 高度控制
    // useEffect(() => {
    //     try {
    //         if (!containerRef.current.elementRef) {
    //             containerRef.current.elementRef = document.querySelector(`#ro-table-container-${containerId} .ant-table-body`);
    //         }
    //         const container: any = containerRef.current.elementRef;
    //         if (!container) return;

    //         // const containerHeight = Number((container.style.height || "").replace("px", ""));
    //         if (!originHeight) {
    //             const h = height - defaultHeight;
    //             if (h === containerRef.current.height) return;
    //             container.style.height = `${h}px`;
    //             containerRef.current.height = h;
    //         } else {
    //             if (containerRef.current.height === originHeight) return;
    //             container.style.height = `${originHeight}px`;
    //             containerRef.current.height = originHeight;
    //         }
    //     } catch (e) {
    //         console.error("设置table高度失败 table-id:" + containerId, e);
    //     }
    // }, [height, data]);

    function pageTableChange(pagination, filters, sorter, extra: { currentDataSource: any[]; action: "paginate" | "sort" | "filter" }) {
        console.log("--table-", pagination, filters, sorter, extra);
        if (extra.action === "paginate") {
            const { current, pageSize } = pagination;
            // dispatch(actions.fetchPageTable({ pageNo: current, pageSize }));
        }
    }

    /**
     * 表头加载失败
     */
    if (columnInitialed && !columnError && !columns) {
        return pageEmpty({
            error: true,
            titleError: "暂无表格数据",
            handlerName: "生成",
            handler: () => {
                // updateColAndSource("col");
            },
            style: { marginTop: 20 },
        });
    } else if (columnInitialed && columnError) {
        return pageEmpty({
            error: true,
            titleError: "表格数据加载失败",
            handler: () => {
                updateColAndSource("col");
            },
            style: { marginTop: 20 },
        });
    }

    return (
        <div className="ro-table-container" id={`ro-table-container-${containerId}`}>
            <ConfigProvider
                // 无数据渲染
                renderEmpty={() => <RenderEmpty />}
            >
                <div className="ro-page-table-title ro-flex ro-col-center">
                    <div className="ro-flex ro-col-center" style={{ height: 34 }}>
                        <div>
                            <DeleteOutlined />
                            <a style={{ marginLeft: 5 }}>清空条件</a>
                        </div>
                        <Search
                            size="small"
                            placeholder="搜索"
                            allowClear
                            onSearch={() => {
                                // dispatch(actions.fetchPageTable());
                            }}
                            style={{ width: 200, marginLeft: 10 }}
                        />
                    </div>
                    <div className="ro-grow" style={{ marginLeft: 10 }}></div>
                    <Button icon={<SettingOutlined />} size="small" />
                </div>

                <Table
                    // 表格的
                    style={{ maxWidth: "100%", overflow: "hidden", ...({ "--ro-table-container-height": `500px` } as any) }}
                    className={`${data?.length ? "" : "ro-table-no-content"}`}
                    size="small"
                    rowKey="id"
                    bordered
                    dataSource={data || []}
                    columns={columns}
                    /**
                     * 解决高度问题
                     */
                    scroll={{
                        // x: "100%",
                        y: "var(--ro-table-container-height)", //originHeight || height - defaultHeight,
                    }}
                    loading={{
                        spinning: columnLoading || tableLoading,
                        indicator: <LoadingSVG />,
                    }}
                    onChange={pageTableChange}
                    pagination={false}
                    /**
                     * 分页
                     */
                    // {...(!isNonePagination
                    //     ? {
                    //           pagination: {
                    //               showSizeChanger: true,
                    //               size: "small",
                    //               total: Number(total) || 0,
                    //               current: pageIndex,
                    //               pageSize,
                    //               showTotal,
                    //               pageSizeOptions: [20, 50, 100, 200],
                    //               ...(pagination || {}),
                    //           },
                    //       }
                    //     : { pagination: false })}
                    /**
                     * 选择数据
                     */
                    {...(!isNoneSelect
                        ? {
                              rowSelection: {
                                  fixed: true,
                                  type: "checkbox",
                                  ...(rowSelection || {}),
                                  ...(rowSelection?.selectedRowKeys ? { selectedRowKeys: transformSelected(rowSelection.selectedRowKeys, props.rowKey) } : {}),
                              },
                          }
                        : {})}
                    {...restProps}
                />
                <div style={{ display: "flex", alignItems: "center", height: 39 }}>
                    <div style={{ flexGrow: 1 }}>{paginationBefore || null}</div>
                    <div style={{ marginRight: 15 }}>已勾选 2 项</div>
                    {!isNonePagination && (
                        <Pagination
                            size="small"
                            total={Number(total) || 0}
                            pageSize={pageSize}
                            current={pageIndex}
                            showSizeChanger
                            pageSizeOptions={[20, 50, 100, 200]}
                            showTotal={showTotal}
                            onChange={(page, pageSize) => {
                                dispatch(action({ pageSize, pageNo: page }));
                            }}
                        />
                    )}
                </div>
            </ConfigProvider>
        </div>
    );
}

PageTable.header = PageTitle;
