
import { GoogleGenAI } from "@google/genai";

export const getRelationshipAdvice = async (topic: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `En tant qu'expert en relations de couple et intelligence émotionnelle, donne un conseil court (3-4 phrases) sur le sujet suivant : ${topic}. Sois bienveillant, constructif et utilise le "vous" pour t'adresser à un couple.`,
    config: {
      systemInstruction: "Tu es un coach expert en relations amoureuses, inspiré par John Gottman et Gary Chapman. Ton ton est sophistiqué, chaleureux et encourageant.",
    },
  });

  return response.text || "Désolé, je ne peux pas donner de conseil pour le moment.";
};
