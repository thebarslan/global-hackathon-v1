const axios = require("axios");

class GeminiService {
   constructor() {
      this.baseUrl = "https://generativelanguage.googleapis.com/v1beta";
      this.apiKey = process.env.GEMINI_API_KEY;
      this.model = "gemini-pro";
   }

   // Analyze sentiment of Reddit posts
   async analyzeSentiment(posts, keyword) {
      try {
         if (!this.apiKey) {
            throw new Error("Gemini API key is not configured");
         }

         const startTime = Date.now();

         // Prepare the prompt
         const prompt = this.createSentimentPrompt(posts, keyword);

         // Call Gemini API
         const response = await axios.post(
            `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
            {
               contents: [
                  {
                     parts: [
                        {
                           text: prompt,
                        },
                     ],
                  },
               ],
               generationConfig: {
                  temperature: 0.1,
                  topK: 1,
                  topP: 0.8,
                  maxOutputTokens: 2048,
               },
               safetySettings: [
                  {
                     category: "HARM_CATEGORY_HARASSMENT",
                     threshold: "BLOCK_MEDIUM_AND_ABOVE",
                  },
                  {
                     category: "HARM_CATEGORY_HATE_SPEECH",
                     threshold: "BLOCK_MEDIUM_AND_ABOVE",
                  },
               ],
            },
            {
               headers: {
                  "Content-Type": "application/json",
               },
               timeout: 30000, // 30 seconds timeout
            }
         );

         const processingTime = Date.now() - startTime;

         if (
            response.data &&
            response.data.candidates &&
            response.data.candidates[0]
         ) {
            const candidate = response.data.candidates[0];
            const content = candidate.content.parts[0].text;

            // Parse the JSON response
            const analysisResult = this.parseGeminiResponse(content);

            return {
               success: true,
               analysis: analysisResult,
               metadata: {
                  processingTime,
                  model: this.model,
                  tokensUsed: this.estimateTokens(prompt + content),
                  rawResponse: content,
               },
            };
         }

         throw new Error("Invalid response from Gemini API");
      } catch (error) {
         console.error("Gemini API Error:", error.message);
         throw new Error(`Failed to analyze sentiment: ${error.message}`);
      }
   }

   // Create prompt for sentiment analysis
   createSentimentPrompt(posts, keyword) {
      const postsText = posts
         .map(
            (post, index) =>
               `Post ${index + 1}:
Title: ${post.title}
Content: ${post.content}
Subreddit: r/${post.subreddit}
Score: ${post.score}
Comments: ${post.numComments}
`
         )
         .join("\n");

      return `You are a brand sentiment analysis expert. Analyze the following Reddit posts about "${keyword}" and provide a comprehensive sentiment analysis.

Posts to analyze:
${postsText}

Please analyze each post individually and then provide an overall sentiment analysis. Return your response in the following JSON format:

{
  "overall": {
    "sentiment": "positive|negative|neutral|mixed",
    "confidence": 0.0-1.0,
    "score": -1.0 to 1.0,
    "summary": "Brief explanation of overall sentiment"
  },
  "breakdown": [
    {
      "postId": "post_id",
      "sentiment": "positive|negative|neutral",
      "confidence": 0.0-1.0,
      "score": -1.0 to 1.0,
      "reasoning": "Why this sentiment was assigned"
    }
  ],
  "insights": {
    "keyThemes": ["theme1", "theme2"],
    "commonComplaints": ["complaint1", "complaint2"],
    "positiveAspects": ["aspect1", "aspect2"],
    "recommendations": ["recommendation1", "recommendation2"]
  }
}

Guidelines:
- Sentiment score: -1.0 (very negative) to 1.0 (very positive)
- Confidence: 0.0 (no confidence) to 1.0 (complete confidence)
- Consider context, sarcasm, and nuanced language
- Focus on brand-related mentions and opinions
- Provide actionable insights for brand improvement

Respond only with valid JSON, no additional text.`;
   }

   // Parse Gemini response and validate JSON
   parseGeminiResponse(responseText) {
      try {
         // Extract JSON from response (in case there's extra text)
         const jsonMatch = responseText.match(/\{[\s\S]*\}/);
         if (!jsonMatch) {
            throw new Error("No JSON found in response");
         }

         const parsed = JSON.parse(jsonMatch[0]);

         // Validate required fields
         if (!parsed.overall || !parsed.breakdown) {
            throw new Error("Invalid response structure");
         }

         // Calculate summary statistics
         const breakdown = parsed.breakdown || [];
         const summary = {
            positiveCount: breakdown.filter((b) => b.sentiment === "positive")
               .length,
            negativeCount: breakdown.filter((b) => b.sentiment === "negative")
               .length,
            neutralCount: breakdown.filter((b) => b.sentiment === "neutral")
               .length,
            totalPosts: breakdown.length,
         };

         return {
            ...parsed,
            summary,
         };
      } catch (error) {
         console.error("Failed to parse Gemini response:", error.message);
         throw new Error(`Failed to parse analysis result: ${error.message}`);
      }
   }

   // Estimate token count (rough approximation)
   estimateTokens(text) {
      // Rough estimation: 1 token ≈ 4 characters for English text
      return Math.ceil(text.length / 4);
   }

   // Test Gemini API connectivity
   async testConnection() {
      try {
         if (!this.apiKey) {
            return {
               success: false,
               message: "Gemini API key is not configured",
            };
         }

         const response = await axios.post(
            `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
            {
               contents: [
                  {
                     parts: [
                        {
                           text: "Hello, please respond with 'API connection successful'",
                        },
                     ],
                  },
               ],
               generationConfig: {
                  maxOutputTokens: 50,
               },
            },
            {
               headers: {
                  "Content-Type": "application/json",
               },
               timeout: 10000,
            }
         );

         return {
            success: true,
            message: "Gemini API is accessible",
            response: response.data,
         };
      } catch (error) {
         return {
            success: false,
            message: error.message,
            status: error.response?.status,
         };
      }
   }

   // Analyze single post (for testing)
   async analyzeSinglePost(post, keyword) {
      try {
         const posts = [post];
         const result = await this.analyzeSentiment(posts, keyword);
         return result.analysis.breakdown[0] || null;
      } catch (error) {
         throw new Error(`Failed to analyze single post: ${error.message}`);
      }
   }
}

module.exports = new GeminiService();
