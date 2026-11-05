# 主站部署与旧部署记录

本文按 2026-11-06 仓库配置整理。主站使用 Astro 静态构建，发布目标为 https://leftjun.com。

## 当前构建配置

在仓库根目录执行：

- Node.js：`>=22.12 <23`（来自根目录 `package.json`）。
- 安装依赖：`npm ci`。
- 构建：`npm run build:site`。
- 输出目录：`apps/site/dist`。
- Astro 站点地址：`https://leftjun.com`。

旧文档中的 Hugo 构建命令、`public` 输出目录、Hugo 环境变量及子模块安装命令已不适用于当前站点。

## 发布入口

向 GitHub 的 `main` 正常推送后，现有 `.github/workflows/astro-pages.yml` 会运行测试、依赖审计、内容与媒体校验、Astro 检查、构建和链接检查，并部署到 GitHub Pages。也可手动触发该工作流。

仓库同时保留 `vercel.json`，使用 Astro、`npm ci`、`npm run build:site` 和 `apps/site/dist`。这些是仓库配置，不代表已核实 Vercel 当前仍在自动部署。

`edgeone.json` 目前只定义 www 到主域名的重定向，没有记录平台控制台中的构建设置、加速区域或域名绑定。若继续使用 EdgeOne，构建参数应与上面的 Astro 配置保持一致。

发布后应实际检查 `leftjun.com` 上的目标页面与资源。GitHub Actions 成功或备用域名可访问，不能单独证明主域名已经同步。

## 从旧分支保留的 EdgeOne 记录

2026-05-21 的旧分支 `agent-task/ifotay6k67yr` 曾在部署文档中记录：当时已启用“不含中国大陆，全球加速”。这是历史记录，本次没有登录控制台核实当前状态。

该分支有用的说明是：加速区域在 EdgeOne Pages 控制台设置，不需要通过修改网站代码来切换。以后检查或迁移部署时，应在控制台核对实际区域、域名绑定及构建设置，不能仅凭这份历史文档判断配置已经生效。

旧分支还保留了将来调整区域时核对备案状态、按需更新页脚备案信息的维护提示。具体切换条件以届时平台要求为准；本文不作为当前备案规则说明。

以上说明已提取到主分支文档，旧任务分支无需继续保留。
