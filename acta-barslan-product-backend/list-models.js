const axios = require("axios");
require("dotenv").config();

async function listAvailableModels() {
   const apiKey = process.env.GEMINI_API_KEY;
   const baseUrl = "https://generativelanguage.googleapis.com/v1";

   console.log("🔍 Listing available Gemini models...");
   console.log(`API Key exists: ${!!apiKey}`);

   if (!apiKey) {
      console.error("❌ GEMINI_API_KEY not found");
      return;
   }

   try {
      const response = await axios.get(`${baseUrl}/models?key=${apiKey}`, {
         headers: {
            "Content-Type": "application/json",
         },
      });

      console.log("✅ Available models:");
      response.data.models.forEach((model) => {
         console.log(`- ${model.name}`);
         console.log(
            `  Supported methods: ${
               model.supportedGenerationMethods?.join(", ") || "N/A"
            }`
         );
      });
   } catch (error) {
      console.error("❌ Failed to list models:");
      console.error(`Status: ${error.response?.status}`);
      console.error(
         `Error: ${error.response?.data?.error?.message || error.message}`
      );
   }
}

listAvailableModels();
