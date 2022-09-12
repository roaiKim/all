import { AdvancedTableResponse } from "@api/AdvancedTableService";
import { Table } from "antd";
import "./index.less";
import { useColumns } from "./useColumns";

interface Signature {
    name: string;
    fetch: any;
}
interface PageTableProps<T> {
    signature: Signature;
    tableSource: AdvancedTableResponse<T>;
}

export function PageTable<T extends object>(props: PageTableProps<T>) {
    const { signature, tableSource } = props;
    const { name, fetch } = signature;
    const { data } = tableSource;

    const { columns } = useColumns({
        moduleName: name,
        fetch,
    });

    if (!columns) {
        return <div>上传配置</div>;
    }

    return (
        <div className="ro-page-table">
            <Table size="small" rowKey="id" bordered dataSource={data || []} columns={columns} />
        </div>
    );
}
