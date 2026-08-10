import { useEffect } from 'react';
import { Layout, message } from 'antd';
import { useProjectStore } from './stores/projectStore';
import { useEditorStore } from './stores/editorStore';
import { Toolbar } from './components/Toolbar';
import { StoryFlow } from './components/StoryFlow';
import { NodeEditor } from './components/NodeEditor';
import { ResourceManager } from './components/ResourceManager';
import { VariableEditor } from './components/VariableEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { ExportDialog } from './components/ExportDialog';

const { Sider, Content } = Layout;

/**
 * Editor App — main layout with 3-panel design:
 * - Left: Scene list / flow
 * - Center: Story flow canvas (main area)
 * - Right: Node editor / properties panel (collapsible)
 * - Bottom: Preview panel (toggleable)
 */
function App() {
  const project = useProjectStore((s) => s.project);
  const isDirty = useProjectStore((s) => s.isDirty);
  const selectedTab = useEditorStore((s) => s.selectedTab);
  const setTab = useEditorStore((s) => s.setTab);
  const isNodeEditorOpen = useEditorStore((s) => s.isNodeEditorOpen);
  const isPreviewPanelOpen = useEditorStore((s) => s.isPreviewPanelOpen);
  const isExportDialogOpen = useEditorStore((s) => s.isExportDialogOpen);
  const loadDemo = useProjectStore((s) => s.loadDemo);

  // Load demo on first visit
  useEffect(() => {
    if (project.scenes.length === 0) {
      loadDemo();
      message.info('已加载 Demo 项目，开始编辑吧！');
    }
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Render the appropriate side panel based on tab
  const renderSidePanel = () => {
    switch (selectedTab) {
      case 'resources':
        return <ResourceManager />;
      case 'variables':
        return <VariableEditor />;
      case 'flow':
      default:
        return <StoryFlow />;
    }
  };

  return (
    <div className="editor-root">
      {/* Top toolbar */}
      <Toolbar />

      {/* Main layout */}
      <Layout className="editor-layout">
        {/* Left sidebar — scene flow / resources / variables */}
        <Sider width={280} className="editor-sider" theme="dark">
          <div className="editor-sider-tabs">
            <button
              className={`editor-sider-tab ${selectedTab === 'flow' ? 'active' : ''}`}
              onClick={() => setTab('flow')}
            >
              场景列表
            </button>
            <button
              className={`editor-sider-tab ${selectedTab === 'resources' ? 'active' : ''}`}
              onClick={() => setTab('resources')}
            >
              素材
            </button>
            <button
              className={`editor-sider-tab ${selectedTab === 'variables' ? 'active' : ''}`}
              onClick={() => setTab('variables')}
            >
              变量
            </button>
          </div>
          <div className="editor-sider-content">{renderSidePanel()}</div>
        </Sider>

        {/* Center — main canvas area */}
        <Content className="editor-content">
          <div className="editor-canvas">
            <div className="editor-canvas-placeholder">
              <div className="editor-canvas-title">{project.meta.title || '未命名项目'}</div>
              <div className="editor-canvas-hint">
                从左侧场景列表选择一个场景进行编辑
                <br />
                或点击工具栏的「预览」按钮测试游戏
              </div>
            </div>
          </div>
        </Content>

        {/* Right sidebar — node editor (collapsible) */}
        {isNodeEditorOpen && (
          <Sider width={320} className="editor-sider editor-sider-right" theme="dark">
            <NodeEditor />
          </Sider>
        )}
      </Layout>

      {/* Preview panel (toggleable bottom panel) */}
      {isPreviewPanelOpen && <PreviewPanel />}

      {/* Export dialog */}
      {isExportDialogOpen && <ExportDialog />}
    </div>
  );
}

export default App;
