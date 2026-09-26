import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import dns from 'node:dns';

// Force Node.js to prefer IPv4 DNS resolution to prevent local Windows fetch failures
dns.setDefaultResultOrder('ipv4first');

const APEX_SYSTEM_INSTRUCTION = `
You are APEX, an elite, uncompromising bodybuilding, muscle hypertrophy, and fitness coach. Your entire existence revolves around absolute discipline, obsession, heavy lifting, getting fit, and staying lean. 
Your tone is intense, unfiltered, authoritative, zero-tolerance, and slightly intimidating. You treat excuses like poison.

RULES:
1. STRICT TOPIC ENFORCEMENT: You ONLY answer questions related to weightlifting, bodybuilding, exercise form, muscle hypertrophy, fat loss, gym equipment, workout splits, and sports nutrition.
2. THE REJECTION PROTOCOL: If the user asks about ANY non-fitness topic (such as coding, general knowledge, history, math, random chat, or casual greetings that don't transition immediately to lifting), you MUST aggressively shut them down in character. Mock the distraction, remind them that discipline is required, and demand a gym or training-related question instead.
3. Keep your answers sharp, high-impact, and formatted cleanly. No fluff.
`;

const GEMINI_MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash'];

function getGeminiStatus(error) {
  return (
    error?.status ||
    error?.statusCode ||
    error?.response?.status ||
    error?.cause?.status ||
    error?.cause?.response?.status ||
    null
  );
}

function normalizeMessages(messages = []) {
  return messages
    .filter((msg) => msg && typeof msg.content === 'string' && msg.content.trim())
    .map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content.trim() }],
    }));
}

async function generateApexReply(ai, contents) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: APEX_SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      });

      const text =
        response?.text ||
        response?.candidates?.[0]?.content?.parts
          ?.map((part) => part?.text || '')
          .join('') ||
        'Apex stared at you in silence. Speak clearly.';

      return { text, model };
    } catch (error) {
      lastError = error;
      const status = getGeminiStatus(error);
      const message = (error?.message || '').toLowerCase();

      const isTransientIssue = [429, 500, 503].includes(status) || message.includes('high demand');
      const isModelUnavailable =
        status === 404 ||
        message.includes('not found') ||
        message.includes('no longer available') ||
        message.includes('not available') ||
        message.includes('not supported for generatecontent');

      if (isTransientIssue || isModelUnavailable) {
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Apex says: GEMINI_API_KEY is missing from your environment variables.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const contents = normalizeMessages(messages);

    if (!contents.length) {
      return NextResponse.json(
        { error: 'Apex says: no valid chat content was provided.' },
        { status: 400 }
      );
    }

    const { text } = await generateApexReply(ai, contents);

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error('API Error Details:', error);

    const status = getGeminiStatus(error);
    const message = (error?.message || '').toLowerCase();
    const isTransientGeminiIssue = [429, 500, 503].includes(status) || message.includes('high demand');
    const isModelUnavailableIssue =
      status === 404 ||
      message.includes('not found') ||
      message.includes('no longer available') ||
      message.includes('not available') ||
      message.includes('not supported for generatecontent');

    return NextResponse.json(
      {
        error: isTransientGeminiIssue
          ? 'Apex says: Gemini is temporarily overloaded. Please try again in a moment.'
          : isModelUnavailableIssue
            ? 'Apex says: Gemini is not available for this API key or project configuration right now. Verify the key and project access, then try again.'
            : `Apex error: ${error.message}`,
      },
      { status: isTransientGeminiIssue ? 503 : isModelUnavailableIssue ? 503 : 500 }
    );
  }
}