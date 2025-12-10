import { GoogleGenAI, Type } from "@google/genai";
import { AIRoutingSuggestion, DocPriority } from "../types";
import { AREAS } from "../constants";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeDocument = async (
  subject: string,
  description: string
): Promise<AIRoutingSuggestion | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  const areaNames = AREAS.map(a => `${a.id} (${a.name})`).join(", ");

  const prompt = `
    Eres un asistente administrativo experto para la Dirección Regional de Energía y Minas (DREM) de Apurímac.
    Tu tarea es analizar un documento entrante y sugerir a qué área debe ser derivado.
    
    Áreas disponibles: ${areaNames}.
    
    Documento:
    Asunto: "${subject}"
    Descripción: "${description}"
    
    Reglas:
    1. Temas legales, normativos o denuncias legales -> LEGAL (Asesoría Jurídica).
    2. Temas de presupuesto, personal, logística -> ADMIN (Administración).
    3. Concesiones mineras, fiscalización minera, REINFO -> MINERIA.
    4. Electrificación, concesiones eléctricas -> ENERGIA.
    5. Estudios de Impacto Ambiental, contaminación -> AMBIENTAL.
    6. Si no está claro -> DIRECCION.

    Responde con un JSON indicando el ID del área sugerida, una breve razón (reasoning) y la prioridad sugerida.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedAreaId: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            prioritySuggestion: { type: Type.STRING, enum: [DocPriority.LOW, DocPriority.NORMAL, DocPriority.HIGH, DocPriority.URGENT] }
          },
          required: ["suggestedAreaId", "reasoning", "prioritySuggestion"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIRoutingSuggestion;
    }
    return null;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return null;
  }
};

export const summarizeContent = async (text: string): Promise<string | null> => {
  const ai = getAIClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Resume el siguiente texto técnico/administrativo en un solo párrafo conciso para un sistema de trámite documentario. Texto: ${text}`,
    });
    return response.text || null;
  } catch (error) {
    console.error("Error summarizing:", error);
    return null;
  }
};