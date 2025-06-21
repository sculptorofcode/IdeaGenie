import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    // TODO: Replace this with an API call to the backend service
    const industries = await step.run("Fetch industries", async () => {
      // Mock data or fetch from API instead of Prisma
      return [
        { industry: "Technology" },
        { industry: "Healthcare" },
        { industry: "Finance" }
      ];
    });

    for (const { industry } of industries) {
      const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

      const res = await step.ai.wrap(
        "gemini",
        async (p) => {
          return await model.generateContent(p);
        },
        prompt
      );

      const text = res.response.candidates[0].content.parts[0].text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);      await step.run(`Update ${industry} insights`, async () => {
        // TODO: Replace with an API call to update data in the backend
        console.log(`Updated insights for ${industry}:`, insights);
        
        // Example of how to call an API instead of using Prisma directly:
        // await fetch('/api/industry-insights', {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     industry,
        //     ...insights,
        //     lastUpdated: new Date(),
        //     nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        //   })
        // });
      });
    }
  }
);
