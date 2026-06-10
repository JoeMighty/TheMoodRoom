/**
 * Content Moderation Layer for The Mood Room
 * Includes a local fast-path blocklist and an API check via PurgoMalum.
 */

// A basic list of offensive words to catch common profanities instantly.
// In a production app, this list can be expanded.
const LOCAL_BLOCKLIST = [
  "abuse", "asshole", "bitch", "bastard", "crap", "cunt", "dick", "dyke", 
  "faggot", "fuck", "nigger", "piss", "prick", "pussy", "shit", "slut", 
  "twat", "whore"
];

// Helper to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Compile the local regex once for performance
const blocklistPattern = new RegExp(
  `\\b(${LOCAL_BLOCKLIST.map(escapeRegExp).join('|')})\\b`, 
  'i'
);

/**
 * Checks if a given text contains profanity using both a local blocklist
 * and the PurgoMalum API.
 * 
 * @param {string} text - The input thought text to moderate.
 * @returns {Promise<boolean>} - Resolves to true if profanity is detected, false otherwise.
 */
export async function containsProfanity(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }

  // 1. Fast path: Local blocklist check
  const trimmedText = text.trim();
  if (blocklistPattern.test(trimmedText)) {
    console.warn("Moderation: Blocked by local list ->", text);
    return true;
  }

  // 2. Slow path: PurgoMalum keyless REST API check
  try {
    const url = `https://www.purgomalum.com/service/containsprofanity?text=${encodeURIComponent(trimmedText)}`;
    
    // Set a timeout for the API call to ensure mobile submission doesn't hang indefinitely
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resultText = await response.text();
    // The endpoint returns raw text 'true' or 'false'
    const isProfane = resultText.trim() === 'true';
    
    if (isProfane) {
      console.warn("Moderation: Blocked by PurgoMalum API ->", text);
    }
    
    return isProfane;
  } catch (error) {
    // If the external service is down or timed out, we fall back to allowing the post
    // (fail-open) to maintain a smooth user experience, relying on our local blocklist.
    console.error("Moderation API failed, falling back to local check only:", error);
    return false;
  }
}
