import { BlogPost } from '../types';

const RSS_URL = 'https://thebiblicalman.substack.com/feed';

export const fetchLatestPosts = async (): Promise<BlogPost[]> => {
  try {
    // Append a timestamp to the RSS URL to force the proxy to fetch fresh data
    const cacheBuster = `?t=${new Date().getTime()}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL + cacheBuster)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (!data.contents) return [];

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");
    const items = xmlDoc.querySelectorAll("item");
    
    const posts: BlogPost[] = [];
    
    // Process top 3 items
    for (let i = 0; i < Math.min(items.length, 3); i++) {
      const item = items[i];
      let title = item.querySelector("title")?.textContent || "Untitled";
      // Clean up potential CDATA artifacts if DOMParser missed them
      title = title.replace("<![CDATA[", "").replace("]]>", "").trim();

      const link = item.querySelector("link")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      
      // Substack puts full HTML content in content:encoded
      // We look for the 'encoded' tag in any namespace
      const contentEncoded = item.getElementsByTagNameNS("*", "encoded")[0]?.textContent;
      const description = item.querySelector("description")?.textContent || "";
      
      // Fallback to description if encoded content is missing
      const fullContent = contentEncoded || description;
      
      // Create plain text for excerpt by stripping HTML
      const tempDiv = document.createElement("div");
      // Use description for excerpt as it's cleaner in RSS usually
      tempDiv.innerHTML = description; 
      const plainText = tempDiv.textContent || "";
      const excerpt = plainText.substring(0, 150) + "...";
      
      // Calculate read time based on word count of full content
      const fullTextDiv = document.createElement("div");
      fullTextDiv.innerHTML = fullContent;
      const fullText = fullTextDiv.textContent || "";
      const wordCount = fullText.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

      // Format date
      const dateObj = new Date(pubDate);
      const dateStr = isNaN(dateObj.getTime()) 
        ? "Recent" 
        : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Get category if available
      const category = item.querySelector("category")?.textContent || "Essay";

      posts.push({
        id: link, // Use URL as ID
        title,
        excerpt,
        date: dateStr,
        readTime,
        category,
        link,
        content: fullContent
      });
    }

    return posts;
  } catch (error) {
    console.error("Failed to fetch RSS feed", error);
    return [];
  }
};