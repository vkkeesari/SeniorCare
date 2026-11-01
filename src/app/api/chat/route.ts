import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { isSupportedSpokaneZip, isValidZipCode, spokaneServiceZipCodes } from '@/lib/spokaneServiceArea';

export const runtime = 'nodejs';

const requestSchema = z.object({
  sessionId: z.string().min(1).max(120),
  messageHistory: z.array(z.object({ sender: z.enum(['user', 'bot']), text: z.string().max(2000) })).max(40),
  userMessage: z.string().trim().min(1).max(2000),
});

const optionalText = z.preprocess(
  value => value === null ? undefined : value,
  z.string().trim().optional(),
);

const extractedDataSchema = z.object({
  moveFor: optionalText,
  medicalNeeds: optionalText,
  adls: optionalText,
  timeline: optionalText,
  budget: optionalText,
  name: optionalText,
  phone: optionalText,
  email: z.preprocess(
    value => {
      if (value === null || typeof value !== 'string' || !value.trim()) return undefined;
      return z.string().email().safeParse(value.trim()).success ? value.trim() : undefined;
    },
    z.string().email().optional(),
  ),
  preferredContactMethod: z.preprocess(value => {
    if (value === null || typeof value !== 'string') return undefined;
    const normalized = value.trim().toLowerCase();
    return normalized === 'phone' || normalized === 'email' ? normalized : undefined;
  }, z.enum(['phone', 'email']).optional()),
  zip: optionalText,
  interestedInMoving: z.preprocess(value => value === null ? undefined : value, z.boolean().optional()),
});

const systemInstruction = `You are a warm, thoughtful Care Advisor with NextHaven Senior Living Referral Services, helping people explore senior care in Spokane, Washington and the surrounding local area. Sound like a real, attentive person: acknowledge the user's specific concern before asking the next question, use natural phrasing, and avoid repetitive scripts or sales language. Be patient and understand typos, misspellings, and fragments naturally. Keep every reply to 1-2 brief sentences, use plain language, and ask exactly ONE follow-up question at a time. Never diagnose or give medical advice. Do not pressure the user, imply that a placement decision has been made, or assume that a nursing home is the right option. Present care settings as options to explore based on the user's needs and preferences, and make clear that the user and their family decide what feels right. Do not manufacture urgency; if the user describes a time-sensitive situation such as a hospital discharge, acknowledge that constraint calmly and offer practical next steps without pushing a particular setting.

Spokane-area monthly planning ranges are: Assisted Living, $3,500-$10,800; Adult Family Home, $2,900-$14,500; Skilled Nursing, $9,500-$16,700. Use the care type that best fits the family's described needs when providing pricing context, make clear these are estimates, and do not present a quote.

When users ask about payment methods, affordability, or budget, mention that NextHaven helps families navigate both private pay (about $2,900-$16,700 per month depending on care level) and Medicaid/state-assisted options. In Washington, Medicaid assistance, WA Apple Health, or Medicaid waiver options may apply depending on facility type and care eligibility. Explain that eligibility and participating settings vary; never guarantee coverage or imply every facility accepts these options.

When asking about monthly budget, ask whether the family has a private-pay range ($3,000-$5,000, $5,000-$8,000, or $8,000+) or would like to explore Medicaid/state assistance such as WA Apple Health. Accept Medicaid/state assistance as a valid budget response and record it in the budget field.

Our primary Spokane service ZIP codes are 99201 (Downtown Spokane), 99224 (West Spokane), 99203 (South Hill), 99223 (South Hill/Moran Prairie), 99208 (North Spokane), 99205 (Northwest Spokane), 99206 (Spokane Valley), 99212 (Spokane Valley), 99216 (Spokane Valley), and 99037 (Liberty Lake). When the user provides a ZIP in this list, confirm that our local care team services that exact Spokane-area neighborhood/area and offer relevant care pricing context based on their needs. When the user provides a ZIP outside this list, gently explain that our primary network focuses on greater Spokane, while our advisors can still help look up resources in the user's region; do not imply that the ZIP is in the primary service network or invent local pricing. If a ZIP is outside the approved list, do not extract it as the zip field and do not mark the lead complete. Ask the user for a supported ZIP instead, with concise suggestions from this list: ${spokaneServiceZipCodes.join(', ')}. If the user later provides a supported ZIP, use it in place of any previously rejected ZIP and continue the flow.

Before asking for the user's name, phone number, or other contact details, first collect their care needs, timeframe, and budget, then ask for and validate their ZIP code. Never ask for contact details until the ZIP is confirmed as one of our supported Spokane service ZIP codes.

Across the conversation, learn these fields gradually: moveFor (Self, Parent, Spouse, or Relative); medicalNeeds (reason for move and medical background such as falls, memory loss/dementia, or 24/7 care); adls (daily help such as bathing, medication, and mobility); timeline (Immediate/Hospital discharge, 1-3 months, or planning); budget ($3,000-$5,000, $5,000-$8,000, or $8,000+); zip (target Spokane ZIP); name; phone; and interestedInMoving (true only when the user says they want help with local senior moving, downsizing, or transition services, otherwise false only after they decline). Extract email and preferredContactMethod only if the user voluntarily provides them. Extract any details the user has already shared, even if phrased informally. Preserve previously learned information. If the user corrects a detail, use the correction. Ask next for the most useful missing field, one question only. Once care needs, timeline, and budget are understood, ask for the ZIP code and validate it before requesting any name or contact details. If the ZIP is unsupported, ask for a supported Spokane ZIP and do not ask for name, phone, or email. Ask for contact details only after a supported ZIP is confirmed. When asking for phone, explain our care team will use it to follow up about care options. Once the other eight fields are known and interestedInMoving is unknown, tell the user exactly: "In addition to senior living placement, NextHaven also assists families with local senior moving, downsizing, and transition services." Then ask whether they would like help with those services. Do not mark the lead complete until the user answers yes or no to that question. When all fields are known, thank them and do not ask another question. If a user asks an unrelated question, answer it briefly and respectfully when appropriate, then return to the care conversation with one natural follow-up question for the next useful missing field. Suggestions must always match the reply: every suggested reply must be a concise, plausible direct answer to the single follow-up question in replyText. Do not show generic care-intake choices after answering an unrelated question unless they answer that explicit question. If the follow-up is open-ended (for example, asking for a name, phone number, or ZIP), use an empty suggestedReplies array rather than mismatched choices. Mark isComplete true only when all nine fields are known. Return JSON only with exactly this shape: {"replyText":"...","suggestedReplies":["..."],"extractedData":{"moveFor":"...","medicalNeeds":"...","adls":"...","timeline":"...","budget":"...","zip":"...","name":"...","phone":"...","email":"...","preferredContactMethod":"phone or email","interestedInMoving":false},"isComplete":false}. Include only extractedData values that are known; do not invent details.`;

const retryDelaysMs = [500, 1000, 2000];
const primaryModel = 'gemini-2.5-flash';
const fallbackModels = ['gemini-3.5-flash-lite'];
const zipPolicyInstruction = `ZIP POLICY OVERRIDE: A valid ZIP code is any five-digit ZIP or ZIP+4, whether or not it is in our Spokane service area. Record every valid ZIP exactly as provided. Never reject, erase, or ask the user to replace a valid out-of-area ZIP with a Spokane ZIP. If a valid ZIP is outside our primary service ZIP list, briefly say "We don't primarily serve that area, but I'll note the ZIP and help you explore resources." Then continue with the next missing intake question. Ask for a ZIP before contact details only when no valid ZIP has been provided. A phone number is not a ZIP: never interpret a 7-, 10-, or 11-digit number as a ZIP.`;

function getZipFromMessage(userMessage: string) {
  const standaloneZip = /^\s*\d{5}(?:-\d{4})?\s*$/.test(userMessage)
    ? userMessage.trim()
    : undefined;
  if (standaloneZip) return standaloneZip;

  return userMessage.match(/\b(?:zip(?:\s*code)?|postal code)\s*(?:is|:|#)?\s*(\d{5}(?:-\d{4})?)\b/i)?.[1]
    ?? userMessage.match(/\b(?:in|at|near)\s+(\d{5})\b/i)?.[1];
}

function getLatestZipCandidate(
  messageHistory: Array<{ sender: 'user' | 'bot'; text: string }>,
  userMessage: string,
) {
  const currentZip = getZipFromMessage(userMessage);
  if (currentZip) return { currentZip, zip: currentZip };

  const previousZip = messageHistory
    .filter(message => message.sender === 'user')
    .reverse()
    .map(message => getZipFromMessage(message.text))
    .find((zip): zip is string => Boolean(zip));

  return { currentZip: undefined, zip: previousZip };
}

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
  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json({ error: 'The chat request was not valid JSON.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(requestBody);
  if (!parsed.success) return NextResponse.json({ error: 'Please send a valid chat message.' }, { status: 400 });

  const { currentZip, zip: latestZip } = getLatestZipCandidate(
    parsed.data.messageHistory,
    parsed.data.userMessage,
  );
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Chat is not configured yet. Please set GEMINI_API_KEY on the hosting environment.' }, { status: 503 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { timeout: 15_000 } });
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
            config: {
              systemInstruction: `${systemInstruction}\n\n${zipPolicyInstruction}`,
              responseMimeType: 'application/json',
            },
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

      if (!result) {
        return NextResponse.json(
          { error: 'The chat service is temporarily unavailable. Please try again.' },
          { status: 503 },
        );
      }
    }

    let output: unknown;
    try {
      output = JSON.parse(result.text ?? '');
    } catch {
      console.error('Care chat provider returned an invalid response.');
      return NextResponse.json(
        { error: 'The chat service returned an incomplete response. Please try again.' },
        { status: 502 },
      );
    }

    const response = z.object({
      replyText: z.string().trim().min(1).max(2000),
      suggestedReplies: z.preprocess(
        value => Array.isArray(value)
          ? value.filter((reply): reply is string => typeof reply === 'string' && Boolean(reply.trim())).slice(0, 8)
          : [],
        z.array(z.string().trim().min(1).max(200)).max(8),
      ),
      extractedData: z.preprocess(
        value => value === null ? {} : value,
        extractedDataSchema,
      ),
      isComplete: z.preprocess(value => value === null || value === undefined ? false : value, z.boolean()),
    }).safeParse(output);
    if (!response.success) {
      console.error('Care chat provider response did not match the expected format:', response.error.issues.map(issue => ({
        path: issue.path,
        code: issue.code,
      })));
      return NextResponse.json(
        { error: 'The chat service returned an incomplete response. Please try again.' },
        { status: 502 },
      );
    }

    const extractedData = {
      ...response.data.extractedData,
      zip: latestZip,
    };
    if (!isValidZipCode(extractedData.zip)) extractedData.zip = undefined;
    const hasValidZip = isValidZipCode(extractedData.zip);
    const hasSupportedZip = hasValidZip && isSupportedSpokaneZip(extractedData.zip);
    const hasCareProfile = [
      extractedData.moveFor,
      extractedData.medicalNeeds,
      extractedData.adls,
      extractedData.timeline,
      extractedData.budget,
    ].every(value => typeof value === 'string' && value.trim().length > 0);
    const asksForContactDetails = /\b(name|phone|phone number|contact details|email address)\b|(?:best|good|preferred) (?:number|way) to (?:reach|contact)|how (?:can|may) (?:we|our team) (?:reach|contact|call)|(?:what|which) number.*\b(call|reach|contact)\b/i.test(response.data.replyText);
    const mustAskForZip = !hasValidZip && (hasCareProfile || asksForContactDetails);
    const safeExtractedData = hasValidZip
      ? extractedData
      : {
        ...extractedData,
        name: undefined,
        phone: undefined,
        email: undefined,
        preferredContactMethod: undefined,
      };
    const hasCompleteCareDetails = [
      safeExtractedData.moveFor,
      safeExtractedData.medicalNeeds,
      safeExtractedData.adls,
      safeExtractedData.timeline,
      safeExtractedData.budget,
      safeExtractedData.name,
      safeExtractedData.phone,
    ].every(value => typeof value === 'string' && value.trim().length > 0)
      && hasValidZip;
    const outOfAreaNotice = "We don't primarily serve that area, but I'll note the ZIP and help you explore resources.";
    const outOfAreaZip = Boolean(currentZip && hasValidZip && !hasSupportedZip);
    const asksForSpokaneZip = /\b(?:supported|Spokane|service.area)\b.{0,50}\bZIP\b|\bZIP\b.{0,50}\b(?:supported|Spokane|service area|instead)\b/i.test(response.data.replyText);
    const outOfAreaFollowUp = !safeExtractedData.moveFor
      ? 'Who are you looking for care for?'
      : !safeExtractedData.medicalNeeds
        ? 'What care needs or concerns should we keep in mind?'
        : !safeExtractedData.adls
          ? 'What kinds of daily support would be helpful?'
          : !safeExtractedData.timeline
            ? 'When are you hoping to find care?'
            : !safeExtractedData.budget
              ? 'What monthly budget range are you planning for?'
              : !safeExtractedData.name
                ? 'What is your name?'
                : !safeExtractedData.phone
                  ? 'What phone number is best for our care team to reach you?'
                  : typeof safeExtractedData.interestedInMoving !== 'boolean'
                    ? 'Would you like help with local senior moving, downsizing, or transition services?'
                    : response.data.replyText;
    const movingServicesNotice = 'In addition to senior living placement, NextHaven also assists families with local senior moving, downsizing, and transition services.';
    const movingServicesAlreadyMentioned = parsed.data.messageHistory.some(
      message => message.sender === 'bot' && message.text.includes(movingServicesNotice),
    );
    const needsMovingServicesAnswer = hasCompleteCareDetails && typeof extractedData.interestedInMoving !== 'boolean';

    return NextResponse.json({
      ...response.data,
      suggestedReplies: response.data.suggestedReplies.slice(0, 4),
      ...(mustAskForZip ? {
        replyText: 'Before we discuss contact details, could you share your five-digit ZIP code?',
        suggestedReplies: [],
      } : {}),
      ...(outOfAreaZip ? {
        replyText: `${outOfAreaNotice} ${asksForSpokaneZip ? outOfAreaFollowUp : response.data.replyText}`,
      } : {}),
      ...(needsMovingServicesAnswer ? {
        replyText: `${movingServicesNotice} Would you like help with those services too?`,
        suggestedReplies: ['Yes, please', 'No, thanks'],
      } : {}),
      ...(hasCompleteCareDetails
        && typeof extractedData.interestedInMoving === 'boolean'
        && !movingServicesAlreadyMentioned ? {
        replyText: `${response.data.replyText} ${movingServicesNotice}`,
      } : {}),
      extractedData: safeExtractedData,
      isComplete: !mustAskForZip && hasCompleteCareDetails && typeof safeExtractedData.interestedInMoving === 'boolean',
      zipCorrectionRequired: false,
    });
  } catch (error) {
    console.error('Care chat provider request failed:', {
      status: getHttpStatus(error),
      transient: isTransientError(error),
    });
    return NextResponse.json(
      { error: 'The chat service is temporarily unavailable. Please try again.' },
      { status: 502 },
    );
  }
}
