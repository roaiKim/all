import { useCallback } from 'react';
import { Button, Table, Input, Select, Popconfirm, Empty, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useProjectStore } from '../../stores/projectStore';
import type { GameVariable, VariableType } from '@shared/types/game';
import { v4 as uuid } from 'uuid';

const TYPE_OPTIONS: { label: string; value: VariableType }[] = [
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolean' },
  { label: '字符串', value: 'string' },
];

/**
 * VariableEditor — manage game variables used for conditions and effects.
 */
export function VariableEditor() {
  const variables = useProjectStore((s) => s.project.variables);
  const addVariable = useProjectStore((s) => s.addVariable);
  const updateVariable = useProjectStore((s) => s.updateVariable);
  const removeVariable = useProjectStore((s) => s.removeVariable);

  const handleAdd = useCallback(() => {
    const v: GameVariable = {
      id: uuid(),
      name: `变量 ${variables.length + 1}`,
      key: `var_${variables.length + 1}`,
      type: 'number',
      defaultValue: 0,
    };
    addVariable(v);
    message.success('已添加变量');
  }, [variables.length, addVariable]);

  const columns = [
    {
      title: '显示名',
      dataIndex: 'name',
      render: (_: unknown, record: GameVariable) => (
        <Input
          size="small"
          value={record.name}
          onChange={(e) => updateVariable(record.id, { name: e.target.value })}
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: 'Key',
      dataIndex: 'key',
      render: (_: unknown, record: GameVariable) => (
        <Input
          size="small"
          value={record.key}
          onChange={(e) => updateVariable(record.id, { key: e.target.value })}
          style={{ width: 120 }}
        />
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 80,
      render: (_: unknown, record: GameVariable) => (
        <Select
          size="small"
          value={record.type}
          onChange={(v) => updateVariable(record.id, { type: v })}
          options={TYPE_OPTIONS}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      render: (_: unknown, record: GameVariable) => {
        if (record.type === 'boolean') {
          return (
            <Select
              size="small"
              value={String(record.defaultValue)}
              onChange={(v) => updateVariable(record.id, { defaultValue: v === 'true' })}
              options={[
                { label: 'true', value: 'true' },
                { label: 'false', value: 'false' },
              ]}
              style={{ width: 80 }}
            />
          );
        }
        return (
          <Input
            size="small"
            value={String(record.defaultValue ?? '')}
            onChange={(e) => {
              const val = record.type === 'number' ? Number(e.target.value) : e.target.value;
              updateVariable(record.id, { defaultValue: val });
            }}
            style={{ width: 100 }}
          />
        );
      },
    },
    {
      title: '',
      width: 40,
      render: (_: unknown, record: GameVariable) => (
        <Popconfirm title="确定删除？" onConfirm={() => removeVariable(record.id)}>
          <Button type="link" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="editor-variable-editor">
      <div className="editor-variable-header">
        <span>变量 ({variables.length})</span>
        <Button type="primary" icon={<PlusOutlined />} size="small" onClick={handleAdd}>
          添加变量
        </Button>
      </div>

      {variables.length === 0 ? (
        <Empty description="暂无变量" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <Table
          dataSource={variables}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
          scroll={{ y: 400 }}
        />
      )}
    </div>
  );
}
