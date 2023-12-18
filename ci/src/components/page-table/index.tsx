import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Action } from "@core";
import { Button, ConfigProvider, Input, PaginationProps, Table, TableProps } from "antd";
import { v4 } from "uuid";
import { AdvancedTableSource } from "type/api.type";
import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { Spinning } from "components/common/components/loading";
import { LoadingSVG } from "components/loadingSVG";
import { nameToPath } from "utils/function/loadComponent";
import { useElementResizeObserver } from "utils/hooks/useElementResizeObserver";
import { useModuleName } from "utils/hooks/useModuleName";
import { pageEmpty } from "./empty";
import { PageTitle } from "./header";
import { useColumns } from "./useColumns";
import { useDataSource } from "./useDataSource";
import { transformSelected } from "./utils";
import "./index.less";

const { Search } = Input;

interface Signature {
    name: string;
    actions: any;
}

type RowSelection<T> = Omit<TableProps<T>["rowSelection"], "selectedRowKeys"> & { selectedRowKeys: any };

interface PageTableProps<T> extends TableProps<T> {
    action: (request?: Partial<any>) => Action<[request?: Partial<any>]>;
    height?: number;
    // signature: Signature;
    tableSource: any; // AdvancedTableSource<T>;
    rowSelection?: RowSelection<T>;
    isNoneSelect?: boolean;
    isNonePagination?: boolean;
    tableLoading?: boolean;
}

const showTotal: PaginationProps["showTotal"] = (total) => `共 ${total} 条`;
const defaultHeight = 165;

/**
 * @description 表格
 * @param props PageTableProps
 * @returns
 */
export function PageTable<T extends Record<string, any>>(props: PageTableProps<T>) {
    const { tableSource, height: originHeight, isNoneSelect, isNonePagination, tableLoading } = props;
    // const { name, actions } = signature;
    const { source, sourceLoadError } = tableSource;
    const { data, pageIndex, pageSize, total } = source || {};

    const dispatch = useDispatch();
    const containerRef = useRef({ elementRef: null, height: 0 });
    const [containerId] = useState(v4());
    const [colRely, setColRely] = useState(v4()); // 表格依赖
    const [sourceRely, setSourceRely] = useState(v4()); // 表格数据依赖
    const { width, height } = useElementResizeObserver(document.querySelector(".ro-module-body"));

    const moduleName = useModuleName();

    const { columnLoading, columnError, columnInitialed, columns } = useColumns({
        moduleName: nameToPath[moduleName] || moduleName,
        dependent: colRely,
    });

    // useDataSource({
    //     fetch: actions.fetchPageTable,
    //     sourceRely,
    // });

    const updateColAndSource = (type: "col" | "source") => {
        if (type === "col") {
            setColRely(v4());
        } else if (type === "source") {
            setSourceRely(v4());
        }
    };

    // 高度控制
    useEffect(() => {
        try {
            if (!containerRef.current.elementRef) {
                containerRef.current.elementRef = document.querySelector(`#ro-table-container-${containerId} .ant-table-body`);
            }
            const container: any = containerRef.current.elementRef;
            if (!container) return;

            // const containerHeight = Number((container.style.height || "").replace("px", ""));
            if (!originHeight) {
                const h = height - defaultHeight;
                if (h === containerRef.current.height) return;
                container.style.height = `${h}px`;
                containerRef.current.height = h;
            } else {
                if (containerRef.current.height === originHeight) return;
                container.style.height = `${originHeight}px`;
                containerRef.current.height = originHeight;
            }
        } catch (e) {
            console.error("设置table高度失败 table-id:" + containerId, e);
        }
    }, [height, data]);

    function pageTableChange(pagination, filters, sorter, extra: { currentDataSource: any[]; action: "paginate" | "sort" | "filter" }) {
        console.log("--table-", pagination, filters, sorter, extra);
        if (extra.action === "paginate") {
            const { current, pageSize } = pagination;
            // dispatch(actions.fetchPageTable({ pageNo: current, pageSize }));
        }
    }

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
        <div className="ro-page-table" id={`ro-table-container-${containerId}`}>
            <ConfigProvider
                renderEmpty={() =>
                    pageEmpty({
                        error: sourceLoadError,
                        handler: () => {
                            updateColAndSource("source");
                        },
                    })
                }
            >
                <Spinning loading={false} initialized>
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
                        size="small"
                        rowKey={props.rowKey || "id"}
                        bordered
                        dataSource={data || []}
                        columns={columns}
                        scroll={{
                            x: width,
                            y: originHeight || height - defaultHeight,
                        }}
                        // loading={{
                        //     spinning: columnLoading || tableLoading,
                        //     indicator: <LoadingSVG />,
                        // }}
                        onChange={pageTableChange}
                        {...(!isNonePagination
                            ? {
                                  pagination: {
                                      showSizeChanger: true,
                                      size: "small",
                                      total: Number(total) || 0,
                                      current: pageIndex,
                                      pageSize,
                                      showTotal,
                                      pageSizeOptions: [20, 50, 100, 200],
                                      ...props.pagination,
                                  },
                              }
                            : { pagination: false })}
                        {...(!isNoneSelect
                            ? {
                                  rowSelection: {
                                      fixed: true,
                                      type: "checkbox",
                                      ...props.rowSelection,
                                      ...(props.rowSelection?.selectedRowKeys
                                          ? { selectedRowKeys: transformSelected(props.rowSelection.selectedRowKeys, props.rowKey) }
                                          : {}),
                                  },
                              }
                            : {})}
                    />
                </Spinning>
            </ConfigProvider>
        </div>
    );
}

PageTable.header = PageTitle;
