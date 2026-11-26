import { AtIcon } from "taro-ui";
import { DriverExecutionAttachment } from "@api/DriverExecutionService";
import { Text, View } from "@tarojs/components";
import { formatFileSize } from "@utils/functions";

interface AttachmentListProps {
    files: DriverExecutionAttachment[];
    onPreview: (file: DriverExecutionAttachment) => void;
    onRemove: (file: DriverExecutionAttachment) => void;
}

function AttachmentList(props: AttachmentListProps) {
    const { files, onPreview, onRemove } = props;

    if (files.length === 0) {
        return <View className="attach-empty">暂无凭证</View>;
    }
    return (
        <View className="attach-list">
            {files.map((file) => (
                <View className="attach-file" key={file.attachmentId}>
                    <AtIcon value="file-jpg" size={16} />
                    <Text className="attach-name">{file.fileName || "签收凭证"}</Text>
                    <Text className="attach-size">{formatFileSize(file.fileSize)}</Text>
                    <Text className="attach-action" onClick={() => onPreview(file)}>
                        查看
                    </Text>
                    {file.canDelete !== false && (
                        <Text className="attach-action danger" onClick={() => onRemove(file)}>
                            删除
                        </Text>
                    )}
                </View>
            ))}
        </View>
    );
}

export default AttachmentList;
