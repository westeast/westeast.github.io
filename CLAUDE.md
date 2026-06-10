# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **VuePress 1.x blog** using the `vuepress-theme-vdoing` theme. It is a static-site blog and knowledge base authored in Markdown, covering topics like coding, investing, and technology. The site is deployed to GitHub Pages.

## Tech Stack

- **VuePress**: 1.9.9 (static site generator)
- **Theme**: `vuepress-theme-vdoing` (knowledge-management & blog theme)
- **Node.js**: >= 18.0.0
- **Package Manager**: npm / yarn

## Common Commands

```bash
# Development (Windows)
npm run dev:win

# Production build (Windows)
npm run build:win

# Deploy to GitHub Pages
npm run deploy

# Push changes to develop branch
git push origin develop
```

> **Note**: The `dev` and `build` scripts use `export` (Unix), while `dev:win` and `build:win` use `set` (Windows). On Windows, always use the `:win` variants.

## Project Structure

```
├── docs/                          # Main content directory
│   ├── .vuepress/
│   │   ├── config.ts              # VuePress site config (nav, theme, plugins)
│   │   ├── config/
│   │   │   ├── baiduCode.ts      # Baidu analytics token
│   │   │   ├── htmlModules.ts    # Custom HTML ad/modules injection
│   │   │   └── sidebar.js        # (unused) Manual sidebar reference
│   │   ├── enhanceApp.js         # Vue app enhancement hook
│   │   └── plugins/              # Custom VuePress plugins
│   ├── index.md                 # Homepage (hero text, features)
│   ├── 00.目录页/                # Catalogue/index pages for each category
│   ├── 01.编码/                  # Coding articles
│   ├── 02.投资/                  # Investing articles
│   ├── 03.技术/                  # Technology articles
│   └── ...
├── utils/                        # Build & content utilities
│   ├── check.js                  # OS check for dev/build scripts
│   ├── editFrontmatter.js        # Batch edit Markdown frontmatter
│   ├── config.yml                # Config for editFrontmatter.js
│   └── modules/                  # Helper modules for utils
├── vdoing/                       # Local copy of vuepress-theme-vdoing (optional override)
├── package.json
└── deploy.sh                     # Deployment script to GitHub Pages
```

## Article Frontmatter Convention

Every Markdown article in `docs/` must include frontmatter at the top:

```yaml
---
title: Article Title
date: YYYY-MM-DD HH:mm:ss
permalink: /pages/xxxxxx/       # Unique permanent link
categories:
  - Category Name
tags:
  - Tag Name
author:
  name: westeast
  link: https://github.com/westeast.github.io
---
```

### Optional frontmatter fields

- `titleTag`: e.g. `最新` — displays a badge next to the title.
- `sticky: 1` — pins the article to the top of its category list.
- `sidebar: false` — disables the sidebar on the page.
- `article: false` — marks the page as a custom page (not an article).
- `comment: false` — disables comments on the page.
- `editLink: false` — hides the "Edit" link.

## Architecture Notes

### Content Organization

- Articles are organized under `docs/` using **numbered directory prefixes** (e.g., `01.编码`, `02.投资`) to control sidebar ordering.
- The theme uses **auto-structured sidebars** (`sidebar: 'structuring'` in config). As long as files are placed in the correct directories, the sidebar and catalogue pages are generated automatically.
- **Catalogue pages** (`00.目录页/`) use a special `Catalogue` page component and must set `article: false`.

### Directory & Article Numbering Rules (创建目录及文章时)

1. **目录编号规则**: 所有分类目录必须使用两位数字前缀（如 `01.`、`02.`），按数字顺序排列控制侧边栏显示顺序。
   - 示例：`00.目录页/`, `01.编码/`, `02.投资/`, `03.技术/`

2. **文章编号规则**: 
   - 同一分类下的所有 Markdown 文件必须按数字序号命名（如 `01.flex 布局语法.md`, `02.flex 布局案例 -基础.md`）
   - 使用两位数字前缀，不足补零（如 `06.`、`45.`, `70.`）
   - 编号应反映文章在侧边栏中的显示顺序
   - **序号分配规则**: 新文章的序号应为当前目录中最大序号加1，或由用户指定。例如当前目录已有 `01.xxx.md`、`02.yyy.md`，则新文章应为 `03.zzz.md`

3. **目录及文件命名一致性**: 
   - 每个子分类目录需有独立编号（如 `20.CSS/`, `30.HTML/`, `40.JavaScript/`）
   - 该目录下所有文章的数字前缀应大于父级目录号，保持层级清晰

4. **文件名中不要包含日期**: 文章文件名不要使用 `YYYY-MM-DD-` 等日期前缀，保持简洁的数字序号+标题格式。

### Theme Configuration (`docs/.vuepress/config.ts`)

Key configurations:
- `theme: 'vdoing'` — uses the npm package. To use the local copy, uncomment `theme: resolve(__dirname, '../../vdoing')`.
- `nav` — top navigation bar links.
- `themeConfig.sidebar: 'structuring'` — enables automatic sidebar generation from directory structure.
- `themeConfig.extendFrontmatter` — automatically injects `author` into frontmatter if missing.
- Plugins: sitemap, Baidu autopush/tongji, third-party search, one-click-copy, zooming images, Gitalk comments.

### Deployment (`deploy.sh`)

1. Runs `npm run build` to generate static files into `docs/.vuepress/dist`.
2. Copies `CNAME` into the dist folder.
3. Pushes the dist folder to the `master` branch of the origin remote (GitHub Pages).

## Writing Workflow

1. Create or edit Markdown files under `docs/` with proper frontmatter.
2. Run `npm run dev:win` to preview locally.
3. Verify content, formatting, and sidebar/catalogue rendering.
4. Commit changes and push to the `develop` branch.
5. Run `npm run deploy` (or `bash deploy.sh`) to build and deploy to GitHub Pages.
