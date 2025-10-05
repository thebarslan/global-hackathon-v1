const axios = require("axios");

class RedditService {
   constructor() {
      this.baseUrl = "https://www.reddit.com";
      this.userAgent = "ActaBarslanBrandAnalysis/1.0";
   }

   // Search for posts containing specific keywords
   async searchPosts(keyword, options = {}) {
      try {
         const {
            limit = 20,
            sort = "new",
            subreddit = null,
            time = "all",
         } = options;

         let url = `${this.baseUrl}/search.json`;
         const params = {
            q: keyword,
            limit: Math.min(limit, 100), // Reddit API max limit
            sort,
            t: time,
         };

         // If specific subreddit is provided
         if (subreddit) {
            url = `${this.baseUrl}/r/${subreddit}/search.json`;
         }

         const response = await axios.get(url, {
            params,
            headers: {
               "User-Agent": this.userAgent,
            },
            timeout: 10000, // 10 seconds timeout
         });

         if (
            response.data &&
            response.data.data &&
            response.data.data.children
         ) {
            return this.formatRedditPosts(response.data.data.children);
         }

         return [];
      } catch (error) {
         console.error("Reddit API Error:", error.message);
         throw new Error(`Failed to fetch Reddit posts: ${error.message}`);
      }
   }

   // Format Reddit API response to our standard format
   formatRedditPosts(posts) {
      return posts.map((post) => {
         const data = post.data;

         // Truncate content to reduce token usage
         const content = data.selftext || "";
         const truncatedContent =
            content.length > 200 ? content.substring(0, 200) + "..." : content;

         return {
            id: data.id,
            title: data.title || "",
            content: truncatedContent,
            author: data.author || "unknown",
            subreddit: data.subreddit || "",
            score: data.score || 0,
            upvoteRatio: data.upvote_ratio || 0,
            createdAt: new Date(data.created_utc * 1000),
            url: `https://reddit.com${data.permalink}`,
            permalink: data.permalink,
         };
      });
   }

   // Get posts from specific subreddits
   async getPostsFromSubreddits(keyword, subreddits = [], options = {}) {
      try {
         const allPosts = [];

         for (const subreddit of subreddits) {
            try {
               const posts = await this.searchPosts(keyword, {
                  ...options,
                  subreddit,
               });
               allPosts.push(...posts);
            } catch (error) {
               console.warn(
                  `Failed to fetch from r/${subreddit}:`,
                  error.message
               );
               // Continue with other subreddits
            }
         }

         // Remove duplicates based on postId
         const uniquePosts = allPosts.filter(
            (post, index, self) =>
               index === self.findIndex((p) => p.postId === post.postId)
         );

         // Sort by score (most relevant first)
         return uniquePosts.sort((a, b) => b.score - a.score);
      } catch (error) {
         throw new Error(
            `Failed to fetch posts from subreddits: ${error.message}`
         );
      }
   }

   // Get trending posts related to keyword
   async getTrendingPosts(keyword, options = {}) {
      try {
         const posts = await this.searchPosts(keyword, {
            ...options,
            sort: "hot",
            time: "day",
         });

         // Filter posts with high engagement
         return posts.filter((post) => post.score > 10 || post.numComments > 5);
      } catch (error) {
         throw new Error(`Failed to fetch trending posts: ${error.message}`);
      }
   }

   // Validate Reddit API connectivity
   async testConnection() {
      try {
         const response = await axios.get(`${this.baseUrl}/api/v1/me`, {
            headers: {
               "User-Agent": this.userAgent,
            },
            timeout: 5000,
         });

         return {
            success: true,
            status: response.status,
            message: "Reddit API is accessible",
         };
      } catch (error) {
         return {
            success: false,
            status: error.response?.status || 0,
            message: error.message,
         };
      }
   }

   // Get subreddit information
   async getSubredditInfo(subreddit) {
      try {
         const response = await axios.get(
            `${this.baseUrl}/r/${subreddit}/about.json`,
            {
               headers: {
                  "User-Agent": this.userAgent,
               },
               timeout: 5000,
            }
         );

         if (response.data && response.data.data) {
            const data = response.data.data;
            return {
               name: data.display_name,
               title: data.title,
               description: data.public_description,
               subscribers: data.subscribers,
               activeUsers: data.active_user_count,
               isOver18: data.over18,
               language: data.lang,
            };
         }

         return null;
      } catch (error) {
         console.warn(
            `Failed to get subreddit info for r/${subreddit}:`,
            error.message
         );
         return null;
      }
   }
}

module.exports = new RedditService();
