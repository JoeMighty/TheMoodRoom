import { db } from "./firebase-config.js";
import { containsProfanity } from "./moderation.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// DOM Elements
const thoughtInput = document.getElementById("thoughtInput");
const nameInput = document.getElementById("nameInput");
const emojiGrid = document.getElementById("emojiGrid");
const submitBtn = document.getElementById("submitBtn");
const errorToast = document.getElementById("errorToast");
const formSection = document.getElementById("formSection");
const successSection = document.getElementById("successSection");
const resetBtn = document.getElementById("resetBtn");
const charCounter = document.getElementById("charCounter");
const emojiBtns = emojiGrid.querySelectorAll(".emoji-btn");

// App State
let selectedEmotion = null;
let selectedEmoji = null;

// ==========================================
// FORM STATE VALIDATION
// ==========================================
function updateFormValidity() {
  const isThoughtValid = thoughtInput.value.trim().length > 0;
  const isEmojiSelected = selectedEmotion !== null;
  
  // Enable button only if thought and emotion are present
  submitBtn.disabled = !(isThoughtValid && isEmojiSelected);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Emoji Selection Logic
emojiBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Clear previous selection
    emojiBtns.forEach(b => b.classList.remove("selected"));
    
    // Set new selection
    btn.classList.add("selected");
    selectedEmotion = btn.dataset.emotion;
    selectedEmoji = btn.dataset.emoji;
    
    // Clear any active errors
    hideError();
    updateFormValidity();
  });
});

// Character Counter and Input Tracking
thoughtInput.addEventListener("input", () => {
  const currentLength = thoughtInput.value.length;
  charCounter.textContent = `${currentLength} / 100`;
  
  if (currentLength >= 80) {
    charCounter.classList.add("limit-near");
  } else {
    charCounter.classList.remove("limit-near");
  }
  
  hideError();
  updateFormValidity();
});

nameInput.addEventListener("input", () => {
  hideError();
});

// Submit Form Handler
document.getElementById("submissionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const text = thoughtInput.value.trim();
  const name = nameInput.value.trim();
  
  if (!text || !selectedEmotion || !selectedEmoji) {
    showError("Please complete your thought and select an emotion.");
    return;
  }
  
  // Set UI to loading state
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  hideError();
  
  try {
    // 1. Run Moderation checks (Local blocklist + API check)
    const isProfane = await containsProfanity(text);
    
    if (isProfane) {
      showError("We want to keep this space respectful. Please adjust your words.");
      resetSubmitButtonState();
      return;
    }
    
    // 2. Format name to initial (if provided)
    let initial = "";
    if (name) {
      initial = name.charAt(0).toUpperCase();
    }
    
    // 3. Construct Firestore Document
    const thoughtDoc = {
      initial: initial,
      text: text,
      emoji: selectedEmoji,
      emotion: selectedEmotion, // Stored to map CSS styles directly on projection
      timestamp: serverTimestamp()
    };
    
    // 4. Save to Firestore collection "exhibitThoughts"
    const collectionRef = collection(db, "exhibitThoughts");
    await addDoc(collectionRef, thoughtDoc);
    
    // 5. Show Success Screen
    showSuccess();
    
  } catch (error) {
    console.error("Firestore submission failed:", error);
    // User friendly error instructions
    showError("Failed to beam your thought. Please check your connection and try again.");
    resetSubmitButtonState();
  }
});

// Reset Form Logic (Beam another thought)
resetBtn.addEventListener("click", () => {
  // Clear inputs
  thoughtInput.value = "";
  nameInput.value = "";
  charCounter.textContent = "0 / 100";
  charCounter.classList.remove("limit-near");
  
  // Reset selected emotion
  selectedEmotion = null;
  selectedEmoji = null;
  emojiBtns.forEach(b => b.classList.remove("selected"));
  
  // Reset submit button state
  resetSubmitButtonState();
  updateFormValidity();
  
  // Switch view back to form
  successSection.style.display = "none";
  formSection.style.display = "block";
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================
function showError(msg) {
  errorToast.textContent = msg;
  errorToast.style.display = "block";
  // Smooth scroll to error if off-screen
  errorToast.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideError() {
  errorToast.style.display = "none";
}

function resetSubmitButtonState() {
  submitBtn.disabled = false;
  submitBtn.classList.remove("loading");
}

function showSuccess() {
  formSection.style.display = "none";
  successSection.style.display = "flex";
}
