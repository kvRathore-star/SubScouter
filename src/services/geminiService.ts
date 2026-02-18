import { GoogleGenerativeAI } from "@google/generative-ai";
import { MailSnippet } from "./imapScoutService";

const geminiKey = process.env.GEMINI_API_KEY;

if (!geminiKey && process.env.NODE_ENV === 'production') {
  console.error("CRITICAL_ERROR: GEMINI_API_KEY is missing. AI Scouting disabled.");
}

const genAI = new GoogleGenerativeAI(geminiKey || "AIza_fallback_for_dev_only");

/**
 * THE INTELLIGENCE CORE
 * Uses Gemini 1.5 Flash to parse email metadata into subscriptions.
 */
export class GeminiScoutService {
  async parseSnippets(snippets: MailSnippet[]) {
    // Return early if key is mock
    if (process.env.GEMINI_API_KEY === undefined && process.env.NODE_ENV === 'production') {
      console.warn("Gemini API Key missing, skipping AI synthesis.");
      return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert subscription auditor. Analyze the following email subject lines and snippets.
      Extract a JSON array of active subscriptions. 
      For each item, identify:
      1. Merchant Name (e.g., Netflix, AWS, Spotify)
      2. Estimated Monthly Price
      3. Currency
      4. Frequency (Monthly, Yearly)
      5. Next Estimated Renewal Date
      
      Emails:
      ${snippets.map(s => `Subject: ${s.subject} | From: ${s.from} | Date: ${s.date} | Snippet: ${s.snippet}`).join('\n')}
      
      Return ONLY a pure JSON array. No markdown code blocks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Clean possible markdown artifacts
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Gemini Parsing Error:", e);
      return [];
    }
  }
}
