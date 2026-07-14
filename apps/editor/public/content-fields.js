const sectionOnlyKeys = [
  "kind",
  "contribution",
  "result",
  "portfolioType",
  "featured",
  "featuredWeight",
  "homeHeroWeight",
  "pinWeight",
  "projectFacts",
  "projectLinks",
  "columnIds"
];

function setOptional(next, key, value) {
  if (value === undefined || value === null || value === "") return;
  next[key] = value;
}

export function sectionFieldPolicy(section) {
  const isProject = section === "projects";
  const isUpdate = section === "updates";
  const isPost = section === "posts";
  return {
    isProject,
    isUpdate,
    isPost,
    showFeatured: isProject || isUpdate || isPost,
    showLinks: isProject || isUpdate,
    featuredLabel: isUpdate ? "精选动态" : isPost ? "精选文章" : "首页代表项目",
    featuredWeightLabel: isUpdate ? "精选动态权重" : isPost ? "精选文章权重" : "代表项目权重",
    linksLabel: isUpdate ? "证据链接 JSON" : "项目链接 JSON",
    mediaHint: isUpdate
      ? "图片和视频用于动态卡片/详情页；标签用于筛选和关联。"
      : isProject
        ? "图片和视频用于项目卡片/详情页；标签用于筛选和关联。"
        : isPost
          ? "封面用于精选与文章卡片；专栏归属使用稳定的英文 ID。"
          : "图片和视频用于列表/详情页；标签用于筛选和关联。",
    detailsTitle: isUpdate ? "资源与动态证据" : isProject ? "资源与项目细节" : isPost ? "文章资源" : "内容资源",
    detailsHint: isUpdate
      ? "资源按钮会自动填入封面字段；证据链接可填写演示、源码、视频或报告。"
      : isProject
        ? "资源按钮会自动填入封面字段；JSON 字段主要给项目页补充团队、周期、链接等细节。"
        : "资源按钮会自动填入封面字段。"
  };
}

export function applySectionMetadata(frontMatter = {}, section, values = {}) {
  const next = { ...frontMatter };
  for (const key of sectionOnlyKeys) delete next[key];

  if (section === "projects") {
    next.portfolioType = String(values.portfolioType || "").trim();
    next.featured = Boolean(values.featured);
    setOptional(next, "featuredWeight", values.featuredWeight);
    setOptional(next, "homeHeroWeight", values.homeHeroWeight);
    setOptional(next, "pinWeight", values.pinWeight);
    setOptional(next, "projectFacts", values.projectFacts);
    setOptional(next, "projectLinks", values.projectLinks);
  } else if (section === "updates") {
    next.kind = String(values.kind || "").trim();
    setOptional(next, "contribution", String(values.contribution || "").trim());
    setOptional(next, "result", String(values.result || "").trim());
    if (values.featured) next.featured = true;
    setOptional(next, "featuredWeight", values.featuredWeight);
    setOptional(next, "projectLinks", values.projectLinks);
  } else if (section === "posts") {
    const columnIds = Array.isArray(values.columnIds)
      ? [...new Set(values.columnIds.map((value) => String(value).trim()).filter(Boolean))]
      : [];
    if (columnIds.length > 0) next.columnIds = columnIds;
    if (values.featured) next.featured = true;
    setOptional(next, "featuredWeight", values.featuredWeight);
  }

  return next;
}
