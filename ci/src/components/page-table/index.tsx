import { AdvancedTableResponse } from "@api/AdvancedTableService";
import { ConfigProvider, Pagination, PaginationProps, Table } from "antd";
import { LoadingSVG } from "components/loadingSVG";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AdvancedTableSource } from "type";
import { useElementResizeObserver } from "utils/hooks/useElementResizeObserver";
import { v4 } from "uuid";
import { pageEmpty } from "./empty";
import { PageTitle } from "./header";
import "./index.less";
import { useColumns } from "./useColumns";
import { useDataSource } from "./useDataSource";

interface Signature {
    name: string;
    actions: any;
}
interface PageTableProps<T> {
    height?: number;
    signature: Signature;
    tableSource: AdvancedTableSource["table"];
}

const showTotal: PaginationProps["showTotal"] = (total) => `共 ${total} 条`;

export function PageTable<T extends object>(props: PageTableProps<T>) {
    const { signature, tableSource, height: originHeight } = props;
    const { name, actions } = signature;
    const { source, sourceLoading, sourceLoadError } = tableSource;
    const { data, pageIndex, pageSize, total } = source || {};

    const [containerId] = useState(v4());
    const [colRely, setColRely] = useState(v4()); // 表格依赖
    const [sourceRely, setSourceRely] = useState(v4()); // 表格数据依赖
    const { width, height } = useElementResizeObserver(document.querySelector(".ro-module-body"));

    const { columnLoading, columnLoadError, columns } = useColumns({
        moduleName: name,
        rely: colRely,
    });

    useDataSource({
        fetch: actions.fetchPageTable,
        sourceRely,
    });

    // 高度控制
    useEffect(() => {
        try {
            const container = document.querySelector(`#ro-table-container-${containerId} .ant-table-body`);
            if (!container) return;
            if (!originHeight) {
                (container as any).style.height = `${height - 133}px`;
            } else {
                (container as any).style.height = `${originHeight}px`;
            }
        } catch (e) {
            console.error("设置table高度失败 table-id:" + containerId, e);
        }
    }, [height]);

    // console.log("--PageTable-columns-", columns, columnLoadError);
    if (columnLoadError) {
        return pageEmpty({ error: true, titleError: "暂无表格数据", handlerName: "上传", handler: () => {}, style: { marginTop: 20 } });
    } else if (!columns) {
        console.log("--2-");
        return <div>上传配置</div>;
    }
    return (
        <div className="ro-page-table" id={`ro-table-container-${containerId}`}>
            <ConfigProvider renderEmpty={() => pageEmpty({ error: sourceLoadError, handler: () => {} })}>
                <Table
                    size="small"
                    rowKey="id"
                    bordered
                    dataSource={data || []}
                    columns={columns}
                    scroll={{
                        x: width,
                        y: originHeight || height - 133,
                    }}
                    loading={{
                        spinning: columnLoading || sourceLoading,
                        indicator: <LoadingSVG />,
                    }}
                    pagination={{
                        showSizeChanger: true,
                        size: "small",
                        total: Number(total) || 0,
                        current: pageIndex,
                        pageSize,
                        showTotal,
                        pageSizeOptions: [20, 50, 100, 200],
                    }}
                />
            </ConfigProvider>
        </div>
    );
}

PageTable.header = PageTitle;
