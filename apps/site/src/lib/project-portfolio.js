export const PROJECT_PORTFOLIO_TYPES = ["game", "embedded", "web"];
export const PROJECT_PORTFOLIO_FILTERS = ["all", ...PROJECT_PORTFOLIO_TYPES];
export const DEFAULT_CORE_PROJECT_COUNT = 3;

function finiteRank(value) {
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

function projectTimestamp(entry) {
  const value = entry?.data?.updatedAt || entry?.data?.date;
  const timestamp = value instanceof Date ? value.getTime() : new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function projectIdentity(entry) {
  return String(entry?.ref || entry?.id || entry?.slug || entry?.url || "");
}

export function compareFeaturedProjects(left, right) {
  const featuredWeight = finiteRank(left?.data?.featuredWeight) - finiteRank(right?.data?.featuredWeight);
  if (featuredWeight !== 0) return featuredWeight;
  const pinWeight = finiteRank(left?.data?.pinWeight) - finiteRank(right?.data?.pinWeight);
  if (pinWeight !== 0) return pinWeight;
  const date = projectTimestamp(right) - projectTimestamp(left);
  if (date !== 0) return date;
  return projectIdentity(left).localeCompare(projectIdentity(right));
}

export function compareFallbackProjects(left, right) {
  const pinWeight = finiteRank(left?.data?.pinWeight) - finiteRank(right?.data?.pinWeight);
  if (pinWeight !== 0) return pinWeight;
  const weight = finiteRank(left?.data?.weight) - finiteRank(right?.data?.weight);
  if (weight !== 0) return weight;
  const date = projectTimestamp(right) - projectTimestamp(left);
  if (date !== 0) return date;
  return projectIdentity(left).localeCompare(projectIdentity(right));
}

export function selectCoreProjects(projects, limit = DEFAULT_CORE_PROJECT_COUNT) {
  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_CORE_PROJECT_COUNT;
  const selected = [...projects]
    .filter((entry) => entry?.data?.featured === true)
    .sort(compareFeaturedProjects)
    .slice(0, safeLimit);
  const selectedIds = new Set(selected.map(projectIdentity));

  if (selected.length < safeLimit) {
    const fallback = [...projects]
      .filter((entry) => !selectedIds.has(projectIdentity(entry)))
      .sort(compareFallbackProjects)
      .slice(0, safeLimit - selected.length);
    selected.push(...fallback);
  }

  return selected;
}

export function splitProjectPortfolio(projects, limit = DEFAULT_CORE_PROJECT_COUNT) {
  const core = selectCoreProjects(projects, limit);
  const coreIds = new Set(core.map(projectIdentity));
  return {
    core,
    archive: projects.filter((entry) => !coreIds.has(projectIdentity(entry)))
  };
}

export function projectPortfolioType(entry) {
  const type = String(entry?.data?.portfolioType || "");
  return PROJECT_PORTFOLIO_TYPES.includes(type) ? type : "other";
}

export function buildProjectTypeCounts(projects) {
  const counts = Object.fromEntries(PROJECT_PORTFOLIO_FILTERS.map((type) => [type, 0]));
  counts.all = projects.length;
  projects.forEach((entry) => {
    const type = projectPortfolioType(entry);
    if (type in counts) counts[type] += 1;
  });
  return counts;
}

export function normalizeProjectFilter(value, allowed = PROJECT_PORTFOLIO_FILTERS) {
  const requested = String(value || "all");
  return allowed.includes(requested) ? requested : "all";
}

export function projectMatchesFilter(entry, filter) {
  const normalized = normalizeProjectFilter(filter);
  return normalized === "all" || projectPortfolioType(entry) === normalized;
}

export function filterProjectSections(sections, requestedFilter) {
  const filter = normalizeProjectFilter(requestedFilter);
  const core = sections.core.filter((entry) => projectMatchesFilter(entry, filter));
  const archive = sections.archive.filter((entry) => projectMatchesFilter(entry, filter));
  return {
    filter,
    core,
    archive,
    coreVisible: core.length > 0,
    archiveVisible: archive.length > 0,
    visibleCount: core.length + archive.length
  };
}
