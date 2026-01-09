# CSS Grid 布局详解
CSS Grid 布局（网格布局）是 CSS 中最强大的**二维布局系统**，专门用于同时处理**行和列**的布局排列。相比 Flex 布局（一维布局，仅能沿单行或单列排列），Grid 更适合构建复杂的页面整体布局、卡片网格、仪表盘等场景。

## 一、核心概念
在使用 CSS Grid 前，需要先理解几个基础核心术语，这是掌握 Grid 的关键：

| 术语 | 定义 |
|------|------|
| **网格容器（Grid Container）** | 应用 `display: grid;` 的父元素，所有直接子元素会自动成为「网格项」 |
| **网格项（Grid Item）** | 网格容器的**直接子元素**，孙子元素不直接参与外层网格布局 |
| **网格线（Grid Line）** | 划分网格的分界线，分为列网格线（垂直）和行网格线（水平），编号从 `1` 开始（支持负编号，从末尾倒数） |
| **网格轨道（Grid Track）** | 相邻两条网格线之间的区域，即「行」（水平轨道）和「列」（垂直轨道） |
| **网格单元格（Grid Cell）** | 行和列交叉形成的最小单位，类似表格的单元格 |
| **网格区域（Grid Area）** | 由多个相邻单元格组成的矩形区域，可命名和自定义布局 |

### 基础结构示例
```html
<div class="grid-container">
  <div class="grid-item">项1</div> <!-- 网格项 -->
  <div class="grid-item">项2</div> <!-- 网格项 -->
  <div>
    <p>项3的子元素</p> <!-- 非网格项，不参与外层网格布局 -->
  </div>
</div>
```

## 二、核心属性（网格容器）
网格容器的属性是布局的核心，用于定义网格的行、列、间距、对齐方式等。

### 1. 定义网格容器
```css
.grid-container {
  display: grid; /* 块级网格（默认占满父容器宽度） */
  /* display: inline-grid; 行内网格（宽度由内容决定） */
}
```

### 2. 定义行和列（核心）
| 属性 | 作用 | 常用取值 |
|------|------|----------|
| `grid-template-columns` | 定义列轨道的宽度和数量 | 具体长度（`px`/`rem`）、百分比（`%`）、`fr` 单位、`repeat()`、`minmax()`、`auto` |
| `grid-template-rows` | 定义行轨道的高度和数量 | 同列属性取值 |

#### 取值说明
- **`fr` 单位**：网格剩余空间的分配比例（自适应布局首选）
- **`repeat()` 函数**：简化重复值，语法 `repeat(重复次数, 轨道尺寸)`
- **`minmax(min, max)`**：定义轨道的最小/最大尺寸，适配响应式
- **`auto`**：自动适应内容或容器尺寸

#### 常用示例
```css
.grid-container {
  display: grid;
  /* 3列：第1列200px，第2、3列按1:2分配剩余空间 */
  grid-template-columns: 200px 1fr 2fr;
  /* 2行：每行高度自适应内容，最小不低于100px */
  grid-template-rows: repeat(2, minmax(100px, auto));
}
```

### 3. 网格间距
用于设置网格项之间的间距，不影响网格容器与外部元素的间距。
```css
.grid-container {
  row-gap: 15px; /* 行间距（上下网格项之间） */
  column-gap: 20px; /* 列间距（左右网格项之间） */
  gap: 15px 20px; /* 简写：先行后列 */
  gap: 15px; /* 简写：行、列间距相同 */
}
```

### 4. 网格对齐（容器级）
用于统一对齐所有网格项，分为**行轴（水平）** 和 **列轴（垂直）** 两个方向。

| 属性 | 作用 | 常用取值 |
|------|------|----------|
| `justify-items` | 所有网格项沿行轴对齐 | `start`/`end`/`center`/`stretch`（默认） |
| `align-items` | 所有网格项沿列轴对齐 | `start`/`end`/`center`/`stretch`（默认） |
| `place-items` | 简写：`align-items + justify-items` | `center`（水平垂直居中，常用） |
| `justify-content` | 整个网格在父元素中行轴对齐（网格总宽 < 父容器宽） | `start`/`end`/`center`/`space-between`/`space-around` |
| `align-content` | 整个网格在父元素中列轴对齐（网格总高 < 父容器高） | 同 `justify-content` |
| `place-content` | 简写：`align-content + justify-content` | - |

#### 对齐示例
```css
/* 所有网格项水平垂直居中 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  place-items: center;
  height: 500px; /* 需设置容器高度，才能看到垂直居中效果 */
}
```

### 5. 网格区域命名
通过 `grid-template-areas` 给网格区域命名，配合网格项的 `grid-area` 属性，实现直观的布局（无需计算网格线）。

```css
.grid-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 60px;
  /* 定义区域布局，"" 内为一行，空格分隔列 */
  grid-template-areas:
    "header header"   /* 第1行：header 占两列 */
    "sidebar main"    /* 第2行：sidebar+main 各占一列 */
    "footer footer";  /* 第3行：footer 占两列 */
  gap: 10px;
  height: 100vh;
}

/* 网格项关联命名区域 */
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

**注意**
- 命名区域必须是**矩形**，不能是不规则形状
- 用 `.` 表示空单元格（无网格项填充）

## 三、核心属性（网格项）
网格项的属性用于单独控制某个网格项的布局，覆盖容器的统一设置。

### 1. 网格项定位（通过网格线）
通过指定网格线编号，确定网格项占据的行和列范围。

| 属性 | 简写形式 | 作用 |
|------|----------|------|
| `grid-column-start` + `grid-column-end` | `grid-column: 起始线 / 结束线` | 定义网格项占据的列范围 |
| `grid-row-start` + `grid-row-end` | `grid-row: 起始线 / 结束线` | 定义网格项占据的行范围 |

#### 定位示例
```css
/* 网格项占据第1列到第3列（跨2列），第1行到第2行（跨1行） */
.grid-item-1 {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}

/* 支持负编号：从第2列到最后一列 */
.grid-item-2 {
  grid-column: 2 / -1;
}
```

### 2. 网格项对齐（单独控制）
| 属性 | 作用 | 常用取值 |
|------|------|----------|
| `justify-self` | 单个网格项沿行轴对齐 | `start`/`end`/`center`/`stretch` |
| `align-self` | 单个网格项沿列轴对齐 | `start`/`end`/`center`/`stretch` |
| `place-self` | 简写：`align-self + justify-self` | `center`（常用） |

#### 对齐示例
```css
/* 单个网格项水平右对齐、垂直居中 */
.grid-item-3 {
  place-self: center end;
}
```

### 3. 网格区域关联
配合容器的 `grid-template-areas` 使用，直接关联命名区域。
```css
.grid-item-header {
  grid-area: header; /* 对应容器中 header 命名区域 */
}
```

## 四、响应式网格布局（无需媒体查询）
Grid 提供 `auto-fill`/`auto-fit` + `minmax()` 的组合，可实现无媒体查询的自适应网格，自动根据容器宽度调整列数和列宽。

### 1. 核心语法
```css
.grid-container {
  display: grid;
  /* 最小列宽280px，自动填充列数，剩余空间平均分配 */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
```

### 2. `auto-fill` vs `auto-fit`
- **`auto-fill`**：尽可能多的填充列（即使最后一列无内容，也会保留空列空间）
- **`auto-fit`**：自适应填充列，将空列空间分配给现有列（让现有列拉伸填满容器）

## 五、Grid 与 Flex 布局的区别（适用场景）
Grid 和 Flex 是互补关系，而非替代关系，二者结合可高效实现各类布局需求。

| 特性 | CSS Grid 布局 | CSS Flex 布局 |
|------|---------------|---------------|
| 布局维度 | 二维（行 + 列，同时控制） | 一维（单行或单列，沿一个轴排列） |
| 适用场景 | 页面整体布局、复杂网格、卡片墙、仪表盘 | 组件内部布局、导航栏、列表、元素对齐 |
| 响应式难度 | 低（`auto-fill` + `minmax()` 无需媒体查询） | 高（需媒体查询调整方向/换行） |
| 核心优势 | 整体布局能力强，支持复杂区域划分 | 单行/单列布局灵活，对齐方式丰富 |

**总结**
- 「**整体布局**」用 Grid（如页面的头、尾、侧边栏、主内容区）
- 「**局部组件**」用 Flex（如导航栏的菜单、卡片内部的内容对齐）

## 六、完整示例（复杂网格布局）
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Grid 完整示例</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
    }

    /* 页面整体网格布局 */
    .page-container {
      display: grid;
      grid-template-columns: 240px 1fr;
      grid-template-rows: 60px 1fr 60px;
      grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
      gap: 0;
      height: 100vh;
    }

    /* 网格项样式 */
    .header {
      grid-area: header;
      background-color: #3B82F6;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .sidebar {
      grid-area: sidebar;
      background-color: #F3F4F6;
      padding: 1rem;
    }

    .main {
      grid-area: main;
      padding: 1rem;
      /* 主内容区内部网格：自适应卡片布局 */
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      overflow-y: auto;
    }

    .footer {
      grid-area: footer;
      background-color: #1F2937;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* 卡片样式 */
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1.5rem;
      transition: transform 0.2s;
    }

    .card:hover {
      transform: translateY(-5px);
    }
  </style>
</head>
<body>
  <div class="page-container">
    <header class="header">网站头部</header>
    <aside class="sidebar">侧边导航</aside>
    <main class="main">
      <div class="card">卡片 1</div>
      <div class="card">卡片 2</div>
      <div class="card">卡片 3</div>
      <div class="card">卡片 4</div>
      <div class="card">卡片 5</div>
    </main>
    <footer class="footer">网站底部 © 2026</footer>
  </div>
</body>
</html>
```

## 七、兼容性与总结
### 1. 兼容性
支持所有现代浏览器（Chrome、Firefox、Edge、Safari 10.1+），无需担心兼容问题。

### 2. 核心总结
1. CSS Grid 是**二维布局系统**，核心优势是同时控制行和列，适合复杂布局；
2. 核心容器属性：`display: grid`、`grid-template-columns/rows`、`gap`、`place-items`；
3. 核心项目属性：`grid-column/row`、`place-self`、`grid-area`；
4. 响应式最佳实践：`repeat(auto-fit, minmax(最小宽度, 1fr))`；
5. 与 Flex 互补：Grid 管整体，Flex 管局部，二者结合效率最高。
