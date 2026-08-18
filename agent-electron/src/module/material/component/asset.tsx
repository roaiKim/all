import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { actions } from "module/material";
import { mediaFile, mediaUrl } from "service/electron";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";

interface AssetProps {}

function Asset(props: AssetProps) {
    const dispatch = useDispatch();
    const material = useSelector((state: RootState) => state.app.material);
    const { materials } = material;

    const handleUpload = async () => {
        const imported = await mediaFile.importMaterials();
        if (imported.length) {
            dispatch(actions.addMaterials(imported));
        }
    };

    console.log("materials", materials);
    return (
        <div className={joinLessPrefix("asset-container")}>
            <div className="asset asset-add" onClick={handleUpload}>
                <span>上传素材</span>
                <PlusOutlined style={{ fontSize: 24, marginTop: 5 }} />
            </div>
            {materials.map((item) => (
                <div key={item.uid} className="asset asset-thumbnail">
                    <div className="asset-thumbnail-title">{item.name}</div>
                    <DeleteOutlined className="asset-delete" style={{ fontSize: 16 }} onClick={() => dispatch(actions.deleteMaterial(item.uid))} />
                    {item.type === "image" ? (
                        <img src={mediaUrl(item.thumb)} alt={item.name} />
                    ) : (
                        <video src={mediaUrl(item.path)} muted preload="metadata" playsInline />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Asset;
