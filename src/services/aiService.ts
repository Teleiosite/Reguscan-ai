import { GoogleGenAI } from '@google/genai';

const LOCAL_STORAGE_KEY = 'reguscan_gemini_api_key';

export const aiService = {
  // 1. Retrieve API Key (Checks localStorage first, then Vite environment variables)
  getApiKey: (): string => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored && stored.trim() !== '') return stored.trim();
    } catch {
      // ignore
    }

    const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY ||
                   (import.meta as any).env?.VITE_AI_API_KEY ||
                   '';
    return envKey.trim();
  },

  // 2. Save API Key locally
  saveApiKey: (key: string): void => {
    if (key.trim()) {
      localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  },

  // 3. Check if an API key is available
  hasApiKey: (): boolean => {
    return aiService.getApiKey().length > 10;
  },

  // 4. Test API Key validity
  testApiKey: async (keyToTest?: string): Promise<{ valid: boolean; message: string }> => {
    const key = keyToTest || aiService.getApiKey();
    if (!key) {
      return { valid: false, message: 'No API key provided.' };
    }

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Confirm NAFDAC regulatory AI connection with a 5-word status.'
      });

      if (response && response.text) {
        return { valid: true, message: `Connected! Response: "${response.text.trim()}"` };
      }
      return { valid: false, message: 'Received empty response from Gemini API.' };
    } catch (err: any) {
      return { valid: false, message: err.message || 'Failed to authenticate with Gemini API.' };
    }
  },

  // 5. Intelligent Document Parsing with Gemini
  parseDocumentWithAI: async (
    documentName: string,
    rawTextOrSnippet: string,
    directorate: string
  ): Promise<any> => {
    const key = aiService.getApiKey();
    if (!key) return null;

    try {
      const ai = new GoogleGenAI({ apiKey: key });
      const prompt = `You are a NAFDAC Regulatory Dossier Technical Assessor for Directorate ${directorate}.
Analyze the following document submission: "${documentName}".
Document text excerpt:
"${rawTextOrSnippet}"

Extract structured data as JSON:
{
  "issuingAuthority": "name of laboratory or government authority",
  "batchNumber": "tested batch number",
  "issueDate": "YYYY-MM-DD",
  "expiryDate": "YYYY-MM-DD",
  "testedParameters": [
    {"parameter": "test name", "result": "measured value", "specification": "pharmacopoeial limit", "status": "PASS or FAIL"}
  ],
  "regulatoryAssessment": "brief one-sentence compliance summary"
}
Output strictly valid JSON only.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const cleanJson = (res.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('Gemini live parsing fallback:', err);
      return null;
    }
  }
};
