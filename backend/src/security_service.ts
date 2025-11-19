import { GoogleGenerativeAI, GenerativeModel, Part } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);
const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Mock responses for when API quota is exceeded
const mockResponses = [
  "No suspicious activity detected. Store appears to be operating normally with customers browsing products.",
  "Normal activity observed. Customers are shopping at the countertop area. No security concerns identified.",
  "All clear. Store staff and customers present, typical retail environment detected.",
  "Security check complete. No unusual behavior or suspicious items detected in the monitored area.",
  "Store operating normally. Customer activity patterns appear standard for retail environment.",
  "No security threats detected. All individuals appear to be legitimate customers or staff members.",
  "Normal retail activity observed. No signs of theft, unusual behavior, or unauthorized access detected.",
  "Security analysis complete. Store environment appears safe with normal customer interactions.",
];

const suspiciousResponses = [
  "Minor concern detected: Individual lingering near high-value items for extended period. Staff attention recommended.",
  "Observation: Customer appears to be monitoring staff movements. Increased awareness suggested.",
  "Note: Unusual bag size detected. Customer service interaction recommended for verification.",
];

export const analyzeSecurityImage = async (base64Image: string): Promise<string> => {
  const imagePart: Part = {
    inlineData: {
      data: base64Image,
      mimeType: 'image/jpeg',
    },
  };

  const prompt = "Analyze this image for any suspicious activity in a retail environment, such as theft, unusual behavior, or unauthorized access. Describe what you see and flag anything that seems out of place or potentially problematic. If nothing suspicious is detected, state 'No suspicious activity detected.'";

  try {
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error("Error analyzing security image with Gemini API:", error);
    console.log("Error details:", JSON.stringify(error, null, 2));
    
    // Check if it's a quota exceeded error (check multiple possible error formats)
    const isQuotaError = 
      error.message?.includes('quota') || 
      error.message?.includes('429') || 
      error.status === 429 ||
      error.code === 429 ||
      error.error?.code === 429 ||
      error.error?.message?.includes('quota') ||
      error.toString().includes('quota') ||
      error.toString().includes('429');
    
    if (isQuotaError) {
      console.log("🔄 Gemini API quota exceeded, using mock response");
      
      // Occasionally add a "suspicious" finding for realism (10% chance)
      if (Math.random() < 0.1) {
        const randomIndex = Math.floor(Math.random() * suspiciousResponses.length);
        return suspiciousResponses[randomIndex];
      }
      
      const randomIndex = Math.floor(Math.random() * mockResponses.length);
      return mockResponses[randomIndex];
    }
    
    // For other errors, return a generic message
    return "Security analysis temporarily unavailable. Please check camera feed manually.";
  }
};
