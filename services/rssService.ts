import { BlogPost } from '../types';

const FEED_URL = 'https://biblicalman.substack.com/feed';
// Using rss2json API for more reliable parsing and CORS handling
const RSS_API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(FEED_URL)}`;

export const fetchLatestPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(RSS_API_URL);
    
    if (!response.ok) {
       throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status !== 'ok' || !data.items) {
      // If rss2json fails or returns empty, just return empty array so app doesn't crash
      return [];
    }
    
    const posts: BlogPost[] = data.items.slice(0, 3).map((item: any) => {
      // Create excerpt from description (strip HTML)
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = item.description || "";
      const textContent = tempDiv.textContent || "";
      const excerpt = textContent.length > 140 
        ? textContent.substring(0, 140).trim() + "..." 
        : textContent;

      // Calculate read time
      const wordCount = textContent.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 225)) + " min read";

      // Format Date
      // rss2json returns dates like "2023-10-01 12:00:00"
      const pubDate = new Date(item.pubDate.replace(/-/g, '/')); 
      const formattedDate = isNaN(pubDate.getTime()) 
        ? "Recent" 
        : pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Clean category
      let category = "Writing";
      if (item.categories && item.categories.length > 0) {
        const rawCat = item.categories[0];
        category = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
      }

      return {
        id: item.guid || item.link,
        title: item.title,
        excerpt,
        date: formattedDate,
        readTime,
        category,
        link: item.link,
        // rss2json provides 'content' field for content:encoded
        content: item.content || item.description || "" 
      };
    });

    return posts;

  } catch (error) {
    console.error("Error fetching/parsing RSS feed:", error);
    return [];
  }
};