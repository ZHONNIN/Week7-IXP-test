/* ========================================
   REWRITE ME: FIXED BLANKS EDITION
   JavaScript Logic
   ======================================== */

// ===== CONFIGURATION =====

/**
 * Allowed options for each blank (strict sets)
 */
const BLANK_OPTIONS = {
  TIME: ['morning', 'midnight', 'rainy evening'],
  PLACE: ['station', 'river', 'museum'],
  VERB: ['waiting', 'running', 'hiding'],
  OBJECT: ['map', 'letter', 'key'],
  DECISION: ['stay', 'leave', 'begin again']
};

/**
 * Ending definitions with deterministic rules (priority order)
 * Rules are evaluated in this exact order; first match wins
 */
const ENDING_RULES = [
  // R1: If DECISION == "leave"
  {
    id: 'COLD_FAREWELL',
    condition: (vals) => vals.DECISION === 'leave',
    text: `You trimmed the moment down to travel size.
Departure is a sentence without a comma, and you carried it well.`
  },
  // R2: Else if DECISION == "begin again"
  {
    id: 'BLOOM_RESTART',
    condition: (vals) => vals.DECISION === 'begin again',
    text: `You reopened the day like a door.
It wasn't a return, but a start that keeps starting.`
  },
  // R3: Else if (OBJECT == "key" && PLACE == "museum")
  {
    id: 'THRESHOLD',
    condition: (vals) => vals.OBJECT === 'key' && vals.PLACE === 'museum',
    text: `Among rooms that remember everything, you chose the key.
Some doors open forward; some open into a different kind of past.`
  },
  // R4: Else if (OBJECT == "map" && PLACE == "station")
  {
    id: 'JOURNEY',
    condition: (vals) => vals.OBJECT === 'map' && vals.PLACE === 'station',
    text: `The station gave the map a pulse.
Staying still felt like moving, and the tracks agreed.`
  },
  // R5: Else if (DECISION == "stay" && TIME == "midnight" && VERB == "hiding")
  {
    id: 'QUIET_SHELTER',
    condition: (vals) => vals.DECISION === 'stay' && vals.TIME === 'midnight' && vals.VERB === 'hiding',
    text: `Midnight kept the noise outside.
Hiding turned into shelter, and shelter into a promise.`
  },
  // R6: Else if (DECISION == "stay" && VERB == "running")
  {
    id: 'STILLNESS',
    condition: (vals) => vals.DECISION === 'stay' && vals.VERB === 'running',
    text: `You let the running stop inside the sentence.
The street kept going; you didn't need to.`
  },
  // R7: Else if DECISION == "stay"
  {
    id: 'WARM_KEEP',
    condition: (vals) => vals.DECISION === 'stay',
    text: `You kept the part that holds.
The curtain still moves, but now it feels like breathing.`
  },
  // R8: Else (fallback)
  {
    id: 'NEUTRAL_DRIFT',
    condition: () => true,
    text: `You adjusted the wording and the day went on.
Not everything needs a headline to mean something.`
  }
];

// ===== STATE =====

/**
 * Current state of all blanks (normalized to lowercase)
 */
const state = {
  TIME: '',
  PLACE: '',
  VERB: '',
  OBJECT: '',
  DECISION: ''
};

// ===== DOM REFERENCES =====

const introPanelEl = document.getElementById('intro-panel');
const editorPanelEl = document.getElementById('editor-panel');
const endingPanelEl = document.getElementById('ending-panel');

const beginBtn = document.getElementById('begin-btn');
const randomizeBtn = document.getElementById('randomize-btn');
const resetBtn = document.getElementById('reset-btn');
const generateBtn = document.getElementById('generate-btn');

const chipsContainer = document.getElementById('chips-container');

const blankInputs = {
  blank1: document.getElementById('blank1'),
  blank2: document.getElementById('blank2'),
  blank3: document.getElementById('blank3'),
  blank4: document.getElementById('blank4'),
  blank5: document.getElementById('blank5')
};

const finalStoryEl = document.getElementById('final-story');
const summaryCardEl = document.getElementById('summary-card');
const endingTextEl = document.getElementById('ending-text');

const copyBtn = document.getElementById('copy-btn');
const editAgainBtn = document.getElementById('edit-again-btn');
const saveJsonBtn = document.getElementById('save-json-btn');

// ===== INITIALIZATION =====

/**
 * Initialize the application
 */
function init() {
  // Event listeners for navigation
  beginBtn.addEventListener('click', showEditorPanel);

  // Event listeners for controls
  randomizeBtn.addEventListener('click', randomizeAllBlanks);
  resetBtn.addEventListener('click', resetAllBlanks);
  generateBtn.addEventListener('click', generateEnding);

  // Event listeners for ending actions
  copyBtn.addEventListener('click', copyStory);
  editAgainBtn.addEventListener('click', returnToEditor);
  saveJsonBtn.addEventListener('click', saveAsJson);

  // Event listeners for blank inputs
  Object.values(blankInputs).forEach(input => {
    input.addEventListener('input', handleBlankInput);
    input.addEventListener('blur', handleBlankBlur);

    // Prevent HTML paste - paste only plain text
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text/plain');
      const trimmedText = text.trim();
      // Use modern approach or fallback
      if (document.execCommand) {
        document.execCommand('insertText', false, trimmedText);
      } else {
        input.value = trimmedText;
        handleBlankInput({ target: input });
      }
    });
  });

  // Keyboard shortcuts
  generateBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !generateBtn.disabled) {
      generateEnding();
    }
  });

  // Initialize chips
  updateChips();
}

// ===== PANEL NAVIGATION =====

/**
 * Show editor panel
 */
function showEditorPanel() {
  introPanelEl.classList.remove('active');
  setTimeout(() => {
    editorPanelEl.classList.add('active');
  }, 100);
}

/**
 * Show ending panel
 */
function showEndingPanel() {
  editorPanelEl.classList.remove('active');
  setTimeout(() => {
    endingPanelEl.classList.add('active');
  }, 100);
}

/**
 * Return to editor from ending
 */
function returnToEditor() {
  endingPanelEl.classList.remove('active');
  setTimeout(() => {
    editorPanelEl.classList.add('active');
  }, 100);
}

// ===== VALIDATION =====

/**
 * Normalize input value (trim and lowercase for comparison)
 */
function normalizeValue(value) {
  return value.trim().toLowerCase();
}

/**
 * Validate if a value is in the allowed options for a blank type
 */
function isValidOption(blankType, value) {
  const normalized = normalizeValue(value);
  return BLANK_OPTIONS[blankType].includes(normalized);
}

/**
 * Get the blank type from an input element
 */
function getBlankType(input) {
  return input.dataset.blank;
}

/**
 * Update validation state for an input
 */
function updateValidation(input) {
  const value = input.value;
  const blankType = getBlankType(input);

  if (value === '') {
    // Empty - neutral state
    input.classList.remove('valid', 'invalid');
    return false;
  }

  if (isValidOption(blankType, value)) {
    // Valid
    input.classList.remove('invalid');
    input.classList.add('valid');

    // Update state with normalized value
    state[blankType] = normalizeValue(value);

    return true;
  } else {
    // Invalid
    input.classList.remove('valid');
    input.classList.add('invalid');

    // Clear state
    state[blankType] = '';

    return false;
  }
}

/**
 * Check if all blanks are valid
 */
function areAllBlanksValid() {
  return Object.values(blankInputs).every(input => {
    const value = input.value.trim();
    const blankType = getBlankType(input);
    return value !== '' && isValidOption(blankType, value);
  });
}

/**
 * Update the Generate Ending button state
 */
function updateGenerateButton() {
  const allValid = areAllBlanksValid();
  generateBtn.disabled = !allValid;
}

// ===== INPUT HANDLERS =====

/**
 * Handle input event on blank fields
 */
function handleBlankInput(e) {
  const input = e.target;

  // Trim whitespace
  input.value = input.value.trim();

  updateValidation(input);
  updateGenerateButton();
  updateChips();
  updateTheme();
}

/**
 * Handle blur event on blank fields
 */
function handleBlankBlur(e) {
  const input = e.target;
  input.value = input.value.trim();
  updateValidation(input);
}

// ===== CHIPS DISPLAY =====

/**
 * Update the chips display showing current selections
 */
function updateChips() {
  const chipLabels = {
    TIME: 'time',
    PLACE: 'place',
    VERB: 'action',
    OBJECT: 'object',
    DECISION: 'decision'
  };

  chipsContainer.innerHTML = '';

  Object.entries(state).forEach(([key, value]) => {
    const chip = document.createElement('div');
    chip.className = 'chip';

    if (value) {
      chip.classList.add('filled');
      chip.textContent = value;
    } else {
      chip.textContent = chipLabels[key];
    }

    chipsContainer.appendChild(chip);
  });
}

// ===== THEME MANAGEMENT =====

/**
 * Update the theme based on DECISION blank
 */
function updateTheme() {
  const decision = state.DECISION;

  if (decision === 'stay') {
    document.body.setAttribute('data-theme', 'stay');
  } else if (decision === 'leave') {
    document.body.setAttribute('data-theme', 'leave');
  } else if (decision === 'begin again') {
    document.body.setAttribute('data-theme', 'begin again');
  } else {
    document.body.setAttribute('data-theme', 'default');
  }
}

// ===== CONTROLS =====

/**
 * Randomize all blank values with valid options
 */
function randomizeAllBlanks() {
  Object.entries(blankInputs).forEach(([id, input]) => {
    const blankType = getBlankType(input);
    const options = BLANK_OPTIONS[blankType];
    const randomOption = options[Math.floor(Math.random() * options.length)];

    input.value = randomOption;
    updateValidation(input);
  });

  updateChips();
  updateGenerateButton();
  updateTheme();
}

/**
 * Reset all blanks to empty state
 */
function resetAllBlanks() {
  Object.values(blankInputs).forEach(input => {
    input.value = '';
    input.classList.remove('valid', 'invalid');
  });

  // Clear state
  Object.keys(state).forEach(key => {
    state[key] = '';
  });

  updateChips();
  updateGenerateButton();
  updateTheme();
}

// ===== ENDING GENERATION =====

/**
 * Determine which ending to use based on deterministic rules
 * Evaluates rules in priority order; first match wins
 */
function determineEnding() {
  for (const rule of ENDING_RULES) {
    if (rule.condition(state)) {
      return rule;
    }
  }

  // Should never reach here due to fallback rule, but just in case
  return ENDING_RULES[ENDING_RULES.length - 1];
}

/**
 * Generate the final story text with highlighted selections
 */
function generateFinalStory() {
  return `I still remember that morning, though some details keep changing.<br>
We met on a <span class="highlight">${state.TIME}</span> at the <span class="highlight">${state.PLACE}</span>.<br>
You were <span class="highlight">${state.VERB}</span> while I held a small <span class="highlight">${state.OBJECT}</span>.<br>
When the curtain moved, we decided to <span class="highlight">${state.DECISION}</span>.`;
}

/**
 * Generate the summary card HTML
 */
function generateSummaryCard() {
  const items = [
    `Time: <strong>${state.TIME}</strong>`,
    `Place: <strong>${state.PLACE}</strong>`,
    `Verb: <strong>${state.VERB}</strong>`,
    `Object: <strong>${state.OBJECT}</strong>`,
    `Decision: <strong>${state.DECISION}</strong>`
  ];

  return items.map(item => `<span class="summary-item">${item}</span>`).join('');
}

/**
 * Generate and display the ending
 */
function generateEnding() {
  if (!areAllBlanksValid()) return;

  // Determine ending using deterministic rules
  const ending = determineEnding();

  // Populate final story
  finalStoryEl.innerHTML = generateFinalStory();

  // Populate summary card
  summaryCardEl.innerHTML = generateSummaryCard();

  // Populate ending text (preserve line breaks)
  endingTextEl.innerHTML = ending.text.replace(/\n/g, '<br>');

  // Show ending panel
  showEndingPanel();
}

// ===== ENDING ACTIONS =====

/**
 * Copy the final story to clipboard
 */
function copyStory() {
  const ending = determineEnding();

  const storyText = `I still remember that morning, though some details keep changing.
We met on a ${state.TIME} at the ${state.PLACE}.
You were ${state.VERB} while I held a small ${state.OBJECT}.
When the curtain moved, we decided to ${state.DECISION}.

${ending.text}`;

  navigator.clipboard.writeText(storyText).then(() => {
    // Visual feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  }).catch(err => {
    console.error('Failed to copy:', err);
    alert('Failed to copy to clipboard');
  });
}

/**
 * Save the story data as JSON
 */
function saveAsJson() {
  const ending = determineEnding();

  const data = {
    time: state.TIME,
    place: state.PLACE,
    verb: state.VERB,
    object: state.OBJECT,
    decision: state.DECISION,
    endingId: ending.id,
    timestamp: new Date().toISOString()
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `rewrite-me-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Visual feedback
  const originalText = saveJsonBtn.textContent;
  saveJsonBtn.textContent = 'Saved!';
  setTimeout(() => {
    saveJsonBtn.textContent = originalText;
  }, 1500);
}

// ===== START APPLICATION =====

init();
