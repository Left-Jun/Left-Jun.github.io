# 不备案快速访问方案

这份方案用于备案完成前的过渡部署。目标是尽量提高国内可访问性，同时不触碰中国大陆 CDN/大陆节点必须备案的限制。

## 推荐结构

1. 主站：EdgeOne Pages，区域选择“全球可用区，不含中国大陆”
2. 备用：Vercel Hobby，继续使用当前 GitHub 仓库自动构建
3. 后备：GitHub Pages，保留原始静态站发布链路

这样做的好处是：不用先备案，也不用更换现有 Hugo 结构；GitHub 推送后可以同时触发不同平台构建。访问速度会比单独 GitHub Pages 更稳，但它仍然不是中国大陆 CDN，所以不能保证所有地区都像备案后的大陆节点一样快。

## EdgeOne Pages 设置

- Framework Preset: Hugo
- Build Command: `hugo --gc --minify`
- Output Directory: `public`
- Install Command: `git submodule update --init --recursive`
- Environment Variables:
  - `HUGO_VERSION=0.155.2`
  - `HUGO_ENV=production`
  - `HUGO_ENVIRONMENT=production`
- 加速区域：选择“不含中国大陆”的全球区域

如果绑定自定义域名但不备案，不要选择中国大陆或全球含中国大陆加速。等备案完成后，再把同一个域名切换到中国大陆加速区域。

## Vercel 保留方式

仓库里已经有 `vercel.json`，可以继续保留：

```json
{
  "framework": "hugo",
  "installCommand": "git submodule update --init --recursive",
  "buildCommand": "hugo --gc --minify",
  "outputDirectory": "public"
}
```

Vercel 的免费域名可作为备用入口。等后续有正式域名后，可以把 `www` 或 `vercel` 子域名指向 Vercel，把主域名留给 EdgeOne 或后续备案后的大陆 CDN。

## 域名建议

备案前：

- `example.com` 指向 EdgeOne Pages 海外/全球不含大陆
- `vercel.example.com` 指向 Vercel
- `github.example.com` 或 GitHub Pages 默认域名作为后备

备案后：

- `example.com` 切换到 EdgeOne 中国大陆/全球加速，或腾讯云 COS + CDN
- 页脚增加备案号链接
- 再考虑打开评论区、表单、动态接口等互动能力

## 当前不建议做的事

- 不建议把未备案域名强行接入中国大陆 CDN。
- 不建议备案前把评论、论坛、用户投稿等互动功能作为主站重点。
- 不建议现在购买大量流量包；这个站点体积很小，备案后按量付费通常已经足够。
