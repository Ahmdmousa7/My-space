import { GoogleGenAI, Type } from "@google/genai";

export const processSmartCapture = async (text: string) => {
  if (!text.trim()) return null;
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key not found. Please set VITE_GEMINI_API_KEY in your .env.local file");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following unstructured text and categorize it into Tasks, Links, Google Sheets, and Sticky Notes. 
      If something looks like a task (actionable), put it in tasks. 
      If it's a URL, check if it's a Google Sheet (contains docs.google.com/spreadsheets) vs a normal link.
      For Links, look for explicit user categories (e.g. "Category: Work") or infer a category (e.g., Work, Inspiration, Reference, News) based on the URL or context. If unsure, use "Unsorted".
      Everything else should be a note.
      
      Input text:
      "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["low", "medium", "high"] }
                }
              }
            },
            links: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  category: { type: Type.STRING }
                }
              }
            },
            sheets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING }
                }
              }
            },
            notes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  content: { type: Type.STRING },
                  color: { type: Type.STRING, enum: ["yellow", "blue", "green", "red", "purple"] }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Smart Capture Error:", error);
    throw error;
  }
};