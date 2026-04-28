/* =========================================================
   RSS NEWS AGGREGATOR – PRO DISCORD EDITION (ALWAYS SYNC)
   Features: Auto-refresh, Deduplication, Breaking Alerts
========================================================= */

// 1. CONFIGURATION
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1449555169577799700/SRBD35OEYyRiZuIGH3sTpBsJYye9nRUb-F3vRPVHfyQIOf7Q_ZaGeqOhYGfTOg9LPmCr";
const BASE_API_URL = `https://api.rss2json.com/v1/api.json?rss_url=`;
const DEFAULT_CATEGORY = "National News";

// Timing Logic
const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const BREAKING_MINUTES = 25; // Look-back window for Discord alerts

// FULL RSS FEED CONFIGURATION
const ALL_FEEDS = {
  "National News": [
    { url: "https://news.abs-cbn.com/feed", source: "ABS-CBN News (General)" },
    { url: "https://www.inquirer.net/fullfeed", source: "Inquirer Main (General)" },
    { url: "https://newsinfo.inquirer.net/feed", source: "Inquirer NewsInfo" },
    { url: "https://www.gmanetwork.com/news/rss/news/", source: "GMA News Online (General)" },
    { url: "https://www.gmanetwork.com/news/rss/regions/", source: "GMA Regional" },
    { url: "https://www.philstar.com/rss/headlines", source: "Philippine Star (General)" },
    { url: "https://mb.com.ph/feed/", source: "Manila Bulletin (General)" },
    { url: "https://www.manilatimes.net/news/feed", source: "Manila Times (General)" },
    { url: "https://www.ptvnews.ph/feed/", source: "PTV News" },
    { url: "https://www.untvweb.com/feed/", source: "UNTV News" },
    { url: "https://www.pna.gov.ph/rss", source: "Philippine News Agency (PNA)" },
    { url: "https://www.rappler.com/feed/", source: "Rappler Main" },
    { url: "https://www.sunstar.com.ph/rss", source: "SunStar Philippines" },
    { url: "https://www.bomboradyo.com/category/national-news/feed/", source: "Bombo Radyo Nation" },
    { url: "https://www.brigadanews.ph/category/national/feed/", source: "Brigada News" },
    { url: "https://rmn.ph/feed/", source: "RMN Networks" },
    { url: "https://www.journalnews.com.ph/feed/", source: "People's Journal" },
    { url: "https://www.philstar.com/rss/nation", source: "Philstar Nation" },
    { url: "https://www.inquirer.net/columns/feed", source: "Inquirer Opinion/Columns" },
    { url: "https://www.manilatimes.net/news/national/feed/", source: "Manila Times Nation" },
    { url: "https://www.gmanetwork.com/news/rss/metro/", source: "GMA Metro" },
    { url: "https://manilastandard.net/rss-feed", source: "Manila Standard (General)" },
    { url: "https://tempo.com.ph/feed/", source: "Tempo News" },
    { url: "https://tonite.abante.com.ph/feed", source: "Abante Tonite" },
    { url: "https://interaksyon.philstar.com/feed/", source: "Interaksyon (Political & Social)" },
    { url: "http://www.senate.gov.ph/rss/rss_news.aspx", source: "Senate of the Philippines (News)" },
    { url: "https://www.bsp.gov.ph/SitePages/RSS.aspx", source: "Bangko Sentral ng Pilipinas (BSP)" },
  ],
  "Business / Economy": [
    { url: "https://www.philstar.com/rss/business", source: "Philstar Business" },
    { url: "https://businessmirror.com.ph/feed/", source: "BusinessMirror" },
    { url: "https://www.manilatimes.net/business/feed", source: "Manila Times Business" },
    { url: "https://www.gmanetwork.com/news/rss/money/", source: "GMA Money" },
    { url: "https://www.rappler.com/business/feed/", source: "Rappler Business" },
    { url: "https://www.bworldonline.com/feed/", source: "BusinessWorld" },
    { url: "https://www.reutersagency.com/feed/?best-topics=business&post_type=best", source: "Reuters Business" },
    { url: "https://asia.nikkei.com/rss/feed/nar", source: "Nikkei Asia" },
  ],
  "Sports": [
    { url: "https://www.espn.com/espn/rss/news", source: "ESPN General" },
    { url: "https://sports.inquirer.net/feed", source: "Inquirer Sports" },
    { url: "https://www.gmanetwork.com/news/rss/sports/", source: "GMA Sports" },
    { url: "https://www.rappler.com/sports/feed/", source: "Rappler Sports" },
    { url: "https://www.philstar.com/rss/sports", source: "Philstar Sports" },
    { url: "https://www.spin.ph/feed", source: "SPIN.ph" },
    { url: "https://tiebreakertimes.com.ph/feed", source: "Tiebreaker Times" },
    { url: "https://www.bomboradyo.com/category/sports/feed/", source: "Bombo Radyo Sports" },
    { url: "https://www.cbssports.com/rss/headlines/", source: "CBS Sports" },
  ],
  "Showbiz": [
    { url: "https://www.abs-cbn.com/entertainment/rss/latest-news", source: "ABS-CBN Entertainment" },
    { url: "https://www.rappler.com/entertainment/feed/", source: "Rappler Showbiz" },
    { url: "https://www.brigadanews.ph/category/showbiz/feed/", source: "Brigada Showbiz" },
    { url: "https://rmn.ph/category/showbiz/feed/", source: "RMN Showbiz" },
    { url: "https://www.pep.ph/feed/", source: "PEP.ph" },
    { url: "https://www.pikapika.ph/feed", source: "Pikapika" },
    { url: "https://www.philstar.com/rss/showbiz/", source: "Philstar.com Showbiz" },
    { url: "https://www.gmanetwork.com/news/rss/showbiz/", source: "GMA News Online Showbiz" },
    { url: "https://mb.com.ph/category/entertainment/feed/", source: "Manila Bulletin Entertainment" },
    { url: "https://entertainment.inquirer.net/feed", source: "Inquirer.net Entertainment" },
    { url: "https://bandera.inquirer.net/feed", source: "Inquirer Bandera" },
  ],
  "Technology": [
    { url: "https://www.rappler.com/technology/feed/", source: "Rappler Tech" },
    { url: "https://www.gmanetwork.com/news/rss/scitech/", source: "GMA SciTech" },
    { url: "https://www.theverge.com/rss/index.xml", source: "The Verge" },
    { url: "https://feeds.arstechnica.com/arstechnica/index", source: "Ars Technica" },
    { url: "https://techcrunch.com/feed/", source: "TechCrunch" },
    { url: "https://www.engadget.com/rss.xml", source: "Engadget" },
    { url: "https://www.wired.com/feed/category/gear/latest/rss", source: "Wired Gear" },
    { url: "https://www.cnet.com/rss/news/", source: "CNET" },
    { url: "https://mashable.com/feeds/rss/technology", source: "Mashable Tech" },
    { url: "https://news.ycombinator.com/rss", source: "Hacker News" },
  ],
  "Balitang Espesyal": [
    { url: "https://www.bomboradyo.com/category/balitang-espesyal/feed/", source: "Bombo Radyo Special Reports" },
    { url: "https://www.gmanetwork.com/news/rss/specialreports/", source: "GMA News Special Reports" },
    { url: "https://www.manilatimes.net/the-sunday-times/feed/", source: "Manila Times Sunday Magazine" },
    { url: "https://interaksyon.philstar.com/feed/", source: "Interaksyon (Political & Social)" },
    { url: "https://www.philstar.com/rss/lifestyle/features", source: "Philstar Lifestyle Features" },
    { url: "https://mb.com.ph/category/lifestyle/luminaries-and-life/feed/", source: "Manila Bulletin Luminaries & Life" },
    { url: "https://www.rappler.com/news/feed/", source: "Rappler News (General - Key Investigations)" },
  ],
  "Local Links": {
    isSocialMedia: true,
    items: [
      { title: "RMN Malaybalay ", link: "https://www.facebook.com/profile.php?id=100063929018518", source: "Facebook" },
      { title: "101.7 XFM Bukidnon", link: "https://www.facebook.com/101.7XFMBUKIDNON2025", source: "XFM Bukidnon" },
      { title: "Juander Radyo Malaybalay 90.5 FM ", link: "https://www.facebook.com/juanderradyomalaybalay", source: "Juander Radio" },
      { title: "BOMBO RADYO PHILIPPINES ", link: "https://www.facebook.com/bomboradyophilippinesy", source: "BOMBO RADYO PHILIPPINES" },
      { title: "BOMBO RADYO DAVAO", link: "https://www.facebook.com/BomboRadyoDavao", source: "BOMBO RADYO DAVAO" },
    ],
  },
  "International": [
    { url: "https://www.aljazeera.com/xml/rss/all.xml", source: "Al Jazeera" },
    { url: "https://www.cnbc.com/id/100727362/device/rss/rss.html", source: "CNBC World" },
    { url: "https://www.france24.com/en/rss", source: "France 24" },
    { url: "https://rss.dw.com/rdf/rss-en-world", source: "DW News" },
    { url: "https://fulltextrssfeed.com/www.aljazeera.com/xml/rss/all.xml", source: "Global Echo" },
  ],
};

let activeCategory = DEFAULT_CATEGORY;
let cachedNews = [];
let currentFetchController = null;

const dom = {
  container: () => document.getElementById("news-container"),
  refreshBtn: () => document.getElementById("refresh-button"),
  status: () => document.getElementById("status-message"),
  search: () => document.getElementById("news-search"),
  sourceFilter: () => document.getElementById("source-filter"),
};

// =========================================================
// PERSISTENT SYNC & DISCORD LOGIC
// =========================================================
async function sendToDiscord(item) {
  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === "") return;

  let sentHistory = JSON.parse(localStorage.getItem("discord_sent_history") || "[]");
  if (sentHistory.includes(item.link)) return;

  const payload = {
    username: "Bombo Radyo Intel Bot",
    embeds: [{
      title: "🚨 BREAKING: " + item.title,
      url: item.link,
      description: item.description.replace(/<[^>]*>/g, "").slice(0, 250) + "...",
      color: 15548997, 
      fields: [
        { name: "Source", value: item.sourceTitle, inline: true },
        { name: "Category", value: activeCategory, inline: true },
      ],
      footer: { text: "Bombo Radyo Hub • Always Syncing" },
      timestamp: new Date().toISOString(),
    }],
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      sentHistory.push(item.link);
      if (sentHistory.length > 100) sentHistory.shift(); 
      localStorage.setItem("discord_sent_history", JSON.stringify(sentHistory));
    }
  } catch (err) {
    console.warn("Discord Webhook failed.");
  }
}

// =========================================================
// CORE ENGINE
// =========================================================
function isBreaking(pubDate) {
  const diff = (Date.now() - new Date(pubDate).getTime()) / 60000;
  return diff > 0 && diff <= BREAKING_MINUTES;
}

function debounce(fn, delay = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

async function fetchFeed(feed, signal) {
  try {
    // added cache: "no-store" to bypass browser cache
    const res = await fetch(`${BASE_API_URL}${encodeURIComponent(feed.url)}&_=${Math.random()}`, { 
        signal,
        cache: "no-store" 
    });
    const data = await res.json();
    return data.status === "ok" ? data.items.map((i) => ({ ...i, sourceTitle: feed.source })) : [];
  } catch {
    return [];
  }
}

async function fetchNews(isManual = false) {
  const container = dom.container();
  if (!container) return;

  currentFetchController?.abort();
  currentFetchController = new AbortController();

  if (isManual) dom.refreshBtn()?.classList.add("spinning");
  dom.status().textContent = `Refreshing ${activeCategory}...`;

  const categoryData = ALL_FEEDS[activeCategory];

  if (categoryData.isSocialMedia) {
    cachedNews = categoryData.items.map((item) => ({
      title: item.title,
      link: item.link,
      sourceTitle: item.source,
      pubDate: new Date().toISOString(),
      description: "Direct link to social broadcast.",
    }));
    renderNews(cachedNews);
  } else {
    try {
      const results = await Promise.all(
        categoryData.map((f) => fetchFeed(f, currentFetchController.signal))
      );

      cachedNews = results
        .flat()
        .filter((i) => i.title && i.link)
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      renderNews(cachedNews);
      applyFilters();

      cachedNews.slice(0, 3).forEach(item => {
        if (isBreaking(item.pubDate)) {
          sendToDiscord(item);
        }
      });

    } catch (e) {
      if (e.name !== "AbortError") console.error("Sync interrupted.");
    }
  }

  dom.status().textContent = `Live: ${cachedNews.length} Headlines | Next Auto-Sync in 10m`;
  if (isManual) dom.refreshBtn()?.classList.remove("spinning");
}

function renderNews(items) {
  const container = dom.container();
  if (!container) return;
  
  container.innerHTML = "";
  if (!items.length) {
    container.innerHTML = `<li class="no-results">No recent updates found. Some sources may be temporarily down.</li>`;
    return;
  }

  items.forEach((item) => {
    const date = new Date(item.pubDate);
    const domain = new URL(item.link).hostname;
    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

    const li = document.createElement("li");
    li.className = "news-item";
    li.innerHTML = `
      <div class="news-content">
        <div class="source-row">
          <img src="${favicon}" class="source-icon" onerror="this.style.display='none'">
          <span class="source-tag">${item.sourceTitle}</span>
          ${isBreaking(item.pubDate) ? '<span class="breaking-badge pulse">NEW</span>' : ""}
        </div>
        <a href="${item.link}" target="_blank" class="news-link">${item.title}</a>
      </div>
      <div class="news-meta">
        <span>${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        <span>${date.toLocaleDateString()}</span>
      </div>
    `;
    container.appendChild(li);
  });
}

function applyFilters() {
  const term = dom.search()?.value.toLowerCase() || "";
  const source = dom.sourceFilter()?.value || "";
  const filtered = cachedNews.filter(
    (i) => i.title.toLowerCase().includes(term) && (!source || i.sourceTitle === source)
  );
  renderNews(filtered);
}

// =========================================================
// INITIALIZATION
// =========================================================
function init() {
  const nav = document.getElementById("category-buttons");
  if (nav) {
    Object.keys(ALL_FEEDS).forEach((cat) => {
      const btn = document.createElement("button");
      btn.textContent = cat;
      btn.className = cat === activeCategory ? "active" : "";
      btn.onclick = () => {
        activeCategory = cat;
        document.querySelectorAll("#category-buttons button").forEach((b) => b.classList.toggle("active", b.textContent === cat));
        fetchNews();
      };
      nav.appendChild(btn);
    });
  }

  const filterDropdown = dom.sourceFilter();
  if (filterDropdown) {
    const allSources = new Set();
    Object.values(ALL_FEEDS).forEach(v => {
        if(v.isSocialMedia) v.items.forEach(i => allSources.add(i.source));
        else v.forEach(f => allSources.add(f.source));
    });
    allSources.forEach(s => {
        const opt = document.createElement("option");
        opt.value = opt.textContent = s;
        filterDropdown.appendChild(opt);
    });
  }

  if (dom.refreshBtn()) dom.refreshBtn().onclick = () => fetchNews(true);
  if (dom.search()) dom.search().oninput = debounce(applyFilters);
  if (dom.sourceFilter()) dom.sourceFilter().onchange = applyFilters;

  fetchNews();

  setInterval(() => {
    fetchNews();
  }, AUTO_REFRESH_INTERVAL);
}

document.addEventListener("DOMContentLoaded", init);
