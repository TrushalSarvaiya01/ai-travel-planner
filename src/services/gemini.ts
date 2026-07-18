import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from '@google/generative-ai';

const MODEL_NAME = 'gemini-3.5-flash';
const MAX_RETRIES = 3;

const PLACEHOLDER_MORNING = 'Morning exploration and local breakfast.';
const PLACEHOLDER_AFTERNOON = 'Afternoon sightseeing and curated experiences.';
const PLACEHOLDER_EVENING = 'Evening leisure, sunset views, or cultural activities.';
const PLACEHOLDER_DINNER = 'Dinner at a destination-recommended restaurant.';

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
    return buildLocalFallbackTripItinerary(input);
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      return await requestTripItinerary(apiKey, input);
    } catch (error) {
      const normalizedError = normalizeGeminiError(error);
      if (shouldUseLocalFallback(normalizedError)) {
        return buildLocalFallbackTripItinerary(input);
      }

      lastError = normalizedError;
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
      temperature: 0.85,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: tripPlannerSchema,
    },
  });

  const prompt = buildPrompt(input);
  const response = await model.generateContent(prompt);
  const text = response.response.text();

  if (!text?.trim()) {
    throw new Error('Received an empty itinerary response from Gemini. Please try again.');
  }

  const parsed = parseJsonResponse(text);
  return normalizeResult(parsed, input);
}

function buildLocalFallbackTripItinerary(input: TripPlannerInput): TripPlannerResult {
  const durationDays = Math.max(1, Math.min(14, input.durationDays));
  const destination = input.destination.trim() || 'your destination';
  const destinationName = destination.split(/,|\//).map((part) => part.trim()).filter(Boolean)[0] || destination;
  const interests = input.interests.trim() || 'local culture';
  const baseBudget = Math.max(input.budget, 1200);
  const dayThemes = [
    'Historic heart',
    'Neighborhood food crawl',
    'Scenic nature day',
    'Local markets and artisan stops',
    'Sunset viewpoints and nightlife',
    'Relaxed spa and wellness day',
    'Design and architecture day',
    'Coastal adventure day',
  ];
  const placeNames = [
    `${destinationName} Old Town`,
    `${destinationName} Riverside Market`,
    `${destinationName} Hillside Lookout`,
    `${destinationName} Artisan Quarter`,
    `${destinationName} Harbor Promenade`,
    `${destinationName} Museum Lane`,
    `${destinationName} Garden District`,
    `${destinationName} Night Market`,
    `${destinationName} Coastal Walk`,
    `${destinationName} Heritage Avenue`,
    `${destinationName} Café Terrace`,
    `${destinationName} Wellness Spa`,
    `${destinationName} Botanical Gardens`,
    `${destinationName} Skyline Plaza`,
  ];
  const activityNames = [
    'heritage trail',
    'food tasting route',
    'nature reserve loop',
    'artisan studio visit',
    'sunset terrace stop',
    'museum and gallery circuit',
    'garden and tea house stroll',
    'night market discovery',
    'coastal lookout walk',
    'architecture discovery walk',
    'coffee and pastry stop',
    'wellness ritual session',
    'botanical garden exploration',
    'city skyline experience',
  ];

  const dailyItinerary = Array.from({ length: durationDays }, (_, index) => {
    const theme = dayThemes[index % dayThemes.length];
    const placeName = placeNames[index % placeNames.length];
    const activityName = activityNames[index % activityNames.length];
    const dayNumber = index + 1;
    const morning = `Start with breakfast near ${placeName}, then follow a ${activityName} focused on ${interests} and a calm ${input.travelStyle.toLowerCase()} pace.`;
    const afternoon = `Spend the afternoon exploring ${placeName} and nearby highlights that fit your pace, with time for a relaxed coffee or local shopping break.`;
    const evening = `Wind down with a scenic evening stop around ${placeName}, keeping the schedule easy and enjoyable.`;
    const dinner = `Finish the day with dinner at a well-regarded restaurant close to ${placeName}.`;

    return {
      day: dayNumber,
      title: `${theme} · ${placeName}`,
      morning,
      afternoon,
      evening,
      dinner,
    } satisfies TripItineraryDay;
  });

  return {
    tripTitle: `${destination} Smart Escape`,
    destination,
    summary: `A practical ${durationDays}-day plan for ${destination} from ${input.origin}, shaped around ${interests} and a ${input.travelStyle.toLowerCase()} pace.`,
    dailyItinerary,
    budgetBreakdown: [
      {
        category: 'Stay',
        estimate: Math.round(baseBudget * 0.4),
        note: 'Comfortable boutique or mid-range lodging for the trip duration.',
      },
      {
        category: 'Food',
        estimate: Math.round(baseBudget * 0.25),
        note: 'Casual dining, coffee breaks, and one or two nicer meals.',
      },
      {
        category: 'Activities',
        estimate: Math.round(baseBudget * 0.2),
        note: 'Entry tickets, guided experiences, and local excursions.',
      },
      {
        category: 'Transport',
        estimate: Math.round(baseBudget * 0.15),
        note: 'Local transit, rideshares, and airport transfers.',
      },
    ],
    packingChecklist: [
      'Comfortable walking shoes',
      'Layered clothing for changing weather',
      'Phone charger and power bank',
      'Travel documents and booking confirmations',
      'Sunscreen and sunglasses',
      'Small day bag or crossbody',
    ],
    smartTips: [
      'Book popular attractions in advance when possible.',
      'Keep a little buffer in your budget for taxis or last-minute plans.',
      'Use local transit early in the day to avoid crowds.',
      'Carry a reusable water bottle and light snacks for long sightseeing days.',
    ],
    recommendedTransport: input.budget >= 3000 ? 'Private transfers mixed with comfortable public transit.' : 'Public transit paired with short rides for convenience.',
  };
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
    `Create exactly ${input.durationDays} itinerary days in dailyItinerary.`,
    'CRITICAL uniqueness rules:',
    `- Every day MUST be completely different: unique title, unique morning, unique afternoon, unique evening, and unique dinner.`,
    '- Name real places, neighborhoods, landmarks, experiences, and restaurants specific to the destination.',
    '- Do NOT reuse the same activity, restaurant, or generic wording across days.',
    '- Do NOT use vague filler like "local breakfast", "sightseeing", "leisure", or "destination-recommended restaurant".',
    '- Each day title should highlight a distinct theme or area (for example: historic district, food crawl, nature day, nightlife).',
    '- Keep each field to 1-2 specific sentences so the full JSON fits comfortably.',
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

  throw new Error('Malformed JSON itinerary response from Gemini. Please try again.');
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

function normalizeResult(raw: any, input: TripPlannerInput): TripPlannerResult {
  const durationDays = input.durationDays;
  const itinerarySource = Array.isArray(raw?.dailyItinerary) ? raw.dailyItinerary : [];
  const budgetSource = Array.isArray(raw?.budgetBreakdown) ? raw.budgetBreakdown : [];
  const packingSource = Array.isArray(raw?.packingChecklist) ? raw.packingChecklist : [];
  const tipsSource = Array.isArray(raw?.smartTips) ? raw.smartTips : [];

  if (itinerarySource.length < durationDays) {
    throw new Error(
      `Incomplete itinerary: expected ${durationDays} days but received ${itinerarySource.length}. Please try again.`,
    );
  }

  const dailyItinerary = Array.from({ length: durationDays }, (_, index) => {
    const day = itinerarySource[index];
    if (!day || typeof day !== 'object') {
      throw new Error(`Missing itinerary details for day ${index + 1}. Please try again.`);
    }

    const title = String(day.title ?? '').trim();
    const morning = String(day.morning ?? '').trim();
    const afternoon = String(day.afternoon ?? '').trim();
    const evening = String(day.evening ?? '').trim();
    const dinner = String(day.dinner ?? '').trim();

    if (!title || !morning || !afternoon || !evening || !dinner) {
      throw new Error(`Incomplete itinerary details for day ${index + 1}. Please try again.`);
    }

    if (isGenericPlaceholderDay({ title, morning, afternoon, evening, dinner })) {
      throw new Error(`Generic placeholder content detected for day ${index + 1}. Please try again.`);
    }

    return {
      day: index + 1,
      title,
      morning,
      afternoon,
      evening,
      dinner,
    } satisfies TripItineraryDay;
  });

  assertUniqueDailyItinerary(dailyItinerary);

  const budgetBreakdown = budgetSource.slice(0, 6).map((item: any, index: number) => ({
    category: String(item.category ?? `Budget item ${index + 1}`),
    estimate: Number(item.estimate ?? 0),
    note: String(item.note ?? 'Estimated travel expense.'),
  }));

  if (budgetBreakdown.length === 0) {
    throw new Error('Missing budget breakdown in itinerary response. Please try again.');
  }

  const packingChecklist = packingSource
    .slice(0, 8)
    .map((item: any) => String(item).trim())
    .filter(Boolean);

  const smartTips = tipsSource
    .slice(0, 5)
    .map((item: any) => String(item).trim())
    .filter(Boolean);

  if (packingChecklist.length === 0 || smartTips.length === 0) {
    throw new Error('Incomplete packing checklist or smart tips in itinerary response. Please try again.');
  }

  return {
    tripTitle: String(raw?.tripTitle ?? `${input.destination} Smart Trip Plan`).trim(),
    destination: String(raw?.destination ?? input.destination).trim(),
    summary: String(raw?.summary ?? '').trim() || `A personalized ${durationDays}-day plan for ${input.destination}.`,
    dailyItinerary,
    budgetBreakdown,
    packingChecklist,
    smartTips,
    recommendedTransport: String(raw?.recommendedTransport ?? '').trim() || 'Public transit mixed with short rides for convenience.',
  };
}

function isGenericPlaceholderDay(day: Omit<TripItineraryDay, 'day'>): boolean {
  const normalized = {
    morning: day.morning.toLowerCase(),
    afternoon: day.afternoon.toLowerCase(),
    evening: day.evening.toLowerCase(),
    dinner: day.dinner.toLowerCase(),
  };

  return (
    normalized.morning === PLACEHOLDER_MORNING.toLowerCase() ||
    normalized.afternoon === PLACEHOLDER_AFTERNOON.toLowerCase() ||
    normalized.evening === PLACEHOLDER_EVENING.toLowerCase() ||
    normalized.dinner === PLACEHOLDER_DINNER.toLowerCase()
  );
}

function assertUniqueDailyItinerary(days: TripItineraryDay[]) {
  if (days.length <= 1) {
    return;
  }

  const signatures = days.map((day) =>
    [day.title, day.morning, day.afternoon, day.evening, day.dinner]
      .map((value) => value.toLowerCase().replace(/\s+/g, ' ').trim())
      .join('||'),
  );

  const uniqueSignatures = new Set(signatures);
  if (uniqueSignatures.size !== days.length) {
    throw new Error('Itinerary days were too similar. Regenerating for more variety.');
  }

  const fieldSets = {
    titles: new Set(days.map((day) => day.title.toLowerCase().trim())),
    mornings: new Set(days.map((day) => day.morning.toLowerCase().trim())),
    afternoons: new Set(days.map((day) => day.afternoon.toLowerCase().trim())),
    evenings: new Set(days.map((day) => day.evening.toLowerCase().trim())),
    dinners: new Set(days.map((day) => day.dinner.toLowerCase().trim())),
  };

  if (
    fieldSets.titles.size < days.length ||
    fieldSets.mornings.size < days.length ||
    fieldSets.afternoons.size < days.length ||
    fieldSets.evenings.size < days.length ||
    fieldSets.dinners.size < days.length
  ) {
    throw new Error('Itinerary days reused the same activities. Regenerating for more variety.');
  }
}

function normalizeGeminiError(error: unknown): Error {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (
      message.includes('quota exceeded') ||
      message.includes('exceeded your current quota') ||
      message.includes('quota failure') ||
      message.includes('free tier') ||
      message.includes('rate limit')
    ) {
      const retrySeconds = extractRetrySeconds(error.message);
      const waitText = retrySeconds ? ` Please wait about ${retrySeconds} seconds and try again.` : ' Please wait a bit and try again later.';
      return new Error(
        `Gemini API quota was exceeded.${waitText} If you just changed your API key, restart the dev server so Vite reloads the new .env value. If you have a paid plan or a different API key tied to a different project, switch to that and try again.`,
      );
    }

    if (message.includes('api key')) {
      return new Error('Gemini API key is missing or invalid. Add a valid VITE_GEMINI_API_KEY to your .env file.');
    }

    return error;
  }

  return new Error('Unable to generate itinerary right now. Please try again.');
}

function extractRetrySeconds(message: string): number | null {
  const patterns = [
    /retry(?:delay)?["']?\s*[:=]\s*["']?(\d+)\s*s/i,
    /retry in (\d+)\s*s/i,
    /retry in (\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return null;
}

function shouldUseLocalFallback(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('quota exceeded') ||
    message.includes('exceeded your current quota') ||
    message.includes('quota failure') ||
    message.includes('free tier') ||
    message.includes('rate limit') ||
    message.includes('api key') ||
    message.includes('missing or invalid') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('fetch') ||
    message.includes('503') ||
    message.includes('502') ||
    message.includes('500')
  );
}

function isRetryable(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return true;
  }

  const message = error.message.toLowerCase();
  if (
    message.includes('quota exceeded') ||
    message.includes('exceeded your current quota') ||
    message.includes('quota failure') ||
    message.includes('free tier') ||
    message.includes('rate limit')
  ) {
    return false;
  }

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
    message.includes('json') ||
    message.includes('incomplete') ||
    message.includes('missing') ||
    message.includes('generic placeholder') ||
    message.includes('too similar') ||
    message.includes('reused the same') ||
    message.includes('empty itinerary')
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
