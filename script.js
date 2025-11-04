/* ===================================
   GAME STATE MANAGEMENT
   =================================== */

const gameState = {
    currentCustomer: 0,
    currentRound: 0,
    customerChoices: [],
    allCustomerData: []
};

/* ===================================
   CUSTOMER DATA STRUCTURE
   Each customer has 3 rounds of choices
   =================================== */

const customers = [
    {
        // CUSTOMER 1: THE OVERWORKED OFFICE WORKER
        name: "The Overworked Office Worker",
        icon: "💼",
        bgColor: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        intro: "A tired man in a suit walks up to your stand. He says: \"It's been a long day... I just need something simple to keep me going.\"",

        rounds: [
            {
                // Round 1: Ingredients
                title: "Choose the Ingredients",
                dialogue: "He looks at your menu with tired eyes. What will you make for him?",
                choices: [
                    {
                        text: "Traditional taco (soft beef & onion)",
                        reaction: "He smiles slightly: \"Ah... comfort food. Feels like home.\""
                    },
                    {
                        text: "Spicy taco (extra chili)",
                        reaction: "He laughs: \"That's strong! It woke me up.\""
                    },
                    {
                        text: "Experimental taco (fusion with pineapple)",
                        reaction: "He blinks: \"Pineapple? Unexpected... but nice.\""
                    }
                ]
            },
            {
                // Round 2: Communication Style
                title: "Choose Your Approach",
                dialogue: "As you prepare his order, how will you interact with him?",
                choices: [
                    {
                        text: "Friendly and talkative",
                        reaction: "\"You remind me of my colleague who always cheers people up.\""
                    },
                    {
                        text: "Quiet and respectful",
                        reaction: "\"Thanks for just listening. Silence is rare these days.\""
                    },
                    {
                        text: "Curious and playful",
                        reaction: "\"You really notice details, don't you?\""
                    }
                ]
            },
            {
                // Round 3: Presentation
                title: "Choose the Presentation",
                dialogue: "Time to serve. How will you present his taco?",
                choices: [
                    {
                        text: "Simple plate",
                        reaction: "\"Perfect. Straightforward.\""
                    },
                    {
                        text: "Artistic drizzle",
                        reaction: "\"Didn't expect art from street food!\""
                    },
                    {
                        text: "Wrapped in foil 'to go'",
                        reaction: "\"Thanks, I'll eat on the way home.\""
                    }
                ]
            }
        ]
    },
    {
        // CUSTOMER 2: THE IMMIGRANT WOMAN
        name: "The Immigrant Woman",
        icon: "🧳",
        bgColor: "linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)",
        intro: "A woman carrying a small suitcase stops by. She says: \"Your food smells familiar... but also different. I just arrived in this city.\"",

        rounds: [
            {
                // Round 1: Ingredients
                title: "Choose the Ingredients",
                dialogue: "She looks hopeful. What ingredients will you use?",
                choices: [
                    {
                        text: "Traditional taco (corn tortilla, beef)",
                        reaction: "\"This reminds me of home. Thank you.\""
                    },
                    {
                        text: "Fusion taco (mango salsa & chicken)",
                        reaction: "\"It's like... two places meeting in one bite.\""
                    },
                    {
                        text: "Vegetarian taco (beans & avocado)",
                        reaction: "\"Light and fresh, maybe it's time to start new.\""
                    }
                ]
            },
            {
                // Round 2: Communication Style
                title: "Choose Your Approach",
                dialogue: "She seems a bit lost in this new place. How do you connect?",
                choices: [
                    {
                        text: "Warm welcome",
                        reaction: "\"You make me feel like I belong.\""
                    },
                    {
                        text: "Respectful distance",
                        reaction: "\"Polite... just like in the airport.\""
                    },
                    {
                        text: "Light humor",
                        reaction: "\"Haha, maybe laughter is the same in every language.\""
                    }
                ]
            },
            {
                // Round 3: Presentation
                title: "Choose the Presentation",
                dialogue: "How will you serve her meal?",
                choices: [
                    {
                        text: "Handmade plate",
                        reaction: "\"It feels made with care.\""
                    },
                    {
                        text: "Paper wrap",
                        reaction: "\"I'll eat it while I walk — like a journey.\""
                    },
                    {
                        text: "Bright colored garnish",
                        reaction: "\"So colorful... like the streets I miss.\""
                    }
                ]
            }
        ]
    },
    {
        // CUSTOMER 3: THE ART STUDENT
        name: "The Art Student",
        icon: "🎨",
        bgColor: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
        intro: "A quiet young artist with paint on her hands appears. She says: \"I'm searching for inspiration... maybe flavor can spark it.\"",

        rounds: [
            {
                // Round 1: Ingredients
                title: "Choose the Ingredients",
                dialogue: "She's looking for something creative. What will inspire her?",
                choices: [
                    {
                        text: "Minimal taco (just essentials)",
                        reaction: "\"So clean... like a blank canvas.\""
                    },
                    {
                        text: "Colorful taco (lots of mix)",
                        reaction: "\"This is chaos, I love it.\""
                    },
                    {
                        text: "Texture experiment (crispy shell)",
                        reaction: "\"Crunchy rhythm, like a brushstroke.\""
                    }
                ]
            },
            {
                // Round 2: Communication Style
                title: "Choose Your Approach",
                dialogue: "She's observing everything quietly. How do you engage?",
                choices: [
                    {
                        text: "Ask about her art",
                        reaction: "\"You care about creation. That matters.\""
                    },
                    {
                        text: "Share your own story",
                        reaction: "\"Every cook is an artist too.\""
                    },
                    {
                        text: "Stay mysterious",
                        reaction: "\"Hmm... silence says more than words.\""
                    }
                ]
            },
            {
                // Round 3: Presentation
                title: "Choose the Presentation",
                dialogue: "For an artist, the visual matters. How will you present it?",
                choices: [
                    {
                        text: "Geometric arrangement",
                        reaction: "\"Symmetry is satisfying.\""
                    },
                    {
                        text: "Organic messy plate",
                        reaction: "\"Imperfection is emotion.\""
                    },
                    {
                        text: "Taco tower",
                        reaction: "\"Absurd, but amazing!\""
                    }
                ]
            }
        ]
    }
];

/* ===================================
   SCENE TRANSITION FUNCTIONS
   =================================== */

/**
 * Transitions from one scene to another with fade effect
 */
function transitionToScene(sceneId) {
    // Hide all scenes
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });

    // Show target scene after brief delay
    setTimeout(() => {
        document.getElementById(sceneId).classList.add('active');
    }, 100);
}

/**
 * Start the game - transition from intro to first customer
 */
function startGame() {
    // Try to play ambient sound (will fail if no sound file, that's ok)
    const ambientSound = document.getElementById('ambientSound');
    if (ambientSound) {
        ambientSound.play().catch(() => {
            // Sound playback failed, continue silently
        });
    }

    // Reset game state
    gameState.currentCustomer = 0;
    gameState.currentRound = 0;
    gameState.customerChoices = [];
    gameState.allCustomerData = [];

    // Transition to customer scene
    transitionToScene('customer-scene');

    // Load first customer
    setTimeout(() => {
        loadCustomer();
    }, 500);
}

/**
 * Restart the entire game
 */
function restartGame() {
    // Reset game state
    gameState.currentCustomer = 0;
    gameState.currentRound = 0;
    gameState.customerChoices = [];
    gameState.allCustomerData = [];

    // Transition back to intro
    transitionToScene('intro-scene');
}

/* ===================================
   CUSTOMER INTERACTION LOGIC
   =================================== */

/**
 * Load and display current customer
 */
function loadCustomer() {
    const customer = customers[gameState.currentCustomer];
    const round = customer.rounds[gameState.currentRound];

    // Update customer portrait
    const portrait = document.getElementById('customerPortrait');
    portrait.textContent = customer.icon;
    portrait.style.background = customer.bgColor;

    // Update progress dots
    updateProgressDots();

    // Show intro dialogue on first round only
    if (gameState.currentRound === 0) {
        typeText(customer.intro, () => {
            setTimeout(() => {
                showRoundDialogue(round);
            }, 1000);
        });
    } else {
        showRoundDialogue(round);
    }
}

/**
 * Display round-specific dialogue and choices
 */
function showRoundDialogue(round) {
    // Clear reaction box
    const reactionBox = document.getElementById('reactionBox');
    reactionBox.classList.remove('show');
    reactionBox.textContent = '';

    // Type the round dialogue
    typeText(round.dialogue, () => {
        // After dialogue finishes, show choices
        setTimeout(() => {
            displayChoices(round.choices);
        }, 500);
    });
}

/**
 * Display choice buttons for current round
 */
function displayChoices(choices) {
    const container = document.getElementById('choicesContainer');
    container.innerHTML = '';

    choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.style.animationDelay = `${index * 0.1}s`;

        button.addEventListener('click', () => {
            handleChoice(choice, index);
        });

        container.appendChild(button);
    });
}

/**
 * Handle player choice selection
 */
function handleChoice(choice, choiceIndex) {
    // Store the choice
    gameState.customerChoices.push({
        round: gameState.currentRound,
        choiceIndex: choiceIndex,
        text: choice.text
    });

    // Hide choices
    document.getElementById('choicesContainer').innerHTML = '';

    // Show reaction
    showReaction(choice.reaction);

    // Change background color based on reaction
    changeBackgroundTone();

    // After reaction, proceed to next round or next customer
    setTimeout(() => {
        proceedToNext();
    }, 3000);
}

/**
 * Display customer reaction to choice
 */
function showReaction(reactionText) {
    const reactionBox = document.getElementById('reactionBox');
    reactionBox.textContent = reactionText;
    reactionBox.classList.add('show');
}

/**
 * Change background color tone for variety
 */
function changeBackgroundTone() {
    const colors = [
        'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)',
        'linear-gradient(135deg, #2c1810 0%, #4a2c1f 50%, #1a0f08 100%)',
        'linear-gradient(135deg, #1f1c2c 0%, #2e2440 50%, #3a2f4a 100%)'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.background = randomColor;
}

/**
 * Proceed to next round or next customer
 */
function proceedToNext() {
    if (gameState.currentRound < 2) {
        // More rounds with this customer
        gameState.currentRound++;
        loadCustomer();
    } else {
        // Customer complete, save their data
        const customer = customers[gameState.currentCustomer];
        gameState.allCustomerData.push({
            name: customer.name,
            icon: customer.icon,
            choices: [...gameState.customerChoices]
        });

        // Reset for next customer
        gameState.customerChoices = [];
        gameState.currentRound = 0;

        if (gameState.currentCustomer < customers.length - 1) {
            // Move to next customer
            gameState.currentCustomer++;
            setTimeout(() => {
                loadCustomer();
            }, 500);
        } else {
            // All customers served, go to cooking scene
            setTimeout(() => {
                transitionToScene('cooking-scene');
                initCooking();
            }, 1000);
        }
    }
}

/**
 * Update progress dots to show current round
 */
function updateProgressDots() {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index < gameState.currentRound) {
            dot.classList.add('completed');
        } else if (index === gameState.currentRound) {
            dot.classList.add('active');
        }
    });
}

/* ===================================
   TYPING EFFECT FOR DIALOGUE
   =================================== */

let typingTimeout;

/**
 * Type text character by character
 */
function typeText(text, callback) {
    const dialogueText = document.getElementById('dialogueText');
    dialogueText.textContent = '';
    dialogueText.classList.add('typing');

    let charIndex = 0;

    // Clear any existing typing animation
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }

    function typeNextChar() {
        if (charIndex < text.length) {
            dialogueText.textContent += text[charIndex];
            charIndex++;
            typingTimeout = setTimeout(typeNextChar, 30); // Typing speed
        } else {
            dialogueText.classList.remove('typing');
            if (callback) callback();
        }
    }

    typeNextChar();
}

/* ===================================
   COOKING SCENE - DRAG AND DROP
   =================================== */

let addedIngredients = [];

/**
 * Initialize cooking scene interactions
 */
function initCooking() {
    addedIngredients = [];

    const pan = document.getElementById('cookingPan');
    const ingredients = document.querySelectorAll('.ingredient');
    const ingredientDisplay = document.getElementById('ingredientDisplay');
    const cookingMessage = document.getElementById('cookingMessage');

    // Reset display
    ingredientDisplay.innerHTML = '';
    cookingMessage.textContent = '';
    cookingMessage.classList.remove('show');

    // Reset ingredient states
    ingredients.forEach(ing => {
        ing.classList.remove('used');
    });

    // Set up drag events for ingredients
    ingredients.forEach(ingredient => {
        ingredient.addEventListener('dragstart', handleDragStart);
    });

    // Set up drop zone events
    pan.addEventListener('dragover', handleDragOver);
    pan.addEventListener('dragleave', handleDragLeave);
    pan.addEventListener('drop', handleDrop);
}

/**
 * Handle drag start event
 */
function handleDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.dataset.ingredient);
}

/**
 * Handle drag over pan
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    const pan = document.getElementById('cookingPan');
    pan.classList.add('drag-over');

    return false;
}

/**
 * Handle drag leave pan
 */
function handleDragLeave(e) {
    const pan = document.getElementById('cookingPan');
    pan.classList.remove('drag-over');
}

/**
 * Handle drop into pan
 */
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    const pan = document.getElementById('cookingPan');
    pan.classList.remove('drag-over');

    const ingredientName = e.dataTransfer.getData('text/html');

    // Don't add if already added
    if (addedIngredients.includes(ingredientName)) {
        return false;
    }

    // Don't add more than 3 ingredients
    if (addedIngredients.length >= 3) {
        return false;
    }

    // Add ingredient
    addIngredientToPan(ingredientName);

    // Play sizzle sound
    playSizzleSound();

    // Mark ingredient as used
    const ingredientElements = document.querySelectorAll('.ingredient');
    ingredientElements.forEach(ing => {
        if (ing.dataset.ingredient === ingredientName) {
            ing.classList.add('used');
        }
    });

    // Check if we have 3 ingredients
    if (addedIngredients.length === 3) {
        completeCooking();
    }

    return false;
}

/**
 * Add ingredient visual to pan
 */
function addIngredientToPan(ingredientName) {
    addedIngredients.push(ingredientName);

    const ingredientDisplay = document.getElementById('ingredientDisplay');
    const pan = document.getElementById('cookingPan');

    // Find the ingredient element to get its icon
    const ingredientEl = document.querySelector(`[data-ingredient="${ingredientName}"]`);
    const icon = ingredientEl.querySelector('.ingredient-icon').textContent;

    // Create ingredient in pan
    const ingredientInPan = document.createElement('div');
    ingredientInPan.className = 'ingredient-in-pan';
    ingredientInPan.textContent = icon;
    ingredientDisplay.appendChild(ingredientInPan);

    // Add cooking class for glow effect
    pan.classList.add('cooking');

    // Create smoke effect
    createSmoke();
}

/**
 * Create smoke animation
 */
function createSmoke() {
    const smokeContainer = document.getElementById('smokeContainer');

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.className = 'smoke';
            smoke.style.left = `${Math.random() * 60 + 20}%`;
            smoke.style.top = `${Math.random() * 60 + 20}%`;
            smokeContainer.appendChild(smoke);

            // Remove smoke after animation
            setTimeout(() => {
                smoke.remove();
            }, 3000);
        }, i * 200);
    }
}

/**
 * Play sizzle sound effect
 */
function playSizzleSound() {
    const sizzleSound = document.getElementById('sizzleSound');
    if (sizzleSound) {
        sizzleSound.currentTime = 0;
        sizzleSound.play().catch(() => {
            // Sound playback failed, continue silently
        });
    }
}

/**
 * Complete cooking and transition to outcome
 */
function completeCooking() {
    const cookingMessage = document.getElementById('cookingMessage');
    cookingMessage.textContent = "You've made your own unique flavor.";
    cookingMessage.classList.add('show');

    // Transition to outcome scene after delay
    setTimeout(() => {
        transitionToScene('outcome-scene');
        showOutcome();
    }, 3000);
}

/* ===================================
   OUTCOME SCENE
   =================================== */

/**
 * Display final outcome and summary
 */
function showOutcome() {
    const summaryContainer = document.getElementById('customerSummary');
    summaryContainer.innerHTML = '';

    // Create recap for each customer
    gameState.allCustomerData.forEach((customerData, index) => {
        const customer = customers[index];

        const recapDiv = document.createElement('div');
        recapDiv.className = 'customer-recap';

        const title = document.createElement('h3');
        title.textContent = `${customer.icon} ${customer.name}`;

        const choicesList = document.createElement('p');
        const choiceTexts = customerData.choices.map((c, i) =>
            `Round ${i + 1}: ${c.text}`
        ).join('<br>');
        choicesList.innerHTML = choiceTexts;

        recapDiv.appendChild(title);
        recapDiv.appendChild(choicesList);
        summaryContainer.appendChild(recapDiv);
    });
}

/* ===================================
   INITIALIZATION
   =================================== */

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('The Taste of Taco - Interactive Experience Loaded');

    // Set initial scene
    document.getElementById('intro-scene').classList.add('active');
});
