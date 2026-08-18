import { useDispatch, useSelector } from "react-redux";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { When } from "components/when";
import { actions } from "module/material";
import { mediaFile, mediaUrl } from "service/electron";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import type { AssetMaterial } from "../type";

interface AssetProps {
    showAddButton?: boolean;
    showDeleteButton?: boolean;
    onClick?: (state: AssetMaterial) => void;
}

function extractVideoThumbnail(path: string, width = 320): Promise<string> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        const cleanup = () => {
            video.removeAttribute("src");
            video.load();
        };

        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";
        video.crossOrigin = "anonymous";

        const timer = setTimeout(() => {
            cleanup();
            reject(new Error("视频抽帧超时"));
        }, 30000);

        video.addEventListener("error", () => {
            clearTimeout(timer);
            cleanup();
            const err = video.error;
            reject(new Error(`视频解码失败 (code=${err?.code}, msg=${err?.message})`));
        });

        video.addEventListener("loadedmetadata", () => {
            video.currentTime = Math.min(0.5, video.duration || 0.5);
        });

        video.addEventListener("seeked", () => {
            clearTimeout(timer);
            try {
                const height = Math.round((width * video.videoHeight) / video.videoWidth);
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("canvas 上下文创建失败");
                ctx.drawImage(video, 0, 0, width, height);
                cleanup();
                resolve(canvas.toDataURL("image/png"));
            } catch (err) {
                cleanup();
                reject(err);
            }
        });

        video.src = mediaUrl(path);
    });
}

function Asset(props: AssetProps) {
    const { showAddButton = true, showDeleteButton = true, onClick } = props;
    const dispatch = useDispatch();
    const material = useSelector((state: RootState) => state.app.material);
    const { materials } = material;

    const handleUpload = async () => {
        const imported = await mediaFile.importMaterials();
        if (!imported.length) return;

        const materials = await Promise.all(
            imported.map(async (item) => {
                if (item.type !== "video") return item;
                try {
                    const dataUrl = await extractVideoThumbnail(item.path);
                    const thumb = await mediaFile.saveThumbnail(item.path, dataUrl);
                    return { ...item, thumb };
                } catch (err) {
                    console.error("视频抽帧失败", item.name, err);
                    return item;
                }
            }),
        );

        dispatch(actions.addMaterials(materials));
    };

    console.log("materials", materials);
    return (
        <div className={joinLessPrefix("asset-container")}>
            <When when={showAddButton}>
                <div className="asset asset-add" onClick={handleUpload}>
                    <span>上传素材</span>
                    <PlusOutlined style={{ fontSize: 24, marginTop: 5 }} />
                </div>
            </When>
            {materials.map((material) => (
                <div key={material.uid} className="asset asset-thumbnail" {...(onClick ? { onClick: () => onClick(material) } : {})}>
                    <div className="asset-thumbnail-title">{material.name}</div>
                    <When when={showDeleteButton}>
                        <DeleteOutlined
                            className="asset-delete"
                            style={{ fontSize: 16 }}
                            onClick={() => dispatch(actions.deleteMaterial(material.uid))}
                        />
                    </When>
                    {material.type === "image" || material.thumb !== material.path ? (
                        <img src={mediaUrl(material.thumb)} alt={material.name} />
                    ) : (
                        <video src={mediaUrl(material.path)} muted preload="metadata" playsInline />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Asset;
