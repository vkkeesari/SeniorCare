import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const requestSchema = z.object({
  sessionId: z.string().min(1).max(120),
  messageHistory: z.array(z.object({ sender: z.enum(['user', 'bot']), text: z.string().max(2000) })).max(40),
  userMessage: z.string().trim().min(1).max(2000),
});

const extractedDataSchema = z.object({
  moveFor: z.string().optional(),
  medicalNeeds: z.string().optional(),
  adls: z.string().optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  zip: z.string().optional(),
});

const systemInstruction = `You are a warm, gentle Care Advisor with Senior Care Advisory, helping families find senior care. Be patient and understand typos, misspellings, and fragments naturally. Keep every reply to 1-2 brief sentences, use plain language, and ask exactly ONE follow-up question at a time. Never diagnose or give medical advice. Do not pressure the family.

Across the conversation, learn these fields gradually: moveFor (Self, Parent, Spouse, or Relative); medicalNeeds (reason for move and medical background such as falls, memory loss/dementia, or 24/7 care); adls (daily help such as bathing, medication, and mobility); timeline (Immediate/Hospital discharge, 1-3 months, or planning); budget ($3,000-$5,000, $5,000-$8,000, or $8,000+); name; phone; zip (target city or ZIP). Extract any details the user has already shared, even if phrased informally. Preserve previously learned information. If the user corrects a detail, use the correction. Ask next for the most useful missing field, one question only. Ask for contact details only after understanding care needs, timeline, and budget. When asking for phone, explain our care team will use it to follow up about care options. Mark isComplete true only when all eight fields are known. Return JSON only with exactly this shape: {"replyText":"...","extractedData":{"moveFor":"...","medicalNeeds":"...","adls":"...","timeline":"...","budget":"...","name":"...","phone":"...","zip":"..."},"isComplete":false}. Include only extractedData values that are known; do not invent details.`;

const retryDelaysMs = [500, 1000, 2000];
const fallbackModels = ['gemini-1.5-flash-8b', 'gemini-1.5-pro'];
const softFallbackResponse = {
  replyText: "I'm experiencing a brief delay right now. What city or ZIP code are you looking for care in?",
  extractedData: {},
  isComplete: false,
};

function getHttpStatus(error: unknown) {
  if (typeof error !== 'object' || error === null || !('status' in error)) return undefined;
  const status = error.status;
  return typeof status === 'number' ? status : undefined;
}

function isTransientError(error: unknown) {
  const status = getHttpStatus(error);
  if (status && [408, 429, 500, 502, 503, 504].includes(status)) return true;

  if (typeof error !== 'object' || error === null) return false;
  const candidate = error as { name?: unknown; code?: unknown; cause?: { code?: unknown } };
  const code = candidate.code ?? candidate.cause?.code;
  return candidate.name === 'AbortError' || (typeof code === 'string' && [
    'ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN', 'ENETUNREACH', 'UND_ERR_CONNECT_TIMEOUT',
  ].includes(code));
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chat is not configured yet. Please set GEMINI_API_KEY on the hosting environment.' }, { status: 503 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please send a valid chat message.' }, { status: 400 });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const conversation = parsed.data.messageHistory.map(({ sender, text }) => ({
      role: sender === 'bot' ? 'model' : 'user',
      parts: [{ text }],
    }));
    conversation.push({ role: 'user', parts: [{ text: parsed.data.userMessage }] });
    const generateWithRetry = async (model: string) => {
      for (let attempt = 0; ; attempt += 1) {
        try {
          return await ai.models.generateContent({
            model,
            contents: conversation,
            config: { systemInstruction, responseMimeType: 'application/json' },
          });
        } catch (error) {
          if (!isTransientError(error) || attempt >= retryDelaysMs.length) throw error;
          await new Promise(resolve => setTimeout(resolve, retryDelaysMs[attempt]));
        }
      }
    };

    let result;
    try {
      result = await generateWithRetry(process.env.GEMINI_MODEL ?? 'gemini-1.5-flash');
    } catch (primaryError) {
      if (getHttpStatus(primaryError) !== 503) throw primaryError;

      for (const model of fallbackModels) {
        try {
          result = await generateWithRetry(model);
          break;
        } catch (fallbackError) {
          if (getHttpStatus(fallbackError) !== 503) throw fallbackError;
        }
      }

      if (!result) return NextResponse.json(softFallbackResponse);
    }

    const output = JSON.parse(result.text ?? '{}') as unknown;
    const response = z.object({
      replyText: z.string().min(1).max(500),
      extractedData: extractedDataSchema,
      isComplete: z.boolean(),
    }).parse(output);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Care chat provider request failed:', {
      status: getHttpStatus(error),
      transient: isTransientError(error),
    });
    return NextResponse.json(softFallbackResponse);
  }
}
