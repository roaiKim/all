import { AdvancedTableResponse } from "@api/AdvancedTableService";
import { Pagination, PaginationProps, Table } from "antd";
import { LoadingSVG } from "components/loadingSVG";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useElementResizeObserver } from "utils/hooks/useElementResizeObserver";
import { v4 } from "uuid";
import { PageTitle } from "./header";
import "./index.less";
import { useColumns } from "./useColumns";

interface Signature {
    name: string;
    fetch: any;
}
interface PageTableProps<T> {
    height?: number;
    signature: Signature;
    tableSource: AdvancedTableResponse<T>;
}

const showTotal: PaginationProps["showTotal"] = (total) => `共 ${total} 条`;

export function PageTable<T extends object>(props: PageTableProps<T>) {
    const { signature, tableSource, height: originHeight } = props;
    const { name, fetch } = signature;
    const { data, total, pageIndex, pageSize } = tableSource;

    const [containerId] = useState(v4());
    const { width, height } = useElementResizeObserver(document.querySelector(".ro-module-body"));

    const { columns } = useColumns({
        moduleName: name,
        fetch,
    });

    /**
     * 高度控制
     */
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

    // console.log("--PageTable--", width, height, originHeight);
    if (!columns) {
        return <div>上传配置</div>;
    }
    return (
        <div className="ro-page-table" id={`ro-table-container-${containerId}`}>
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
                // loading={{
                //     spinning: true,
                //     indicator: <LoadingSVG />,
                // }}
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
        </div>
    );
}

PageTable.header = PageTitle;
