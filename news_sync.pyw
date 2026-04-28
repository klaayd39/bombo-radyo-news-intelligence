import feedparser
import requests
import time
import re

# 1. SETUP
WEBHOOK_URL = "https://discord.com/api/webhooks/1449555169577799700/SRBD35OEYyRiZuIGH3sTpBsJYye9nRUb-F3vRPVHfyQIOf7Q_ZaGeqOhYGfTOg9LPmCr"

# Headers to mimic a browser (Crucial for Philstar, ESPN, and Business sites)
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# 2. DATA STRUCTURE
ALL_FEEDS = {
    "National News": [
        {"url": "https://news.abs-cbn.com/feed", "source": "ABS-CBN News (General)"},
        {"url": "https://www.inquirer.net/fullfeed", "source": "Inquirer Main (General)"},
        {"url": "https://newsinfo.inquirer.net/feed", "source": "Inquirer NewsInfo"},
        {"url": "https://www.gmanetwork.com/news/rss/news/", "source": "GMA News Online (General)"},
        {"url": "https://www.gmanetwork.com/news/rss/regions/", "source": "GMA Regional"},
        {"url": "https://www.philstar.com/rss/headlines", "source": "Philippine Star (General)"},
        {"url": "https://mb.com.ph/feed/", "source": "Manila Bulletin (General)"},
        {"url": "https://www.manilatimes.net/news/feed", "source": "Manila Times (General)"},
        {"url": "https://www.ptvnews.ph/feed/", "source": "PTV News"},
        {"url": "https://www.untvweb.com/feed/", "source": "UNTV News"},
        {"url": "https://www.pna.gov.ph/rss", "source": "Philippine News Agency (PNA)"},
        {"url": "https://www.rappler.com/feed/", "source": "Rappler Main"},
        {"url": "https://www.sunstar.com.ph/rss", "source": "SunStar Philippines"},
        {"url": "https://www.bomboradyo.com/category/national-news/feed/", "source": "Bombo Radyo Nation"},
        {"url": "https://www.brigadanews.ph/category/national/feed/", "source": "Brigada News"},
        {"url": "https://rmn.ph/feed/", "source": "RMN Networks"},
        {"url": "https://www.journalnews.com.ph/feed/", "source": "People's Journal"},
        {"url": "https://www.philstar.com/rss/nation", "source": "Philstar Nation"},
        {"url": "https://www.inquirer.net/columns/feed", "source": "Inquirer Opinion/Columns"},
        {"url": "https://www.manilatimes.net/news/national/feed/", "source": "Manila Times Nation"},
        {"url": "https://www.gmanetwork.com/news/rss/metro/", "source": "GMA Metro"},
        {"url": "https://manilastandard.net/rss-feed", "source": "Manila Standard (General)"},
        {"url": "https://tempo.com.ph/feed/", "source": "Tempo News"},
        {"url": "https://tonite.abante.com.ph/feed", "source": "Abante Tonite"},
        {"url": "https://interaksyon.philstar.com/feed/", "source": "Interaksyon (Political & Social)"},
        {"url": "http://www.senate.gov.ph/rss/rss_news.aspx", "source": "Senate of the Philippines (News)"},
        {"url": "https://www.bsp.gov.ph/SitePages/RSS.aspx", "source": "Bangko Sentral ng Pilipinas (BSP)"},
    ],
    "Business / Economy": [
        {"url": "https://www.philstar.com/rss/money", "source": "Philstar Business"},
        {"url": "https://www.philstar.com/rss/business", "source": "Philstar Economy"},
        {"url": "https://businessmirror.com.ph/feed/", "source": "BusinessMirror"},
        {"url": "https://www.manilatimes.net/business/feed", "source": "Manila Times Business"},
        {"url": "https://www.gmanetwork.com/news/rss/money/", "source": "GMA Money"},
        {"url": "https://www.rappler.com/business/feed/", "source": "Rappler Business"},
        {"url": "https://www.bworldonline.com/feed/", "source": "BusinessWorld"},
        {"url": "https://www.bsp.gov.ph/rss/MediaList.xml", "source": "Bangko Sentral ng Pilipinas"},
        {"url": "https://www.reuters.com/rssFeed/businessNews", "source": "Reuters Business"},
        {"url": "https://asia.nikkei.com/rss/feed/nar", "source": "Nikkei Asia"},
    ],
    "Sports": [
        {"url": "https://www.espn.com/espn/rss/news", "source": "ESPN General"},
        {"url": "https://sports.inquirer.net/feed", "source": "Inquirer Sports"},
        {"url": "https://www.gmanetwork.com/news/rss/sports/", "source": "GMA Sports"},
        {"url": "https://www.rappler.com/sports/feed/", "source": "Rappler Sports"},
        {"url": "https://www.abs-cbn.com/sports/rss/latest-news", "source": "ABS-CBN Sports"},
        {"url": "https://nba.nbcsports.com/category/top-posts/feed/", "source": "NBC Sports NBA"},
        {"url": "https://www.bomboradyo.com/category/sports/feed/", "source": "Bombo Radyo Sports"},
        {"url": "https://www.philstar.com/rss/sports", "source": "Philstar Sports"},
        {"url": "https://www.spin.ph/feed", "source": "SPIN.ph"},
        {"url": "https://tiebreakertimes.com.ph/feed", "source": "Tiebreaker Times"},
        {"url": "https://www.espn.com/espn/rss/nba/news", "source": "ESPN NBA Headlines"},
        {"url": "https://www.espn.com/espn/rss/soccer/news", "source": "ESPN Soccer Headlines"},
        {"url": "https://rss.app/feeds/H3y9L6jQ64f5uMv2.xml", "source": "BBC Sport (General)"},
        {"url": "http://feeds.reuters.com/reuters/sportsNews", "source": "Reuters Sports News"},
        {"url": "https://www.cbssports.com/rss/headlines/", "source": "CBS Sports (General)"},
    ],
    "Showbiz": [
        {"url": "https://www.abs-cbn.com/entertainment/rss/latest-news", "source": "ABS-CBN Entertainment"},
        {"url": "https://www.rappler.com/entertainment/feed/", "source": "Rappler Showbiz"},
        {"url": "https://www.brigadanews.ph/category/showbiz/feed/", "source": "Brigada Showbiz"},
        {"url": "https://rmn.ph/category/showbiz/feed/", "source": "RMN Showbiz"},
        {"url": "https://www.pep.ph/feed/", "source": "PEP.ph"},
        {"url": "https://www.pikapika.ph/feed", "source": "Pikapika"},
        {"url": "https://www.philstar.com/rss/showbiz/", "source": "Philstar.com Showbiz"},
        {"url": "https://www.gmanetwork.com/news/rss/showbiz/", "source": "GMA News Online Showbiz"},
        {"url": "https://mb.com.ph/category/entertainment/feed/", "source": "Manila Bulletin Entertainment"},
        {"url": "https://entertainment.inquirer.net/feed", "source": "Inquirer.net Entertainment"},
        {"url": "https://bandera.inquirer.net/feed", "source": "Inquirer Bandera"},
    ],
    "Technology": [
        {"url": "https://www.rappler.com/technology/feed/", "source": "Rappler Tech"},
        {"url": "https://www.gmanetwork.com/news/rss/scitech/", "source": "GMA SciTech"},
        {"url": "https://www.theverge.com/rss/index.xml", "source": "The Verge"},
        {"url": "https://feeds.arstechnica.com/arstechnica/index", "source": "Ars Technica"},
        {"url": "https://techcrunch.com/feed/", "source": "TechCrunch"},
        {"url": "https://www.engadget.com/rss.xml", "source": "Engadget"},
        {"url": "https://www.wired.com/feed/category/gear/latest/rss", "source": "Wired Gear"},
        {"url": "https://www.cnet.com/rss/news/", "source": "CNET"},
        {"url": "https://mashable.com/feeds/rss/technology", "source": "Mashable Tech"},
        {"url": "https://news.ycombinator.com/rss", "source": "Hacker News"},
    ],
    "Balitang Espesyal": [
        {"url": "https://www.bomboradyo.com/category/balitang-espesyal/feed/", "source": "Bombo Radyo Special Reports"},
        {"url": "https://www.gmanetwork.com/news/rss/specialreports/", "source": "GMA News Special Reports"},
        {"url": "https://www.manilatimes.net/the-sunday-times/feed/", "source": "Manila Times Sunday Magazine"},
        {"url": "https://interaksyon.philstar.com/feed/", "source": "Interaksyon (Political & Social)"},
        {"url": "https://www.philstar.com/rss/lifestyle/features", "source": "Philstar Lifestyle Features"},
        {"url": "https://mb.com.ph/category/lifestyle/luminaries-and-life/feed/", "source": "Manila Bulletin Luminaries & Life"},
        {"url": "https://www.rappler.com/news/feed/", "source": "Rappler News (General - Key Investigations)"},
    ],
    "International": [
        {"url": "https://www.aljazeera.com/xml/rss/all.xml", "source": "Al Jazeera"},
        {"url": "https://www.cnbc.com/id/100727362/device/rss/rss.html", "source": "CNBC World"},
        {"url": "https://www.france24.com/en/rss", "source": "France 24"},
        {"url": "https://rss.dw.com/rdf/rss-en-world", "source": "DW News"},
        {"url": "https://fulltextrssfeed.com/www.aljazeera.com/xml/rss/all.xml", "source": "Global Echo"},
    ],
    "Local Links": {
        "isSocialMedia": True,
        "items": [
            {"title": "RMN Malaybalay", "link": "https://www.facebook.com/profile.php?id=100063929018518", "source": "Facebook"},
            {"title": "101.7 XFM Bukidnon", "link": "https://www.facebook.com/101.7XFMBUKIDNON2025", "source": "XFM Bukidnon"},
            {"title": "Juander Radyo Malaybalay 90.5 FM", "link": "https://www.facebook.com/juanderradyomalaybalay", "source": "Juander Radio"},
            {"title": "BOMBO RADYO PHILIPPINES", "link": "https://www.facebook.com/bomboradyophilippinesy", "source": "BOMBO RADYO PHILIPPINES"},
            {"title": "BOMBO RADYO DAVAO", "link": "https://www.facebook.com/BomboRadyoDavao", "source": "BOMBO RADYO DAVAO"},
        ],
    },
}

# Persistent Memory
sent_articles = set()

def check_news():
    print(f"--- Sync Started: {time.strftime('%Y-%m-%d %H:%M:%S')} ---")
    
    for category, feeds in ALL_FEEDS.items():
        # Handle the dictionary structure of "Local Links" (Skip it as it's not RSS)
        if isinstance(feeds, dict):
            continue

        for feed_info in feeds:
            try:
                # Use requests with a browser header to fetch the feed
                # Timeout added to prevent the script from hanging on a slow site
                response = requests.get(feed_info['url'], headers=HEADERS, timeout=15)
                feed = feedparser.parse(response.content)
                
                if not feed.entries:
                    continue
                
                # Get the most recent entry
                latest = feed.entries[0]
                article_id = latest.link
                
                if article_id not in sent_articles:
                    print(f"[{category}] Found New: {latest.title}")
                    
                    # Clean description (remove HTML tags with regex)
                    desc = latest.get('summary', 'No description available.')
                    clean_desc = re.sub('<[^<]+?>', '', desc) 
                    clean_desc = (clean_desc[:250] + '...') if len(clean_desc) > 250 else clean_desc

                    payload = {
                        "username": "News Intelligence Bot",
                        "embeds": [{
                            "title": f"🚨 {latest.title}",
                            "url": latest.link,
                            "description": clean_desc,
                            "color": 1982639, 
                            "fields": [
                                {"name": "Source", "value": feed_info['source'], "inline": True},
                                {"name": "Category", "value": category, "inline": True}
                            ],
                            "footer": {"text": "Bombo Radyo Intel • Automated Live Sync"},
                            "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
                        }]
                    }
                    
                    # Post to Discord
                    post_res = requests.post(WEBHOOK_URL, json=payload)
                    
                    # Only add to sent list if Discord accepted it
                    if post_res.status_code in [200, 204]:
                        sent_articles.add(article_id)
                
                # Respectful delay between individual feed checks
                time.sleep(0.7)
                
            except Exception as e:
                # Log error but keep the loop running
                print(f"Skip Error for {feed_info['source']}: {e}")

    # Memory Management: Keep the set from growing forever
    if len(sent_articles) > 1000:
        sent_list = list(sent_articles)
        sent_articles.clear()
        # Keep the last 500 to prevent duplicates on the next run
        for item in sent_list[-500:]:
            sent_articles.add(item)

# Main Persistent Loop
if __name__ == "__main__":
    print("========================================")
    print("NEWSBOT: CONTINUOUS SYNC ACTIVE")
    print("Press Ctrl+C to stop.")
    print("========================================")
    
    while True:
        try:
            check_news()
            print(f"--- Sync Complete. Next update in 10 minutes. ---")
            time.sleep(600)  # Wait 10 minutes (600 seconds)
        except KeyboardInterrupt:
            print("\nStopping NewsBot...")
            break
        except Exception as global_err:
            print(f"CRITICAL ERROR: {global_err}")
            print("Restarting sync in 30 seconds...")
            time.sleep(30)
