import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import Empty from "@component/Empty";
import { actions } from "@pages/task/receipt-records";
import { View } from "@tarojs/components";
import { useReachBottom } from "@tarojs/taro";
import { RootState } from "@type/state";
import RecordCard from "./record-card";
import RecordDetailModal from "./record-detail-modal";
import "./index.less";

function ReceiptRecords(props: ReturnType<typeof mapStateToProps>) {
    const { records, total, loading, loadingMore, detail } = props;
    const dispatch = useDispatch();
    const [detailVisible, setDetailVisible] = useState(false);

    const openDetail = (podId: string) => {
        setDetailVisible(true);
        dispatch(actions.openDetail(podId));
    };

    useReachBottom(() => {
        if (loading || loadingMore || records.length >= total) {
            return;
        }
        dispatch(actions.loadMore());
    });

    return (
        <View className="ro-records-page">
            {loading && records.length === 0 && <View className="list-tip">加载中...</View>}
            {!loading && records.length === 0 && <Empty title="暂无签收记录" />}

            {records.map((record) => (
                <RecordCard key={record.podId} record={record} onOpen={() => openDetail(record.podId)} />
            ))}

            {records.length > 0 && (
                <View className="list-footer">{loadingMore ? "加载中..." : records.length >= total ? "没有更多了" : "上拉加载更多"}</View>
            )}

            <RecordDetailModal visible={detailVisible} detail={detail} onClose={() => setDetailVisible(false)} />
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        records: state.app.receiptRecords.records,
        total: state.app.receiptRecords.total,
        detail: state.app.receiptRecords.detail,
        loading: showLoading(state, "receiptRecords"),
        loadingMore: showLoading(state, "receiptRecordsMore"),
    };
};

export default connect(mapStateToProps)(ReceiptRecords);
