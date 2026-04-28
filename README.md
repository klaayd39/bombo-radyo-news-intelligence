# 📻 Bombo Radyo News Intelligence Hub

A professional-grade, automated news aggregation system and Discord intelligence bot. This project fetches live RSS feeds from over 50+ local, national, and international news sources, displaying them in a modern web dashboard and syncing "Breaking News" alerts directly to Discord.

![Bombo Radyo Logo](profile.jpg)

## 🚀 Features

*   **Multi-Source Aggregation**: Real-time tracking of ABS-CBN, GMA, Inquirer, Philstar, Bombo Radyo, and more.
*   **Smart Categorization**: Automatically sorts news into National, Business, Sports, Showbiz, Technology, and International categories.
*   **Discord Integration**: Includes a Python and JavaScript-based webhook system that pushes "Breaking News" (published within the last 25 minutes) to a dedicated Discord channel.
*   **Live Dashboard**: A clean, responsive UI built with HTML5/CSS3 and Vanilla JS, featuring:
    *   Auto-refresh every 10 minutes.
    *   Search and source filtering.
    *   Breaking news badges and animations.
*   **Hybrid Architecture**: Includes both a Python script for backend persistent syncing and a browser-based JavaScript engine.

## 🛠️ Tech Stack

-   **Frontend**: HTML5, CSS3 (Modern Flexbox/Grid), Vanilla JavaScript.
-   **Backend/Bot**: Python (Feedparser, Requests).
-   **Integration**: Discord Webhooks API.
-   **Data**: RSS-to-JSON API for live feed processing.

## 📁 File Structure

*   `index.html`: The main web interface.
*   `style.css`: Modern, glassmorphism-inspired styling with mobile responsiveness.
*   `script.js`: The core logic for fetching feeds, handling filters, and triggering browser-side Discord alerts.
*   `bot.py`: Persistent Python script for 24/7 background syncing to Discord.

## ⚙️ Setup & Configuration

### 1. Discord Webhook
To receive alerts, replace the `WEBHOOK_URL` in `bot.py` or `script.js` with your own Discord channel webhook:
```javascript
const DISCORD_WEBHOOK_URL = "YOUR_WEBHOOK_HERE";
2. Running the Python BotEnsure you have requests and feedparser installed:Bashpip install feedparser requests
python bot.py
3. Running the DashboardSimply open index.html in any modern web browser or host it via GitHub Pages.📋 News Sources IncludedCategoryMajor SourcesNationalBombo Radyo, PNA, ABS-CBN, GMA, Inquirer, Manila BulletinBusinessBusinessWorld, Philstar Economy, Nikkei Asia, ReutersSportsESPN, SPIN.ph, Tiebreaker Times, Inquirer SportsTechThe Verge, TechCrunch, Wired, Hacker News⚖️ DisclaimerThis project is an aggregator for informational purposes. All news content and trademarks belong to their respective owners (Bombo Radyo, etc.).
---

### Key Improvements Made for your Readme:
*   **Visual Organization**: Added a table for news sources so users quickly see the value.
*   **Instructions**: Included clear "Setup" steps for the Discord Webhook.
*   **Tech Summary**: Highlighted that you are using a "Hybrid" approach (Python + JS), which is impressive for a repository.
*   **Branding**: Incorporated the "Bombo Radyo" identity throughout the text to match your assets.
