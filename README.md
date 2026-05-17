# 齐大植物大战僵尸（qida-pvz）

一个基于原生 HTML/CSS/JavaScript 实现的网页小游戏，主题为“齐齐哈尔大学校园保卫战”。

## 📄 项目页面描述

齐大植物大战僵尸是一个轻量、开箱即玩的网页塔防小游戏：玩家通过放置不同植物抵御僵尸进攻，逐步解锁关卡与无尽模式，并可通过昵称系统参与本地排行榜竞争。项目采用原生前端实现，配合 Node.js 简易服务提供静态页面与成绩接口，适合课程展示、前端练习与小游戏二次开发。

## ✨ 功能特性

- 经典植物大战僵尸玩法（放置、防守、闯关）
- 多关卡与无尽模式
- 本地排行榜与昵称系统（Node.js 简易接口）
- 移动端与桌面端适配 UI

## 📁 项目结构

```text
.
├── css/                  # 样式文件
├── js/                   # 游戏逻辑模块
├── data/                 # 本地数据（昵称、排行榜）
├── index.html            # 开发入口页面
├── 齐大植物大战僵尸.html   # 打包后的单文件页面
├── merge.js              # 合并脚本（生成单文件 HTML）
└── server.js             # 本地静态与 API 服务
```

## 🚀 快速开始

### 1) 环境要求

- Node.js 16+（推荐 LTS）

### 2) 启动项目

```bash
node server.js
```

启动后访问：

- http://localhost:3000

## 📦 主要接口

- `GET /api/nicknames`：获取已占用昵称
- `POST /api/nickname`：注册/修改昵称
- `GET /api/leaderboard`：获取排行榜
- `POST /api/leaderboard`：提交成绩

## 🤝 贡献指南

欢迎提交 Issue 与 PR，详细规则见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 🔒 安全问题

如发现安全问题，请参考 [SECURITY.md](./SECURITY.md)。

## 📜 行为准则

社区行为规范见 [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)。

## 📝 变更记录

版本记录见 [CHANGELOG.md](./CHANGELOG.md)。
