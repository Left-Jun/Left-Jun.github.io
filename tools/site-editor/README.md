# Left Jun Site Editor

本地内容编辑器，用来管理当前 Hugo 作品集站的 Markdown 内容和侧栏状态。

## 使用

```powershell
cd C:\Users\MR\Desktop\Hugo\Left_Jun
node .\tools\site-editor\server.js
```

然后打开 `http://127.0.0.1:4177/`。

编辑器只读写仓库内白名单路径：

- `content/`
- `hugo.yaml`
- `static/img/`

它不会自动提交 Git；保存后可以在编辑器里运行 Hugo 构建，再回到 Codex 或终端提交。

## 能编辑什么

- 打开或新建 `posts`、`projects`、`retrospectives`、`plans` 下的 Markdown 内容。
- 编辑常用 front matter：标题、slug、日期、草稿、描述、封面、分类、标签、显式关联。
- 项目页可编辑 `portfolioType`、`roleTags`、`projectFacts`、`projectLinks`。
- 头像旁小状态支持中英文 emoji、标题和描述。
- 保存前会校验标题、日期格式和 JSON 字段，避免把错误字段静默写回。
