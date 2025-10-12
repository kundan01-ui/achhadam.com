/**
 * AI Chatbot Service
 * Primary: Google Gemini API
 * Fallback: Hugging Face (GLM-4.6 via OpenAI-compatible API)
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Hugging Face Fallback Configuration
const HF_API_KEY = import.meta.env.VITE_HF_TOKEN;
const HF_API_URL = 'https://router.huggingface.co/v1/chat/completions';
const HF_MODEL = 'zai-org/GLM-4.6:novita';

// Validate API keys
if (!GEMINI_API_KEY) {
  console.warn('⚠️ VITE_GEMINI_API_KEY not configured - will use Hugging Face fallback');
}
if (!HF_API_KEY) {
  console.warn('⚠️ VITE_HF_TOKEN not configured - fallback unavailable');
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
  provider?: 'gemini' | 'huggingface';
}

/**
 * Send message to Hugging Face (Fallback)
 */
const sendToHuggingFace = async (
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<GeminiResponse> => {
  try {
    console.log('🤗 Using Hugging Face fallback...');

    if (!HF_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    // Build conversation context for OpenAI-compatible format
    const messages = [
      {
        role: 'system',
        content: `You are ACHHADAM AI Assistant, a helpful AI for a digital farming platform. Help with agricultural advice, crop management, market info, weather decisions, and platform features. Support Hindi, English, and Marathi.`
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_API_KEY}`
      },
      body: JSON.stringify({
        model: HF_MODEL,
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Hugging Face API error:', errorData);
      throw new Error(errorData.error?.message || 'Hugging Face API failed');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from Hugging Face');
    }

    console.log('✅ Hugging Face response received');
    return {
      success: true,
      message: aiResponse,
      provider: 'huggingface'
    };

  } catch (error) {
    console.error('❌ Hugging Face error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      provider: 'huggingface'
    };
  }
};

/**
 * Send message to Gemini AI and get response (with Hugging Face fallback)
 */
export const sendMessageToGemini = async (
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<GeminiResponse> => {
  // Try Gemini first if API key is available
  if (GEMINI_API_KEY) {
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
        message: aiResponse,
        provider: 'gemini'
      };

    } catch (error) {
      console.error('❌ Gemini API failed, trying Hugging Face fallback...', error);

      // Fallback to Hugging Face
      if (HF_API_KEY) {
        return await sendToHuggingFace(message, conversationHistory);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI service unavailable',
        provider: 'gemini'
      };
    }
  }

  // If Gemini not available, use Hugging Face directly
  console.log('⚠️ Gemini API key not found, using Hugging Face');
  return await sendToHuggingFace(message, conversationHistory);
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
