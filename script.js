// ============================================
// REWRITE ME: AN EDITABLE STORY
// Main JavaScript Application
// ============================================

// ============================================
// ORIGINAL STORY TEXT
// ============================================
const ORIGINAL_STORY = `I still remember that morning.
You said it was only the wind moving the curtain,
but I think it was the moment everything changed.
We packed our words into careful boxes.
Maybe love is just a rearrangement of sentences,
or maybe it is what stays when everything else is rewritten.`;

// ============================================
// KEYWORD LEXICONS FOR MOOD DETECTION
// ============================================
const LEXICONS = {
    WARM: ["love", "stay", "home", "tender", "soft", "blanket", "warm", "together"],
    COLD: ["fear", "leave", "gone", "alone", "silent", "ice", "cold", "distant"],
    BLOOM: ["hope", "begin", "light", "morning", "seed", "bloom", "open", "again"],
    STORM: ["anger", "break", "never", "shout", "storm", "fire", "burn", "hurt"],
    VOID: ["forget", "empty", "quiet", "hollow", "nothing", "erase", "missing", "lost"]
};

// Mood priority for tie-breaking (higher index = higher priority)
const MOOD_PRIORITY = ["VOID", "STORM", "COLD", "BLOOM", "WARM"];

// ============================================
// AUDIO SOURCES (Placeholder URLs)
// ============================================
const AUDIO_SOURCES = {
    warm: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
    cold: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
    bloom: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
    storm: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
    void: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=",
    neutral: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
};

// ============================================
// APPLICATION STATE
// ============================================
const state = {
    previousTokens: [],
    totalAdded: 0,
    totalRemoved: 0,
    editLog: [],
    currentMood: "NEUTRAL",
    soundEnabled: false,
    audioElements: {}
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    introPanel: null,
    editorPanel: null,
    endingPanel: null,
    startBtn: null,
    storyEditor: null,
    moodBadge: null,
    soundToggle: null,
    resetBtn: null,
    generateEndingBtn: null,
    editLog: null,
    statAdded: null,
    statRemoved: null,
    statUnique: null,
    endingSummary: null,
    endingText: null,
    configMood: null,
    configWords: null,
    configStats: null,
    copyTextBtn: null,
    downloadJsonBtn: null,
    editAgainBtn: null,
    toast: null
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    // Cache DOM elements
    elements.introPanel = document.getElementById('intro-panel');
    elements.editorPanel = document.getElementById('editor-panel');
    elements.endingPanel = document.getElementById('ending-panel');
    elements.startBtn = document.getElementById('start-btn');
    elements.storyEditor = document.getElementById('story');
    elements.moodBadge = document.getElementById('mood-badge');
    elements.soundToggle = document.getElementById('sound-toggle');
    elements.resetBtn = document.getElementById('reset-btn');
    elements.generateEndingBtn = document.getElementById('generate-ending-btn');
    elements.editLog = document.getElementById('edit-log');
    elements.statAdded = document.getElementById('stat-added');
    elements.statRemoved = document.getElementById('stat-removed');
    elements.statUnique = document.getElementById('stat-unique');
    elements.endingSummary = document.getElementById('ending-summary');
    elements.endingText = document.getElementById('ending-text');
    elements.configMood = document.getElementById('config-mood');
    elements.configWords = document.getElementById('config-words');
    elements.configStats = document.getElementById('config-stats');
    elements.copyTextBtn = document.getElementById('copy-text-btn');
    elements.downloadJsonBtn = document.getElementById('download-json-btn');
    elements.editAgainBtn = document.getElementById('edit-again-btn');
    elements.toast = document.getElementById('toast');

    // Initialize audio elements
    initAudio();

    // Event listeners
    elements.startBtn.addEventListener('click', startExperience);
    elements.storyEditor.addEventListener('input', handleStoryInput);
    elements.storyEditor.addEventListener('paste', handlePaste);
    elements.soundToggle.addEventListener('change', toggleSound);
    elements.resetBtn.addEventListener('click', resetStory);
    elements.generateEndingBtn.addEventListener('click', generateEnding);
    elements.copyTextBtn.addEventListener('click', copyFinalText);
    elements.downloadJsonBtn.addEventListener('click', downloadJSON);
    elements.editAgainBtn.addEventListener('click', returnToEditor);

    // Check for autosaved content
    checkAutosave();

    // Start autosave interval (every 2 seconds)
    setInterval(autosave, 2000);
}

// ============================================
// AUDIO INITIALIZATION
// ============================================
function initAudio() {
    for (const [mood, src] of Object.entries(AUDIO_SOURCES)) {
        const audio = new Audio(src);
        audio.volume = 0.3;
        state.audioElements[mood] = audio;
    }
}

// ============================================
// PANEL NAVIGATION
// ============================================
function showPanel(panelName) {
    elements.introPanel.classList.remove('active');
    elements.editorPanel.classList.remove('active');
    elements.endingPanel.classList.remove('active');

    if (panelName === 'intro') {
        elements.introPanel.classList.add('active');
    } else if (panelName === 'editor') {
        elements.editorPanel.classList.add('active');
    } else if (panelName === 'ending') {
        elements.endingPanel.classList.add('active');
    }
}

// ============================================
// START EXPERIENCE
// ============================================
function startExperience() {
    // Set original story
    elements.storyEditor.textContent = ORIGINAL_STORY;

    // Reset state
    state.previousTokens = tokenize(ORIGINAL_STORY);
    state.totalAdded = 0;
    state.totalRemoved = 0;
    state.editLog = [];
    state.currentMood = "NEUTRAL";

    // Update UI
    updateStats();
    updateMood();

    // Show editor panel
    showPanel('editor');
}

// ============================================
// TOKENIZATION
// Splits text into words, normalizing whitespace and stripping punctuation for comparison
// ============================================
function tokenize(text) {
    // Split on whitespace and punctuation, filter empty strings
    const tokens = text
        .toLowerCase()
        .split(/[\s\n\r,;:.!?—–-]+/)
        .filter(token => token.length > 0);

    return tokens;
}

// ============================================
// STORY INPUT HANDLER
// Detects added/removed tokens and updates state
// ============================================
function handleStoryInput() {
    const currentText = elements.storyEditor.textContent;
    const currentTokens = tokenize(currentText);

    // Calculate diff
    const { added, removed } = calculateDiff(state.previousTokens, currentTokens);

    // Update counts
    state.totalAdded += added.length;
    state.totalRemoved += removed.length;

    // Log changes (up to 12 most recent)
    logChanges(added, removed);

    // Update previous tokens
    state.previousTokens = currentTokens;

    // Update UI
    updateStats();
    updateMood();

    // Check if auto-generate ending threshold reached
    if ((state.totalAdded + state.totalRemoved) >= 15) {
        // Could auto-trigger ending here, but per spec we just enable the button
        // User still needs to click "Generate Ending"
    }
}

// ============================================
// CALCULATE DIFF BETWEEN TOKEN ARRAYS
// Returns arrays of added and removed tokens
// ============================================
function calculateDiff(previousTokens, currentTokens) {
    const prevSet = new Set(previousTokens);
    const currSet = new Set(currentTokens);

    // Added: tokens in current but not in previous
    const added = currentTokens.filter((token, index) => {
        // Check if this token was not in the previous set
        // We need to handle duplicates, so we can't just use Set difference
        // Let's use array comparison instead
        const prevCount = previousTokens.filter(t => t === token).length;
        const currCount = currentTokens.filter((t, i) => i <= index && t === token).length;
        return currCount > prevCount;
    });

    // Removed: tokens in previous but not in current
    const removed = previousTokens.filter((token, index) => {
        const prevCount = previousTokens.filter((t, i) => i <= index && t === token).length;
        const currCount = currentTokens.filter(t => t === token).length;
        return prevCount > currCount;
    });

    return { added, removed };
}

// ============================================
// LOG CHANGES TO EDIT LOG
// Adds chips to the edit log display (max 12)
// ============================================
function logChanges(added, removed) {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

    // Log added tokens
    added.forEach(token => {
        state.editLog.push({
            type: 'added',
            word: token,
            time: timestamp
        });
    });

    // Log removed tokens
    removed.forEach(token => {
        state.editLog.push({
            type: 'removed',
            word: token,
            time: timestamp
        });
    });

    // Keep only last 12 changes
    if (state.editLog.length > 12) {
        state.editLog = state.editLog.slice(-12);
    }

    // Render edit log
    renderEditLog();
}

// ============================================
// RENDER EDIT LOG
// Displays edit chips in the UI
// ============================================
function renderEditLog() {
    elements.editLog.innerHTML = '';

    state.editLog.forEach(entry => {
        const chip = document.createElement('div');
        chip.className = 'edit-chip';

        const badge = document.createElement('span');
        badge.className = `edit-badge ${entry.type}`;
        badge.textContent = entry.type === 'added' ? '+' : '–';

        const word = document.createElement('span');
        word.className = 'edit-word';
        word.textContent = entry.word;

        const time = document.createElement('span');
        time.className = 'edit-time';
        time.textContent = entry.time;

        chip.appendChild(badge);
        chip.appendChild(word);
        chip.appendChild(time);

        elements.editLog.appendChild(chip);
    });
}

// ============================================
// UPDATE STATS DISPLAY
// ============================================
function updateStats() {
    const currentTokens = tokenize(elements.storyEditor.textContent);
    const uniqueWords = new Set(currentTokens).size;

    elements.statAdded.textContent = state.totalAdded;
    elements.statRemoved.textContent = state.totalRemoved;
    elements.statUnique.textContent = uniqueWords;
}

// ============================================
// UPDATE MOOD
// Detects current mood based on lexicon matching
// ============================================
function updateMood() {
    const currentTokens = tokenize(elements.storyEditor.textContent);
    const moodCounts = {};

    // Count matches for each lexicon
    for (const [mood, keywords] of Object.entries(LEXICONS)) {
        moodCounts[mood] = currentTokens.filter(token => keywords.includes(token)).length;
    }

    // Find mood with highest count
    let detectedMood = "NEUTRAL";
    let maxCount = 0;

    // Sort by priority (reverse to check highest priority first on ties)
    const sortedMoods = MOOD_PRIORITY.slice().reverse();

    sortedMoods.forEach(mood => {
        if (moodCounts[mood] > maxCount) {
            maxCount = moodCounts[mood];
            detectedMood = mood;
        }
    });

    // Only update if no matches found
    if (maxCount === 0) {
        detectedMood = "NEUTRAL";
    }

    // Update mood if changed
    if (detectedMood !== state.currentMood) {
        const previousMood = state.currentMood;
        state.currentMood = detectedMood;
        applyMoodTheme(detectedMood);

        // Play sound if enabled and mood changed from a previous state
        if (state.soundEnabled && previousMood !== "NEUTRAL") {
            playMoodSound(detectedMood);
        }
    }
}

// ============================================
// APPLY MOOD THEME
// Changes visual theme based on mood
// ============================================
function applyMoodTheme(mood) {
    // Remove all mood classes
    document.body.classList.remove('mood-warm', 'mood-cold', 'mood-bloom', 'mood-storm', 'mood-void');

    // Apply new mood class (if not neutral)
    if (mood !== "NEUTRAL") {
        document.body.classList.add(`mood-${mood.toLowerCase()}`);
    }

    // Update mood badge
    const moodLabel = elements.moodBadge.querySelector('.mood-label');
    moodLabel.textContent = mood;
}

// ============================================
// PLAY MOOD SOUND
// ============================================
function playMoodSound(mood) {
    const audioKey = mood.toLowerCase();
    if (state.audioElements[audioKey]) {
        state.audioElements[audioKey].currentTime = 0;
        state.audioElements[audioKey].play().catch(() => {
            // Ignore errors (e.g., user hasn't interacted with page yet)
        });
    }
}

// ============================================
// TOGGLE SOUND
// ============================================
function toggleSound() {
    state.soundEnabled = elements.soundToggle.checked;
}

// ============================================
// RESET STORY
// ============================================
function resetStory() {
    // Clear localStorage
    localStorage.removeItem('rewriteme_autosave');

    // Reset to original story
    elements.storyEditor.textContent = ORIGINAL_STORY;
    state.previousTokens = tokenize(ORIGINAL_STORY);
    state.totalAdded = 0;
    state.totalRemoved = 0;
    state.editLog = [];
    state.currentMood = "NEUTRAL";

    // Update UI
    updateStats();
    updateMood();
    renderEditLog();

    showToast('Story reset to original text');
}

// ============================================
// PASTE HANDLER
// Strips HTML formatting from pasted content
// ============================================
function handlePaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
}

// ============================================
// AUTOSAVE TO LOCALSTORAGE
// ============================================
function autosave() {
    const currentText = elements.storyEditor.textContent;
    if (currentText && currentText !== ORIGINAL_STORY) {
        localStorage.setItem('rewriteme_autosave', currentText);
    }
}

// ============================================
// CHECK FOR AUTOSAVED CONTENT
// ============================================
function checkAutosave() {
    const saved = localStorage.getItem('rewriteme_autosave');
    if (saved && saved !== ORIGINAL_STORY) {
        showToastWithAction(
            'Restored your unsaved edit.',
            'Discard',
            () => {
                localStorage.removeItem('rewriteme_autosave');
                showToast('Autosave discarded');
            }
        );
    }
}

// ============================================
// GENERATE ENDING
// Determines ending based on mood and keywords
// ============================================
function generateEnding() {
    const currentText = elements.storyEditor.textContent;
    const currentTokens = tokenize(currentText);
    const mood = state.currentMood;

    // Get matched words for this mood
    const matchedWords = getMatchedWords(currentTokens);

    // Select ending based on rules
    const ending = selectEnding(mood, currentTokens);

    // Populate ending panel
    elements.endingSummary.textContent =
        `Edits: +${state.totalAdded} / –${state.totalRemoved}. Mood detected: ${mood}.`;

    elements.endingText.textContent = ending;

    // Populate config card
    renderConfigCard(mood, matchedWords);

    // Show ending panel
    showPanel('ending');
}

// ============================================
// GET MATCHED WORDS
// Returns top 5 most frequent matched words across all lexicons
// ============================================
function getMatchedWords(tokens) {
    const allKeywords = Object.values(LEXICONS).flat();
    const matchedTokens = tokens.filter(token => allKeywords.includes(token));

    // Count frequency
    const frequency = {};
    matchedTokens.forEach(token => {
        frequency[token] = (frequency[token] || 0) + 1;
    });

    // Sort by frequency and get top 5
    const sorted = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([word]) => word);

    return sorted;
}

// ============================================
// SELECT ENDING BASED ON MOOD AND KEYWORDS
// Implements the deterministic ending rules
// ============================================
function selectEnding(mood, tokens) {
    // Ending A (WARM)
    if (mood === "WARM" && tokens.some(t => ["stay", "together", "home"].includes(t))) {
        return "You kept the words that hold. The curtain still moves, but now it feels like breathing. You chose to stay, and staying became a place.";
    }

    // Ending B (BLOOM)
    if (mood === "BLOOM" && tokens.some(t => ["begin", "again", "light", "morning"].includes(t))) {
        return "You reopened the sentence. Morning fits in the margins. Not a return, but a start that keeps starting.";
    }

    // Ending C (COLD)
    if (mood === "COLD" && tokens.some(t => ["leave", "gone", "alone"].includes(t))) {
        return "You trimmed the page to its winter. What remains is clean, and the echo travels farther than you do.";
    }

    // Ending D (STORM)
    if (mood === "STORM" && tokens.some(t => ["break", "burn", "never", "anger"].includes(t))) {
        return "You let the fire edit for you. The lines glow, then go dark. Even smoke is a kind of handwriting.";
    }

    // Ending E (VOID)
    if (mood === "VOID" && tokens.some(t => ["forget", "empty", "erase", "nothing"].includes(t))) {
        return "You erased gently until the paper remembered silence. The story is lighter now, almost air.";
    }

    // Ending F (NEUTRAL or unmatched)
    return "You moved a few commas and the day kept going. Some endings are just the page deciding to rest.";
}

// ============================================
// RENDER CONFIGURATION CARD
// ============================================
function renderConfigCard(mood, matchedWords) {
    // Mood strip is already colored via CSS variable

    // Matched words
    if (matchedWords.length > 0) {
        const wordList = document.createElement('div');
        wordList.className = 'word-list';

        matchedWords.forEach(word => {
            const tag = document.createElement('span');
            tag.className = 'word-tag';
            tag.textContent = word;
            wordList.appendChild(tag);
        });

        elements.configWords.innerHTML = '<h4>Top Matched Words</h4>';
        elements.configWords.appendChild(wordList);
    } else {
        elements.configWords.innerHTML = '<h4>No matched keywords</h4>';
    }

    // Stats
    elements.configStats.innerHTML = `
        <strong>Mood:</strong> ${mood}<br>
        <strong>Words Added:</strong> ${state.totalAdded}<br>
        <strong>Words Removed:</strong> ${state.totalRemoved}<br>
        <strong>Total Edits:</strong> ${state.totalAdded + state.totalRemoved}
    `;
}

// ============================================
// COPY FINAL TEXT TO CLIPBOARD
// ============================================
function copyFinalText() {
    const text = elements.storyEditor.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Text copied to clipboard!');
    }).catch(() => {
        showToast('Failed to copy text');
    });
}

// ============================================
// DOWNLOAD JSON
// ============================================
function downloadJSON() {
    const data = {
        finalText: elements.storyEditor.textContent,
        mood: state.currentMood,
        addedCount: state.totalAdded,
        removedCount: state.totalRemoved,
        matchedWords: getMatchedWords(tokenize(elements.storyEditor.textContent)),
        timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rewrite-me-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('JSON downloaded!');
}

// ============================================
// RETURN TO EDITOR
// ============================================
function returnToEditor() {
    showPanel('editor');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, duration = 3000) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, duration);
}

function showToastWithAction(message, actionText, actionCallback) {
    elements.toast.innerHTML = `
        ${message}
        <button>${actionText}</button>
    `;

    const button = elements.toast.querySelector('button');
    button.addEventListener('click', () => {
        actionCallback();
        elements.toast.classList.remove('show');
    });

    elements.toast.classList.add('show');

    // Auto-hide after 8 seconds
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 8000);
}

// ============================================
// START APPLICATION
// ============================================
document.addEventListener('DOMContentLoaded', init);
