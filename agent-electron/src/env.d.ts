/// <reference types="@rsbuild/core/types" />

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module '*.svg?react' {
  import type React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare interface ModuleStatement {
    /**
     * name: 必须要的 是模块名称同时也是模块的路径
     */
    name: string;
    /**
     * 模块显示名称
     */
    title: string;
    /**
     * 主要是为了 兼容 旧项目 如果是新项目 则可以不用
     */
    path?: string;
    /**
     * 菜单图片
     */
    icon?: string;
    /**
     * 是否显示
     */
    disabled?: boolean;
    /**
     * 顺序 暂无用处
     */
    order?: number;
    /**
     * page组件
     * 可以是异步的(用async封装) 推荐
     * 也可以同步的 知道导入
     */
    component: ComponentType<any>;
}

interface Window {
    electronAPI?: {
        isElectron: boolean;
        platform: string;
        versions: Record<string, string>;
        file: {
            read: (filePath: string) => Promise<any>;
            write: (filePath: string, content: string) => Promise<any>;
            list: (dirPath: string) => Promise<any>;
        };
        media: {
            importMaterials: () => Promise<any>;
        };
    };
}
