const CONFIG = {
  org: "iridyne",
  hero: {
    kicker: "Applied AI Lab for real-world systems",
    title: "Build. Ship. Validate.",
    copy: "Iridyne builds production-minded AI systems across medical multimodal research and developer infrastructure.",
    copyZh: "我们专注可落地 AI：医疗多模态系统 + 开发者基础设施。",
    primaryCtaLabel: "Explore Repositories",
    primaryCtaHref: "https://github.com/iridyne",
    secondaryCtaLabel: "See Showcase",
    secondaryCtaHref: "#repos",
  },
  repos: {
    title: "Repository Showcase",
    subtitle: "Ordered by flagship priority, originality, freshness, and stars.",
    maxItems: 24,
    cacheTtlMs: 10 * 60 * 1000,
    hiddenRepoPatterns: [/\.github$/i, /archive/i, /deprecated/i, /template/i],
    featuredRepos: ["medfusion", "cinnabar", "prism"],
    demotedForkRepos: ["SMuRF_MultiModal"],
    excludedRepos: ["iridyne.github.io"],
  },
};

const SELECTOR = {
  repoGrid: document.getElementById("repoGrid"),
  repoStatus: document.getElementById("repoStatus"),
  heroCard: document.getElementById("heroCard"),
};

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function setLink(id, label, href) {
  const node = document.getElementById(id);
  if (!node) return;
  node.textContent = label;
  node.href = href;
}

function hydrateContent() {
  setText("heroKicker", CONFIG.hero.kicker);
  setText("heroTitle", CONFIG.hero.title);
  setText("heroCopy", CONFIG.hero.copy);
  setText("heroCopyZh", CONFIG.hero.copyZh);
  setLink("heroPrimaryCta", CONFIG.hero.primaryCtaLabel, CONFIG.hero.primaryCtaHref);
  setLink("heroSecondaryCta", CONFIG.hero.secondaryCtaLabel, CONFIG.hero.secondaryCtaHref);

  setText("reposTitle", CONFIG.repos.title);
  setText("reposSubtitle", CONFIG.repos.subtitle);
}

function formatDate(dateLike) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function fallbackSummary(repo) {
  const source = `${repo.name} ${repo.language || ""}`.toLowerCase();
  if (source.includes("medical") || source.includes("med")) {
    return "Applied medical intelligence project with a focus on multimodal modeling and practical reliability.";
  }

  if (source.includes("speech") || source.includes("voice") || source.includes("audio")) {
    return "Speech and voice tooling project optimized for local-first workflows and production constraints.";
  }

  if (source.includes("infra") || source.includes("ops") || source.includes("tool")) {
    return "Developer infrastructure project for repeatable workflows and higher engineering velocity.";
  }

  return "Active Iridyne repository focused on practical engineering and sustained iteration.";
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function isRepoHidden(repoName) {
  if (CONFIG.repos.excludedRepos.some((name) => name.toLowerCase() === repoName.toLowerCase())) {
    return true;
  }

  return CONFIG.repos.hiddenRepoPatterns.some((pattern) => pattern.test(repoName));
}

function sortRepos(repos) {
  const featuredRank = new Map(CONFIG.repos.featuredRepos.map((name, index) => [name.toLowerCase(), index]));
  const demotedForkSet = new Set(CONFIG.repos.demotedForkRepos.map((name) => name.toLowerCase()));

  return repos.sort((a, b) => {
    const rankA = featuredRank.has(a.name.toLowerCase()) ? featuredRank.get(a.name.toLowerCase()) : Number.MAX_SAFE_INTEGER;
    const rankB = featuredRank.has(b.name.toLowerCase()) ? featuredRank.get(b.name.toLowerCase()) : Number.MAX_SAFE_INTEGER;
    if (rankA !== rankB) return rankA - rankB;

    const demotedA = a.fork && demotedForkSet.has(a.name.toLowerCase()) ? 1 : 0;
    const demotedB = b.fork && demotedForkSet.has(b.name.toLowerCase()) ? 1 : 0;
    if (demotedA !== demotedB) return demotedA - demotedB;

    if (a.fork !== b.fork) return a.fork ? 1 : -1;

    const updatedDiff = new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    if (updatedDiff !== 0) return updatedDiff;

    return b.stargazers_count - a.stargazers_count;
  });
}

function normalizeRepos(repos) {
  const visible = repos.filter((repo) => !repo.archived && !repo.disabled && !isRepoHidden(repo.name));
  return sortRepos(visible).slice(0, CONFIG.repos.maxItems);
}

function renderRepo(repo, index) {
  const card = el("article", "repo-card");
  card.style.transitionDelay = `${Math.min(index * 35, 280)}ms`;

  const head = el("div", "repo-head");
  const link = el("a", "repo-name", repo.name);
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noreferrer";

  head.appendChild(link);

  if (repo.fork) {
    head.appendChild(el("span", "chip chip-fork", "Fork"));
  } else if (repo.language) {
    head.appendChild(el("span", "chip", repo.language));
  }

  const meta = el("p", "repo-meta", `★ ${repo.stargazers_count} · Forks ${repo.forks_count} · Updated ${formatDate(repo.updated_at)}`);
  const desc = el("p", "repo-desc", repo.description || fallbackSummary(repo));

  card.append(head, meta, desc);
  return card;
}

function observeReveal() {
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("on");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 },
  );

  items.forEach((item) => io.observe(item));
}

function attachTilt() {
  const heroCard = SELECTOR.heroCard;
  if (!heroCard) return;

  heroCard.addEventListener("mousemove", (event) => {
    const rect = heroCard.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left) / rect.width;
    const pointerY = (event.clientY - rect.top) / rect.height;
    const rotateX = (pointerY - 0.5) * -6;
    const rotateY = (pointerX - 0.5) * 8;
    heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  heroCard.addEventListener("mouseleave", () => {
    heroCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

function cacheKey() {
  return `org_repos_${CONFIG.org}`;
}

function readRepoCache() {
  try {
    const raw = localStorage.getItem(cacheKey());
    if (!raw) return null;

    const cached = JSON.parse(raw);
    if (!cached.items || !cached.timestamp) return null;

    if (Date.now() - cached.timestamp > CONFIG.repos.cacheTtlMs) {
      return null;
    }

    return cached.items;
  } catch {
    return null;
  }
}

function writeRepoCache(items) {
  try {
    localStorage.setItem(cacheKey(), JSON.stringify({ timestamp: Date.now(), items }));
  } catch {
    // Ignore cache write failures.
  }
}

async function fetchReposWithRetry(url, maxAttempts = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      lastError = error;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 350));
      }
    }
  }

  throw lastError;
}

function updateProof(repos) {
  const repoCount = repos.length;
  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  const latest = repos.reduce((best, repo) => {
    if (!best) return repo;
    return new Date(repo.updated_at).getTime() > new Date(best.updated_at).getTime() ? repo : best;
  }, null);

  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const recentCount = repos.filter((repo) => new Date(repo.updated_at).getTime() >= cutoff).length;

  const languageCount = new Map();
  repos.forEach((repo) => {
    if (!repo.language) return;
    languageCount.set(repo.language, (languageCount.get(repo.language) || 0) + 1);
  });

  let topLanguage = "Mixed";
  let maxCount = 0;
  languageCount.forEach((count, lang) => {
    if (count > maxCount) {
      maxCount = count;
      topLanguage = lang;
    }
  });

  setText("signalRepoCount", `${repoCount}`);
  setText("signalStarCount", `${totalStars}`);
  setText("signalRecentCount", `${recentCount}`);
  setText("proofRepoCount", `${repoCount}`);
  setText("proofUpdatedAt", latest ? formatDate(latest.updated_at) : "--");
  setText("proofLanguages", topLanguage);
}

function renderRepos(repos) {
  const repoGrid = SELECTOR.repoGrid;
  const repoStatus = SELECTOR.repoStatus;

  repoStatus.textContent = `Showing ${repos.length} selected public repositories from ${CONFIG.org}.`;
  repoGrid.innerHTML = "";

  repos.forEach((repo, index) => {
    const card = renderRepo(repo, index);
    repoGrid.appendChild(card);
    requestAnimationFrame(() => card.classList.add("show"));
  });

  updateProof(repos);
}

function renderFallback(error) {
  const repoStatus = SELECTOR.repoStatus;

  repoStatus.textContent = "Could not load repositories right now. Please view them directly on GitHub.";
  const fallback = el("a", "btn btn-secondary", "Open iridyne on GitHub");
  fallback.href = `https://github.com/${CONFIG.org}`;
  fallback.target = "_blank";
  fallback.rel = "noreferrer";
  fallback.style.marginTop = "0.8rem";
  fallback.style.display = "inline-flex";
  repoStatus.appendChild(document.createElement("br"));
  repoStatus.appendChild(fallback);
  console.error(error);
}

async function loadRepos() {
  const cached = readRepoCache();
  if (cached && cached.length > 0) {
    renderRepos(cached);
    return;
  }

  const url = `https://api.github.com/orgs/${CONFIG.org}/repos?type=public&sort=updated&per_page=100`;

  try {
    const repos = await fetchReposWithRetry(url, 3);

    if (!Array.isArray(repos) || repos.length === 0) {
      SELECTOR.repoStatus.textContent = "No public repositories found yet.";
      return;
    }

    const normalized = normalizeRepos(repos);
    writeRepoCache(normalized);
    renderRepos(normalized);
  } catch (error) {
    renderFallback(error);
  }
}

function init() {
  document.getElementById("year").textContent = new Date().getFullYear();
  hydrateContent();
  observeReveal();
  attachTilt();
  loadRepos();
}

init();
