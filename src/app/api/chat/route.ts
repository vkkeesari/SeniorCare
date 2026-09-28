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
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? 'gemini-3.8-flash',
      contents: conversation,
      config: { systemInstruction, responseMimeType: 'application/json' },
    });
    const output = JSON.parse(result.text ?? '{}') as unknown;
    const response = z.object({
      replyText: z.string().min(1).max(500),
      extractedData: extractedDataSchema,
      isComplete: z.boolean(),
    }).parse(output);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Care chat request failed:', error);
    return NextResponse.json({ error: 'I had trouble responding just now. Please try again in a moment.' }, { status: 502 });
  }
}
