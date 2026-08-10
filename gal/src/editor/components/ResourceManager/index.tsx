import { useCallback, useRef } from 'react';
import { Button, List, Empty, message, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../stores/projectStore';
import { SUPPORTED_ASSETS } from '@shared/constants/defaults';
import type { AssetItem } from '@shared/types/game';
import { v4 as uuid } from 'uuid';

type AssetType = 'videos' | 'images' | 'audios';

const TYPE_LABELS: Record<AssetType, string> = {
  videos: '视频',
  images: '图片',
  audios: '音频',
};

/**
 * ResourceManager — manage project assets (videos, images, audio).
 * Supports drag-drop import and manual path entry.
 */
export function ResourceManager() {
  const assets = useProjectStore((s) => s.project.assets);
  const addAsset = useProjectStore((s) => s.addAsset);
  const removeAsset = useProjectStore((s) => s.removeAsset);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();

        let type: AssetType | null = null;
        if (SUPPORTED_ASSETS.video.includes(ext)) type = 'videos';
        else if (SUPPORTED_ASSETS.image.includes(ext)) type = 'images';
        else if (SUPPORTED_ASSETS.audio.includes(ext)) type = 'audios';

        if (type) {
          const asset: AssetItem = {
            id: uuid(),
            name: file.name,
            path: `assets/${type}/${file.name}`,
            size: file.size,
            mimeType: file.type,
          };
          addAsset(type, asset);
        }
      }

      if (files.length > 0) {
        message.success(`已导入 ${files.length} 个文件`);
      }

      // Reset input
      e.target.value = '';
    },
    [addAsset],
  );

  const handleManualAdd = useCallback(
    (type: AssetType) => {
      const name = prompt(`输入${TYPE_LABELS[type]}名称：`);
      if (!name) return;
      const path = prompt('输入文件路径（相对于项目目录）：');
      if (!path) return;

      const asset: AssetItem = {
        id: uuid(),
        name,
        path,
        size: 0,
      };
      addAsset(type, asset);
    },
    [addAsset],
  );

  return (
    <div className="editor-resource-manager">
      <div className="editor-resource-header">
        <span>素材管理</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} size="small" onClick={handleImportClick}>
            导入
          </Button>
        </Space>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/*,image/*,audio/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {(['videos', 'images', 'audios'] as AssetType[]).map((type) => (
        <div key={type} className="editor-resource-group">
          <div className="editor-resource-group-header">
            <span>
              {TYPE_LABELS[type]} ({assets[type].length})
            </span>
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => handleManualAdd(type)}
            />
          </div>

          {assets[type].length === 0 ? (
            <div className="editor-resource-empty">— 暂无素材 —</div>
          ) : (
            <List
              size="small"
              dataSource={assets[type]}
              renderItem={(item) => (
                <List.Item
                  className="editor-resource-item"
                  actions={[
                    <Popconfirm
                      key="delete"
                      title="确定移除此素材？"
                      onConfirm={() => removeAsset(type, item.id)}
                    >
                      <Button type="link" danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta title={item.name} description={item.path} />
                </List.Item>
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
