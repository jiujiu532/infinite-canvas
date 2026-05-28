<p align="center">
  <img src="web/public/logo.svg" width="96" alt="infinite-canvas logo">
</p>

<h1 align="center">infinite-canvas</h1>

<p align="center">面向图片创作的开源无限画布工作台</p>

<p align="center">
  <a href="https://github.com/jiujiu532/infinite-canvas/actions"><img src="https://github.com/jiujiu532/infinite-canvas/actions/workflows/docker-image.yml/badge.svg" alt="Docker Build"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="License"></a>
</p>

---

## 简介

infinite-canvas 把画布编排、AI 图片/视频生成、参考图编辑、对话助手、提示词库和素材管理整合在同一个界面中，适合探索视觉方案并连续迭代创作结果。

> **注意：** 项目处于活跃开发阶段，数据库结构和存储格式可能随时调整，当前更适合个人/本地部署。

## 核心功能

| 功能 | 说明 |
|------|------|
| 无限画布 | 多画布项目、节点拖拽缩放、连线、小地图、撤销重做、导入导出 |
| AI 创作 | 支持 OpenAI 兼容接口的文生图、图生图、参考图编辑、视频生成、文本问答 |
| 画布助手 | 围绕选中节点和上游节点对话/生图，结果自动插回画布 |
| 提示词库 | 从多个 GitHub 开源项目抓取，按案例整理数百个图片提示词 |
| 每日签到 | 用户每日签到获得随机算力点，管理员可配置范围 |
| 用户体系 | 账号密码注册、Linux.do OAuth、算力点计费、注册赠送算力点 |
| 管理后台 | 渠道管理、用户管理、算力点调整、提示词管理、系统配置 |

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | Next.js, React, TypeScript, Tailwind CSS, Ant Design, Zustand |
| 后端 | Go, Gin, GORM (SQLite / MySQL / PostgreSQL) |
| 部署 | Docker, Docker Compose |

## 快速开始

### Docker 部署（推荐）

```bash
git clone https://github.com/jiujiu532/infinite-canvas.git
cd infinite-canvas
cp .env.example .env
# 编辑 .env 修改管理员账号密码等配置
docker-compose up -d
```

### 本地源码构建

```bash
cp .env.example .env
docker compose -f docker-compose.local.yml up -d --build
```

启动后访问 `http://localhost:3000`。

管理后台：使用管理员账号登录后，点击头像进入管理后台。


## 配置说明

### 环境变量

参考 `.env.example` 文件，主要配置项：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `ADMIN_USERNAME` | 管理员用户名 | admin |
| `ADMIN_PASSWORD` | 管理员密码 | infinite-canvas |
| `JWT_SECRET` | JWT 签名密钥 | 请修改为随机字符串 |
| `PORT` | 服务端口 | 3000 |

### 管理后台配置

在管理后台 > 设置 > 私有配置中可配置：

- **注册控制**：允许注册（全局开关）、允许密码注册（仅关闭密码注册，LinuxDo 仍可用）
- **签到配置**：签到最小/最大算力点（每日签到随机获得该范围内的算力点）
- **注册初始算力点**：新用户注册时赠送的算力点数量
- **模型渠道**：配置 OpenAI 兼容的 API 渠道、模型列表、权重
- **Linux.do OAuth**：配置第三方登录
- **提示词定时同步**：Cron 表达式控制同步频率


## 效果展示

<table width="100%">
  <tr>
    <td width="50%"><img src="https://i.ibb.co/TDFvGWDT/image.png" alt="画布编辑" border="0"></td>
    <td width="50%"><img src="https://i.ibb.co/zVwJq3YS/image.png" alt="AI生图" border="0"></td>
  </tr>
  <tr>
    <td width="50%"><img src="https://i.ibb.co/PvY3qhhK/image.png" alt="提示词库" border="0"></td>
    <td width="50%"><img src="https://i.ibb.co/7D04LwN/image.png" alt="管理后台" border="0"></td>
  </tr>
  <tr>
    <td width="50%"><img src="https://i.ibb.co/bj30FtS5/5.png" alt="画布助手" border="0"></td>
    <td width="50%"><img src="https://i.ibb.co/hxRvjw51/image.png" alt="生图工作台" border="0"></td>
  </tr>
</table>

## 文档

- [功能介绍](docs/features.md)
- [部署说明](docs/deployment.md)
- [画布节点操作手册](docs/canvas-node-manual.md)
- [画布快捷键](docs/canvas-shortcuts.md)
- [后端数据库说明](docs/backend-database.md)
- [系统配置数据结构](docs/system-settings.md)
- [接口响应约定](docs/api-response.md)

## 开源协议

本项目基于 [GNU Affero General Public License v3.0](LICENSE) 开源。

基于 [basketikun/infinite-canvas](https://github.com/basketikun/infinite-canvas) 二次开发。
