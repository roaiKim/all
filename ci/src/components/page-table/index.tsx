import { AdvancedTableResponse } from "@api/AdvancedTableService";
import { Pagination, PaginationProps, Table } from "antd";
import { LoadingSVG } from "components/loadingSVG";
import { useRef } from "react";
import { useContainerRect } from "utils/hooks/useContainerRect";
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

    const tableSignature = useRef(v4());
    const { width, height } = useContainerRect();

    const { columns } = useColumns({
        moduleName: name,
        fetch,
    });

    if (!columns) {
        return <div>上传配置</div>;
    }
    console.log("--PageTable--", width, height);
    return (
        <div className="ro-page-table">
            <Table
                size="small"
                rowKey="id"
                bordered
                dataSource={[]}
                columns={columns}
                scroll={{
                    x: width,
                    y: originHeight || height - 133,
                }}
                loading={{
                    spinning: false,
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
        </div>
    );
}

PageTable.header = PageTitle;
