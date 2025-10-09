/**
 * Google Gemini AI Service
 * Advanced chatbot powered by Google Gemini API
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// Validate API key
if (!GEMINI_API_KEY) {
  console.error('❌ VITE_GEMINI_API_KEY is not configured in .env file');
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GeminiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Send message to Gemini AI and get response
 */
export const sendMessageToGemini = async (
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<GeminiResponse> => {
  try {
    console.log('🤖 Sending message to Gemini AI:', message);

    // Build conversation context
    const context = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Add system prompt for farming context
    const systemPrompt = `You are ACHHADAM AI Assistant, a helpful and knowledgeable AI chatbot for a digital farming platform called ACHHADAM.

Your role is to help farmers, buyers, and other users with:
- Agricultural advice and best practices
- Crop management and farming techniques
- Market information and pricing
- Weather-related farming decisions
- Platform features and how to use ACHHADAM
- General farming questions in Hindi, English, or Marathi

Be friendly, professional, and provide accurate information. If you don't know something, say so honestly.

Previous conversation:
${context}

Current user question: ${message}

Please provide a helpful and concise response:`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Gemini API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get response from Gemini AI');
    }

    const data = await response.json();
    console.log('✅ Gemini AI response received');

    // Extract the text response
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      throw new Error('No response generated');
    }

    return {
      success: true,
      message: aiResponse
    };

  } catch (error) {
    console.error('❌ Error communicating with Gemini AI:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

/**
 * Get quick farming tips from Gemini
 */
export const getFarmingTip = async (): Promise<GeminiResponse> => {
  const tips = [
    'What are the best practices for organic farming?',
    'How can I improve my crop yield naturally?',
    'What should I consider for monsoon season farming?',
    'How do I protect crops from pests organically?',
    'What are the benefits of crop rotation?'
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  return sendMessageToGemini(randomTip);
};

/**
 * Get crop-specific advice
 */
export const getCropAdvice = async (cropName: string): Promise<GeminiResponse> => {
  return sendMessageToGemini(
    `Please provide detailed advice on growing ${cropName}, including best planting season, soil requirements, water needs, and common challenges.`
  );
};

/**
 * Get market insights
 */
export const getMarketInsights = async (cropName: string): Promise<GeminiResponse> => {
  return sendMessageToGemini(
    `What are the current market trends and pricing considerations for ${cropName} in India?`
  );
};

export default {
  sendMessageToGemini,
  getFarmingTip,
  getCropAdvice,
  getMarketInsights
};
