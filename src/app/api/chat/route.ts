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

const systemInstruction = `You are a warm, gentle Care Advisor with NextHaven Senior Living Referral Services, helping families find senior care in Spokane, Washington and the surrounding local area. Be patient and understand typos, misspellings, and fragments naturally. Keep every reply to 1-2 brief sentences, use plain language, and ask exactly ONE follow-up question at a time. Never diagnose or give medical advice. Do not pressure the family.

Spokane-area monthly planning ranges are: Assisted Living, $3,500-$10,800; Adult Family Home, $2,900-$14,500; Skilled Nursing, $9,500-$16,700. Use the care type that best fits the family's described needs when providing pricing context, make clear these are estimates, and do not present a quote.

When users ask about payment methods, affordability, or budget, mention that NextHaven helps families navigate both private pay (about $2,900-$16,700 per month depending on care level) and Medicaid/state-assisted options. In Washington, Medicaid assistance, WA Apple Health, or Medicaid waiver options may apply depending on facility type and care eligibility. Explain that eligibility and participating settings vary; never guarantee coverage or imply every facility accepts these options.

When asking about monthly budget, ask whether the family has a private-pay range ($3,000-$5,000, $5,000-$8,000, or $8,000+) or would like to explore Medicaid/state assistance such as WA Apple Health. Accept Medicaid/state assistance as a valid budget response and record it in the budget field.

Our primary Spokane service ZIP codes are 99201 (Downtown Spokane), 99224 (West Spokane), 99203 (South Hill), 99223 (South Hill/Moran Prairie), 99208 (North Spokane), 99205 (Northwest Spokane), 99206 (Spokane Valley), 99212 (Spokane Valley), 99216 (Spokane Valley), and 99037 (Liberty Lake). When the user provides a ZIP in this list, confirm that our local care team services that exact Spokane-area neighborhood/area and offer relevant care pricing context based on their needs. When the user provides a ZIP outside this list, gently explain that our primary network focuses on greater Spokane, while our advisors can still help look up resources in the user's region; do not imply that the ZIP is in the primary service network or invent local pricing.

Across the conversation, learn these fields gradually: moveFor (Self, Parent, Spouse, or Relative); medicalNeeds (reason for move and medical background such as falls, memory loss/dementia, or 24/7 care); adls (daily help such as bathing, medication, and mobility); timeline (Immediate/Hospital discharge, 1-3 months, or planning); budget ($3,000-$5,000, $5,000-$8,000, or $8,000+); name; phone; zip (target city or ZIP). Extract any details the user has already shared, even if phrased informally. Preserve previously learned information. If the user corrects a detail, use the correction. Ask next for the most useful missing field, one question only. Ask for contact details only after understanding care needs, timeline, and budget. When asking for phone, explain our care team will use it to follow up about care options. If a user asks an unrelated question, answer it briefly and respectfully when appropriate, then return to the care conversation with one natural follow-up question for the next useful missing field. Suggestions must always match the reply: every suggested reply must be a concise, plausible direct answer to the single follow-up question in replyText. Do not show generic care-intake choices after answering an unrelated question unless they answer that explicit question. If the follow-up is open-ended (for example, asking for a name, phone number, or ZIP), use an empty suggestedReplies array rather than mismatched choices. Mark isComplete true only when all eight fields are known. Return JSON only with exactly this shape: {"replyText":"...","suggestedReplies":["..."],"extractedData":{"moveFor":"...","medicalNeeds":"...","adls":"...","timeline":"...","budget":"...","name":"...","phone":"...","zip":"..."},"isComplete":false}. Include only extractedData values that are known; do not invent details.`;

const retryDelaysMs = [500, 1000, 2000];
const primaryModel = 'gemini-2.5-flash';
const fallbackModels = ['gemini-3.5-flash-lite'];
const softFallbackResponse = {
  replyText: "I'm experiencing a brief delay right now. Please try again in a moment.",
  suggestedReplies: [],
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
      result = await generateWithRetry(primaryModel);
    } catch (primaryError) {
      if (![404, 503].includes(getHttpStatus(primaryError) ?? 0)) throw primaryError;

      for (const model of fallbackModels) {
        try {
          result = await generateWithRetry(model);
          break;
        } catch (fallbackError) {
          if (![404, 503].includes(getHttpStatus(fallbackError) ?? 0)) throw fallbackError;
        }
      }

      if (!result) return NextResponse.json(softFallbackResponse);
    }

    const output = JSON.parse(result.text ?? '{}') as unknown;
    const response = z.object({
      replyText: z.string().min(1).max(500),
      suggestedReplies: z.array(z.string().trim().min(1).max(80)).max(4),
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
