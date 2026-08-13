import { useEffect } from 'react';
import { message } from 'antd';
import { useProjectStore } from './stores/projectStore';
import { useEditorStore } from './stores/editorStore';
import { Toolbar } from './components/Toolbar';
import { StoryFlow } from './components/StoryFlow';
import { NodeEditor } from './components/NodeEditor';
import { ResourceManager } from './components/ResourceManager';
import { VariableEditor } from './components/VariableEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { ExportDialog } from './components/ExportDialog';

/**
 * Editor App — 剪映式单窗口三栏布局：
 * - 左栏：场景列表 / 素材 / 变量
 * - 中栏：当前选中场景的属性编辑（对话/选项/跳转）
 * - 右栏：实时预览（编辑即时同步，所见即所得）
 *
 * 一个命令启动：yarn tauri dev 或 yarn dev
 * 不需要第二个窗口，编辑与预览在同一界面。
 */
function App() {
  const project = useProjectStore((s) => s.project);
  const isDirty = useProjectStore((s) => s.isDirty);
  const selectedTab = useEditorStore((s) => s.selectedTab);
  const setTab = useEditorStore((s) => s.setTab);
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

  // Render the left panel based on the selected tab
  const renderLeftPanel = () => {
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

      {/* Main 3-column layout */}
      <div className="editor-main">
        {/* Left sidebar — scenes / resources / variables */}
        <aside className="editor-sider editor-sider-left">
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
          <div className="editor-sider-content">{renderLeftPanel()}</div>
        </aside>

        {/* Center — scene property editor */}
        <main className="editor-content">
          <NodeEditor />
        </main>

        {/* Right — live preview */}
        <aside className="editor-sider editor-sider-right">
          <PreviewPanel />
        </aside>
      </div>

      {/* Export dialog */}
      {isExportDialogOpen && <ExportDialog />}
    </div>
  );
}

export default App;
