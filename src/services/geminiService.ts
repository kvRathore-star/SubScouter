import { GoogleGenerativeAI } from "@google/generative-ai";
import { MailSnippet } from "./mailService";

const geminiKey = process.env.GEMINI_API_KEY;

if (!geminiKey && process.env.NODE_ENV === 'production') {
  console.error("CRITICAL_ERROR: GEMINI_API_KEY is missing. AI Scouting disabled.");
}

const genAI = new GoogleGenerativeAI(geminiKey || "AIza_fallback_for_dev_only");

/**
 * Gemini AI Service
 * Parses email snippets into structured subscription data.
 */
export class GeminiScoutService {
  async parseSnippets(snippets: MailSnippet[]) {
    if (process.env.GEMINI_API_KEY === undefined && process.env.NODE_ENV === 'production') {
      console.warn("Gemini API Key missing, skipping AI analysis.");
      return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert subscription auditor. Analyze the following email subject lines and snippets.
      Extract a JSON array of active subscriptions. 
      For each item, identify:
      1. "name": Merchant/Service Name (e.g., Netflix, AWS, Spotify)
      2. "amount": Estimated Monthly Price (number)
      3. "currency": Currency code (e.g., "USD", "INR", "EUR")
      4. "billingCycle": Frequency ("monthly" or "yearly")
      5. "nextBillingDate": Next Estimated Renewal Date (ISO date string YYYY-MM-DD)
      6. "category": Category (one of: "Entertainment", "Productivity", "Cloud", "Finance", "Health", "Education", "Shopping", "Other")
      
      Emails:
      ${snippets.map(s => `ID: ${s.id} | Subject: ${s.subject || 'N/A'} | Date: ${s.date || 'N/A'} | Snippet: ${s.snippet}`).join('\n')}
      
      Return ONLY a pure JSON array. No markdown code blocks. No explanation.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error("Gemini Parsing Error:", e);
      return [];
    }
  }
}
