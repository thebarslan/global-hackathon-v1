const axios = require("axios");

class GeminiService {
   constructor() {
      this.baseUrl = "https://generativelanguage.googleapis.com/v1";
      this.apiKey = process.env.GEMINI_API_KEY;
      this.model = "gemini-2.5-flash";
   }

   // Analyze sentiment of Reddit posts
   async analyzeSentiment(posts, keyword) {
      try {
         if (!this.apiKey) {
            throw new Error("Gemini API key is not configured");
         }

         console.log(`Gemini API Key exists: ${!!this.apiKey}`);
         console.log(`Using model: ${this.model}`);
         console.log(
            `API URL: ${this.baseUrl}/models/${this.model}:generateContent`
         );

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
                  maxOutputTokens: 8192, // Increased from 4096 to 8192
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
                  {
                     category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                     threshold: "BLOCK_MEDIUM_AND_ABOVE",
                  },
                  {
                     category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                     threshold: "BLOCK_MEDIUM_AND_ABOVE",
                  },
               ],
            },
            {
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );

         const endTime = Date.now();
         const processingTime = endTime - startTime;

         // Parse the response
         const analysis = this.parseSentimentResponse(response.data, posts);

         return {
            success: true,
            analysis: analysis,
            metadata: {
               model: this.model,
               processingTime: processingTime,
               tokensUsed: response.data.usage?.total_tokens || 0,
               rawResponse: response.data,
            },
         };
      } catch (error) {
         console.error("Gemini API Error:", error.message);
         throw new Error(`Failed to analyze sentiment: ${error.message}`);
      }
   }

   // Create prompt for sentiment analysis
   createSentimentPrompt(posts, keyword) {
      const postsText = posts
         .map((post, index) => {
            return `${index + 1}. ${post.title} - ${post.content}`;
         })
         .join("\n");

      return `Analyze sentiment of Reddit posts about "${keyword}".

Posts:
${postsText}

JSON:
{"overall_sentiment":"positive|negative|neutral|mixed","confidence":85,"summary":"Brief summary","breakdown":[{"post_id":"1","sentiment":"positive|negative|neutral|mixed","confidence":90,"key_phrases":["phrase1"],"summary":"Brief"}]}`;
   }

   // Clean JSON response from Gemini
   cleanJsonResponse(content) {
      // Remove markdown code blocks
      content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "");

      // Remove any leading/trailing whitespace
      content = content.trim();

      // Find the first { and last } to extract JSON
      const firstBrace = content.indexOf("{");
      const lastBrace = content.lastIndexOf("}");

      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
         content = content.substring(firstBrace, lastBrace + 1);
      }

      return content;
   }

   // Parse Gemini response
   parseSentimentResponse(responseData, posts) {
      try {
         console.log(
            "Gemini response data:",
            JSON.stringify(responseData, null, 2)
         );

         if (!responseData.candidates || !responseData.candidates[0]) {
            throw new Error("No candidates in response");
         }

         const candidate = responseData.candidates[0];

         // Check if response was cut off due to token limit
         if (candidate.finishReason === "MAX_TOKENS") {
            console.log(
               "⚠️ Response was cut off due to MAX_TOKENS limit, but attempting to parse partial response"
            );
            // Don't throw error immediately, try to parse what we have
         }

         if (
            !candidate.content ||
            !candidate.content.parts ||
            !candidate.content.parts[0]
         ) {
            throw new Error("Invalid response structure - no content parts");
         }

         let content = candidate.content.parts[0].text;

         if (!content) {
            throw new Error("Empty content in response");
         }

         // Clean up the response content
         content = this.cleanJsonResponse(content);

         console.log("Cleaned Gemini response content:", content);
         const parsed = JSON.parse(content);

         // Calculate average sentiment score
         const sentimentScores = {
            positive: 100,
            neutral: 50,
            negative: 0,
            mixed: 25,
         };

         const averageScore = parsed.breakdown
            ? parsed.breakdown.reduce((sum, item) => {
                 const baseScore = sentimentScores[item.sentiment] || 50;
                 return sum + baseScore * (item.confidence / 100);
              }, 0) / parsed.breakdown.length
            : sentimentScores[parsed.overall_sentiment] || 50;

         return {
            overallSentiment: parsed.overall_sentiment || "neutral",
            confidence: parsed.confidence || 50,
            summary: parsed.summary || "No summary available",
            averageScore: Math.round(averageScore),
            breakdown: parsed.breakdown || [],
         };
      } catch (error) {
         console.error("Error parsing Gemini response:", error);
         // Fallback response
         return {
            overallSentiment: "neutral",
            confidence: 50,
            summary: "Unable to parse sentiment analysis",
            averageScore: 50,
            breakdown: posts.map((post, index) => ({
               post_id: (index + 1).toString(),
               sentiment: "neutral",
               confidence: 50,
               key_phrases: [],
               summary: "Unable to analyze this post",
            })),
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
