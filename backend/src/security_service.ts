import { GoogleGenerativeAI, GenerativeModel, Part } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);
const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" }); // Use latest flash model for vision analysis

export const analyzeSecurityImage = async (base64Image: string): Promise<string> => {
  const imagePart: Part = {
    inlineData: {
      data: base64Image,
      mimeType: 'image/jpeg', // Assuming JPEG for now, can be dynamic
    },
  };

  const prompt = "Analyze this image for any suspicious activity in a retail environment, such as theft, unusual behavior, or unauthorized access. Describe what you see and flag anything that seems out of place or potentially problematic. If nothing suspicious is detected, state 'No suspicious activity detected.'";

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error analyzing security image with Gemini API:", error);
    throw new Error("Failed to analyze security image.");
  }
};
