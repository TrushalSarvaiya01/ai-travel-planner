import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from '@google/generative-ai';

const MODEL_NAME = 'gemini-3.5-flash';
const MAX_RETRIES = 3;

const tripPlannerSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    tripTitle: { type: SchemaType.STRING },
    destination: { type: SchemaType.STRING },
    summary: { type: SchemaType.STRING },
    dailyItinerary: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.INTEGER },
          title: { type: SchemaType.STRING },
          morning: { type: SchemaType.STRING },
          afternoon: { type: SchemaType.STRING },
          evening: { type: SchemaType.STRING },
          dinner: { type: SchemaType.STRING },
        },
        required: ['day', 'title', 'morning', 'afternoon', 'evening', 'dinner'],
      },
    },
    budgetBreakdown: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          category: { type: SchemaType.STRING },
          estimate: { type: SchemaType.NUMBER },
          note: { type: SchemaType.STRING },
        },
        required: ['category', 'estimate', 'note'],
      },
    },
    packingChecklist: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    smartTips: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    recommendedTransport: { type: SchemaType.STRING },
  },
  required: [
    'tripTitle',
    'destination',
    'summary',
    'dailyItinerary',
    'budgetBreakdown',
    'packingChecklist',
    'smartTips',
    'recommendedTransport',
  ],
};

export interface TripPlannerInput {
  origin: string;
  destination: string;
  travelStyle: 'Relaxed' | 'Balanced' | 'Fast-paced';
  travelers: number;
  durationDays: number;
  budget: number;
  month: string;
  interests: string;
}

export interface TripItineraryDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  dinner: string;
}

export interface TripBudgetLine {
  category: string;
  estimate: number;
  note: string;
}

export interface TripPlannerResult {
  tripTitle: string;
  destination: string;
  summary: string;
  dailyItinerary: TripItineraryDay[];
  budgetBreakdown: TripBudgetLine[];
  packingChecklist: string[];
  smartTips: string[];
  recommendedTransport: string;
}

export interface TripPlannerValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTripPlannerInput(input: TripPlannerInput): TripPlannerValidationResult {
  const errors: string[] = [];

  if (!input.origin.trim()) {
    errors.push('Please enter your departure city.');
  }

  if (input.destination.trim().length < 2) {
    errors.push('Destination must be at least 2 characters long.');
  }

  if (!Number.isFinite(input.durationDays) || input.durationDays < 1 || input.durationDays > 14) {
    errors.push('Trip duration must be between 1 and 14 days.');
  }

  if (!Number.isFinite(input.travelers) || input.travelers < 1 || input.travelers > 9) {
    errors.push('Traveler count must be between 1 and 9.');
  }

  if (!Number.isFinite(input.budget) || input.budget <= 0) {
    errors.push('Budget must be greater than 0.');
  }

  if (input.interests.trim().length < 3) {
    errors.push('Please share at least one travel interest.');
  }

  if (!input.month.trim()) {
    errors.push('Please select a travel month.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function generateTripItinerary(input: TripPlannerInput): Promise<TripPlannerResult> {
  const validation = validateTripPlannerInput(input);
  if (!validation.valid) {
    throw new Error(validation.errors[0] ?? 'Invalid travel plan input.');
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    throw new Error('Gemini API key is missing. Add VITE_GEMINI_API_KEY to your .env file.');
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await requestTripItinerary(apiKey, input);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES && isRetryable(error)) {
        await sleep(400 * attempt * attempt);
        continue;
      }
      break;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error('Unable to generate itinerary right now. Please try again.');
}

async function requestTripItinerary(apiKey: string, input: TripPlannerInput): Promise<TripPlannerResult> {
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
      responseSchema: tripPlannerSchema,
    },
  });

  const prompt = buildPrompt(input);
  const response = await model.generateContent(prompt);
  const text = response.response.text();
  const parsed = parseJsonResponse(text);

  return normalizeResult(parsed, input);
}

function buildPrompt(input: TripPlannerInput): string {
  return [
    'You are a world-class travel planning assistant for a premium AI startup landing page.',
    'Generate a concise but detailed travel plan in valid JSON only. Do not include markdown, code fences, or commentary.',
    'Return plain JSON with double quotes, no trailing commas, and no extra explanation text.',
    'Return exactly this structure:',
    '{',
    '  "tripTitle": string,',
    '  "destination": string,',
    '  "summary": string,',
    '  "dailyItinerary": [{ "day": number, "title": string, "morning": string, "afternoon": string, "evening": string, "dinner": string }],',
    '  "budgetBreakdown": [{ "category": string, "estimate": number, "note": string }],',
    '  "packingChecklist": string[],',
    '  "smartTips": string[],',
    '  "recommendedTransport": string',
    '}',
    '',
    `Trip details:`,
    `- Origin: ${input.origin}`,
    `- Destination: ${input.destination}`,
    `- Month: ${input.month}`,
    `- Trip style: ${input.travelStyle}`,
    `- Travelers: ${input.travelers}`,
    `- Duration: ${input.durationDays} day(s)`,
    `- Budget: ${input.budget}`,
    `- Interests: ${input.interests}`,
    '',
    'Make the plan realistic, premium, and specific. Focus on practical travel flow, budget awareness, and destination-appropriate activities.',
    `Create exactly ${input.durationDays} itinerary days.`,
  ].join('\n');
}

function parseJsonResponse(text: string): unknown {
  const sanitizedText = sanitizeJsonText(text);
  const candidates = [sanitizedText, extractBalancedJson(sanitizedText)].filter(
    (value): value is string => Boolean(value),
  );

  const uniqueCandidates = Array.from(new Set(candidates));

  for (const candidate of uniqueCandidates) {
    for (const variant of [candidate, repairJsonText(candidate)]) {
      if (!variant || (variant === candidate && !variant.trim())) {
        continue;
      }

      try {
        return JSON.parse(variant);
      } catch {
        // Try the next repair or candidate.
      }
    }
  }

  return {};
}

function sanitizeJsonText(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

function extractBalancedJson(text: string): string | null {
  const startTokens = ['{', '['];

  for (const startToken of startTokens) {
    const startIndex = text.indexOf(startToken);
    if (startIndex === -1) {
      continue;
    }

    const endToken = startToken === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let index = startIndex; index < text.length; index += 1) {
      const current = text[index];

      if (inString) {
        if (escaped) {
          escaped = false;
        } else if (current === '\\') {
          escaped = true;
        } else if (current === '"') {
          inString = false;
        }
        continue;
      }

      if (current === '"') {
        inString = true;
      } else if (current === startToken) {
        depth += 1;
      } else if (current === endToken) {
        depth -= 1;
        if (depth === 0) {
          return text.slice(startIndex, index + 1);
        }
      }
    }
  }

  return null;
}

function repairJsonText(text: string): string {
  let repaired = text.trim();

  if (!repaired) {
    return repaired;
  }

  repaired = repaired.replace(/,\s*([}\]])/g, '$1');
  repaired = repaired.replace(/([}\]])\s+([\[{"\-\dA-Za-z])/g, '$1, $2');
  repaired = repaired.replace(/([\d"\}\]])\s+([\[{"\-\dA-Za-z])/g, '$1, $2');

  return repaired;
}

function extractMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Please try again.';
}

function normalizeResult(raw: any, input: TripPlannerInput): TripPlannerResult {
  const durationDays = input.durationDays;
  const itinerarySource = Array.isArray(raw?.dailyItinerary) ? raw.dailyItinerary : [];
  const budgetSource = Array.isArray(raw?.budgetBreakdown) ? raw.budgetBreakdown : [];
  const packingSource = Array.isArray(raw?.packingChecklist) ? raw.packingChecklist : [];
  const tipsSource = Array.isArray(raw?.smartTips) ? raw.smartTips : [];

  const dailyItinerary = Array.from({ length: durationDays }, (_, index) => {
    const day = itinerarySource[index] ?? {};
    return {
      day: index + 1,
      title: String(day.title ?? `Day ${index + 1}`),
      morning: String(day.morning ?? 'Morning exploration and local breakfast.'),
      afternoon: String(day.afternoon ?? 'Afternoon sightseeing and curated experiences.'),
      evening: String(day.evening ?? 'Evening leisure, sunset views, or cultural activities.'),
      dinner: String(day.dinner ?? 'Dinner at a destination-recommended restaurant.'),
    } satisfies TripItineraryDay;
  });

  const budgetBreakdown = budgetSource.slice(0, 6).map((item: any, index: number) => ({
    category: String(item.category ?? `Budget item ${index + 1}`),
    estimate: Number(item.estimate ?? 0),
    note: String(item.note ?? 'Estimated travel expense.'),
  }));

  return {
    tripTitle: String(raw?.tripTitle ?? `${input.destination} Smart Trip Plan`),
    destination: String(raw?.destination ?? input.destination),
    summary: String(raw?.summary ?? 'A personalized itinerary generated with Gemini.'),
    dailyItinerary,
    budgetBreakdown,
    packingChecklist: packingSource.slice(0, 8).map((item: any) => String(item)),
    smartTips: tipsSource.slice(0, 5).map((item: any) => String(item)),
    recommendedTransport: String(raw?.recommendedTransport ?? 'Best-fit transport options based on time, comfort, and budget.'),
  };
}

function isRetryable(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return true;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('fetch') ||
    message.includes('429') ||
    message.includes('503') ||
    message.includes('502') ||
    message.includes('500') ||
    message.includes('invalid itinerary response') ||
    message.includes('malformed') ||
    message.includes('json')
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
