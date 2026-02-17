'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '');

export async function parseStatementAction(formData: FormData) {
    try {
        const file = formData.get('file') as File;

        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = file.type;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze this bank statement or invoice image/PDF.
        Identify all RECURRING subscription payments (e.g., Netflix, Spotify, AWS, Gym, SaaS tools, Utilities).
        Ignore one-off transfers, groceries, or regular purchases.
        
        Return a strictly valid JSON array of objects with these fields:
        - name: string (clean merchant name)
        - amount: number (positive value)
        - currency: string (e.g., 'USD')
        - date: string (YYYY-MM-DD found in doc)
        - frequency: string ('Monthly' or 'Yearly' - infer from context or default to Monthly)

        Output ONLY raw JSON. No markdown formatting.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if Gemini adds them
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanedText);

        return { success: true, data };
    } catch (error: any) {
        console.error('Gemini Parse Error:', error);
        return { success: false, error: error.message };
    }
}
