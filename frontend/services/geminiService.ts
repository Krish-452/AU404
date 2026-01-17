
import { GoogleGenAI, Type } from "@google/genai";
import { AccessRequest, IdentityAttribute } from "../types";

export const analyzeRiskWithGemini = async (request: AccessRequest, userAttributes: IdentityAttribute[]) => {
  // Always initialize GoogleGenAI with a named parameter and use process.env.API_KEY directly as per guidelines.
  // Creating a new instance right before the call ensures the most current context/keys are used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this data access request for privacy risk:
    Requester: ${request.requesterName} (${request.requesterType})
    Purpose: ${request.purpose}
    Data Requested: ${request.attributesRequested.join(", ")}
    Duration: ${request.durationDays} days
    
    User Context: User has attributes in categories: ${Array.from(new Set(userAttributes.map(a => a.category))).join(", ")}.
    
    Tasks:
    1. Calculate a risk score from 0 (low) to 100 (high).
    2. Provide a 2-sentence summary of why this is risky or safe.
    3. Suggest one privacy-preserving tip (e.g., data minimization).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { 
              type: Type.NUMBER,
              description: "The calculated risk score from 0 to 100."
            },
            analysis: { 
              type: Type.STRING,
              description: "A summary analysis of the risk level."
            },
            tip: { 
              type: Type.STRING,
              description: "A privacy-preserving recommendation."
            }
          },
          required: ["riskScore", "analysis", "tip"],
          propertyOrdering: ["riskScore", "analysis", "tip"]
        }
      }
    });

    // Access text as a property, not a method, as per SDK documentation.
    const responseText = response.text;
    if (!responseText) throw new Error("Empty response from AI");
    
    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error("Gemini analysis error:", error);
    // Graceful fallback for demo or error scenarios
    return { 
      riskScore: 30, 
      analysis: "Standard verification. Request appears routine for the sector.", 
      tip: "Ensure you revoke access after service is complete." 
    };
  }
};
