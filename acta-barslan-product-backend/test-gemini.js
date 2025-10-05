const axios = require("axios");
require("dotenv").config();

async function testGeminiAPI() {
   const apiKey = process.env.GEMINI_API_KEY;
   const baseUrl = "https://generativelanguage.googleapis.com/v1";
   const model = "gemini-2.5-flash";

   console.log("🔍 Testing Gemini API Key...");
   console.log(`API Key exists: ${!!apiKey}`);
   console.log(`API Key length: ${apiKey ? apiKey.length : 0}`);
   console.log(
      `API Key preview: ${
         apiKey ? apiKey.substring(0, 10) + "..." : "Not found"
      }`
   );

   if (!apiKey) {
      console.error("❌ GEMINI_API_KEY not found in environment variables");
      console.log(
         "💡 Make sure you have a .env file with GEMINI_API_KEY=your-api-key"
      );
      return;
   }

   try {
      console.log("\n🚀 Testing API call...");

      const response = await axios.post(
         `${baseUrl}/models/${model}:generateContent?key=${apiKey}`,
         {
            contents: [
               {
                  parts: [
                     {
                        text: "Say 'Hello, Gemini API is working!' in exactly those words.",
                     },
                  ],
               },
            ],
            generationConfig: {
               temperature: 0.1,
               maxOutputTokens: 50,
            },
         },
         {
            headers: {
               "Content-Type": "application/json",
            },
         }
      );

      console.log("✅ API Key is working!");
      console.log(
         "📝 Response:",
         response.data.candidates[0].content.parts[0].text
      );
   } catch (error) {
      console.error("❌ API Key test failed:");
      console.error(`Status: ${error.response?.status}`);
      console.error(
         `Error: ${error.response?.data?.error?.message || error.message}`
      );

      if (error.response?.status === 400) {
         console.log("💡 This might be an invalid API key or billing issue");
      } else if (error.response?.status === 403) {
         console.log("💡 API key might not have permission for this model");
      } else if (error.response?.status === 404) {
         console.log("💡 Error still");
      }
   }
}

testGeminiAPI();
