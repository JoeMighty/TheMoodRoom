import { db } from "./firebase-config.js";
import { collection, onSnapshot, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DOM Elements
const projectionScreen = document.getElementById("projectionScreen");

// Map to track active thought bubble elements (key: docId, value: DOMElement)
const activeBubbles = new Map();

// Map to track which slots are occupied (key: docId, value: slotIndex)
const occupiedSlots = new Map();

// 15 Jittered Grid slots to distribute bubbles evenly and avoid overlapping
const SLOTS = [
  { x: 8,  y: 18 }, { x: 26, y: 18 }, { x: 44, y: 18 }, { x: 62, y: 18 }, { x: 80, y: 18 },
  { x: 8,  y: 46 }, { x: 26, y: 46 }, { x: 44, y: 46 }, { x: 62, y: 46 }, { x: 80, y: 46 },
  { x: 8,  y: 72 }, { x: 26, y: 72 }, { x: 44, y: 72 }, { x: 62, y: 72 }, { x: 80, y: 72 }
];

/**
 * Finds an available slot index from the SLOTS array.
 * If all slots are full, returns a random slot index.
 */
function claimSlot(docId) {
  const activeIndices = new Set(occupiedSlots.values());
  const freeIndices = [];

  for (let i = 0; i < SLOTS.length; i++) {
    if (!activeIndices.has(i)) {
      freeIndices.push(i);
    }
  }

  let chosenIndex;
  if (freeIndices.length > 0) {
    // Pick a random free slot
    const randomIndex = Math.floor(Math.random() * freeIndices.length);
    chosenIndex = freeIndices[randomIndex];
  } else {
    // Fallback: pick any slot if full
    chosenIndex = Math.floor(Math.random() * SLOTS.length);
  }

  occupiedSlots.set(docId, chosenIndex);
  return chosenIndex;
}

/**
 * Creates and inserts a thought bubble element into the DOM.
 */
function createBubble(docId, data) {
  // Create elements
  const bubble = document.createElement("div");
  bubble.className = `thought-bubble emotion-${data.emotion || 'calm'}`;
  bubble.id = `bubble-${docId}`;

  // Content text
  const textDiv = document.createElement("div");
  textDiv.className = "bubble-text";
  textDiv.textContent = data.text;
  bubble.appendChild(textDiv);

  // Meta row (Author + Emoji)
  const metaDiv = document.createElement("div");
  metaDiv.className = "bubble-meta";

  // Author sub-container
  const authorDiv = document.createElement("div");
  authorDiv.className = "bubble-author";
  
  if (data.initial) {
    const initialSpan = document.createElement("span");
    initialSpan.className = "author-initial";
    initialSpan.textContent = data.initial;
    authorDiv.appendChild(initialSpan);

    const labelSpan = document.createElement("span");
    labelSpan.textContent = "shared";
    authorDiv.appendChild(labelSpan);
  } else {
    const labelSpan = document.createElement("span");
    labelSpan.textContent = "anonymous";
    authorDiv.appendChild(labelSpan);
  }
  metaDiv.appendChild(authorDiv);

  // Emoji icon
  const emojiSpan = document.createElement("span");
  emojiSpan.className = "bubble-emoji";
  emojiSpan.textContent = data.emoji || "😌";
  metaDiv.appendChild(emojiSpan);

  bubble.appendChild(metaDiv);

  // Positioning logic via claimSlot
  const slotIndex = claimSlot(docId);
  const slotCoord = SLOTS[slotIndex];

  // Add small random jitter within the slot boundary to make it look natural
  const jitterX = (Math.random() * 8) - 4; // -4% to +4%
  const jitterY = (Math.random() * 6) - 3; // -3% to +3%
  
  const finalX = slotCoord.x + jitterX;
  const finalY = slotCoord.y + jitterY;

  bubble.style.left = `${finalX}%`;
  bubble.style.top = `${finalY}%`;

  // Stagger the animations so they float out of sync:
  // 1st delay: 0s for the pop-in entrance animation.
  // 2nd delay: random negative offset so the sway animation starts mid-loop.
  const randomSwayOffset = -(Math.random() * 8).toFixed(2);
  bubble.style.animationDelay = `0s, ${randomSwayOffset}s`;

  // Inject into screen container
  projectionScreen.appendChild(bubble);
  activeBubbles.set(docId, bubble);
}

/**
 * Initiates the fade out exit animation and removes the bubble element.
 */
function removeBubble(docId) {
  const bubble = activeBubbles.get(docId);
  if (bubble) {
    // Add fade-out transition class
    bubble.classList.add("fade-out");
    
    // Remove element from DOM after the transition completes (800ms)
    setTimeout(() => {
      bubble.remove();
    }, 800);

    activeBubbles.delete(docId);
  }
  
  // Free up the grid slot
  occupiedSlots.delete(docId);
}

// ==========================================
// FIRESTORE SYNC LISTENERS
// ==========================================

// Setup real-time query: Limit to 15 newest documents, ordered by timestamp descending
const thoughtsCollection = collection(db, "exhibitThoughts");
const q = query(thoughtsCollection, orderBy("timestamp", "desc"), limit(15));

// Subscribe to database changes
onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const docId = change.doc.id;
    const data = change.doc.data();

    if (change.type === "added") {
      // If doc is already in view, skip (to avoid double rendering)
      if (!activeBubbles.has(docId)) {
        createBubble(docId, data);
      }
    } else if (change.type === "modified") {
      // Update bubble if database parameters change (rare but supported)
      const bubble = activeBubbles.get(docId);
      if (bubble) {
        const textElement = bubble.querySelector(".bubble-text");
        if (textElement) textElement.textContent = data.text;
        
        const emojiElement = bubble.querySelector(".bubble-emoji");
        if (emojiElement) emojiElement.textContent = data.emoji;
      }
    } else if (change.type === "removed") {
      // Trigger smooth fade-out and delete element
      removeBubble(docId);
    }
  });
}, (error) => {
  console.error("Firestore listening failed:", error);
});
