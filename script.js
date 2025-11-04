/* ========================================
   BUILD YOUR SELF - INTERACTIVE IDENTITY CONFIGURATOR
   Main JavaScript Logic
   ======================================== */

// ========================================
// STATE MANAGEMENT
// ========================================
const appState = {
    selections: {
        shell: null,
        engine: null,
        mode: null,
        interior: null
    },
    currentColor: '#888888',
    currentGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
};

// ========================================
// REFLECTIVE TEXT DATABASE
// ========================================
const reflectiveTexts = {
    shell: {
        arctic: "Your calmness hides an ocean.",
        crimson: "Boldness burns but also warms.",
        obsidian: "Shadows hold secrets worth knowing."
    },
    engine: {
        desire: "Longing is the fuel of creation.",
        belief: "Purpose gives direction to the chaos.",
        fear: "Even fear keeps the engine alive."
    },
    mode: {
        explorer: "Curiosity is your compass.",
        balancer: "Harmony is a skill, not a default.",
        escapist: "Running is sometimes a strategy."
    },
    interior: {
        velvet: "Softness is strength in disguise.",
        steel: "Logic protects what matters most.",
        leather: "Honesty leaves marks, but it's real."
    }
};

// ========================================
// PERSONA NAME GENERATOR
// ========================================
const personaNames = {
    arctic_desire_explorer_velvet: "Model A-12: The Gentle Seeker",
    arctic_desire_explorer_steel: "Model A-13: The Rational Wanderer",
    arctic_desire_explorer_leather: "Model A-14: The Honest Explorer",
    arctic_desire_balancer_velvet: "Model A-22: The Calm Harmonizer",
    arctic_desire_balancer_steel: "Model A-23: The Measured Navigator",
    arctic_desire_balancer_leather: "Model A-24: The Grounded Seeker",
    arctic_desire_escapist_velvet: "Model A-32: The Soft Retreater",
    arctic_desire_escapist_steel: "Model A-33: The Logic Runner",
    arctic_desire_escapist_leather: "Model A-34: The Raw Escapist",

    arctic_belief_explorer_velvet: "Model B-12: The Compassionate Visionary",
    arctic_belief_explorer_steel: "Model B-13: The Calculated Pioneer",
    arctic_belief_explorer_leather: "Model B-14: The True Believer",
    arctic_belief_balancer_velvet: "Model B-22: The Peaceful Guardian",
    arctic_belief_balancer_steel: "Model B-23: The Principled Mediator",
    arctic_belief_balancer_leather: "Model B-24: The Authentic Balancer",
    arctic_belief_escapist_velvet: "Model B-32: The Gentle Idealist",
    arctic_belief_escapist_steel: "Model B-33: The Detached Philosopher",
    arctic_belief_escapist_leather: "Model B-34: The Honest Recluse",

    arctic_fear_explorer_velvet: "Model C-12: The Anxious Adventurer",
    arctic_fear_explorer_steel: "Model C-13: The Cautious Strategist",
    arctic_fear_explorer_leather: "Model C-14: The Survival Artist",
    arctic_fear_balancer_velvet: "Model C-22: The Worried Peacekeeper",
    arctic_fear_balancer_steel: "Model C-23: The Protected Diplomat",
    arctic_fear_balancer_leather: "Model C-24: The Vigilant Guardian",
    arctic_fear_escapist_velvet: "Model C-32: The Soft Survivor",
    arctic_fear_escapist_steel: "Model C-33: The Armored Runner",
    arctic_fear_escapist_leather: "Model C-34: The Honest Coward",

    crimson_desire_explorer_velvet: "Model D-12: The Passion Navigator",
    crimson_desire_explorer_steel: "Model D-13: The Bold Calculator",
    crimson_desire_explorer_leather: "Model D-14: The Raw Adventurer",
    crimson_desire_balancer_velvet: "Model D-22: The Warm Mediator",
    crimson_desire_balancer_steel: "Model D-23: The Passionate Strategist",
    crimson_desire_balancer_leather: "Model D-24: The Fierce Diplomat",
    crimson_desire_escapist_velvet: "Model D-32: The Loving Runner",
    crimson_desire_escapist_steel: "Model D-33: The Controlled Escapist",
    crimson_desire_escapist_leather: "Model D-34: The Intense Recluse",

    crimson_belief_explorer_velvet: "Model E-12: The Compassionate Crusader",
    crimson_belief_explorer_steel: "Model E-13: The Logical Revolutionary",
    crimson_belief_explorer_leather: "Model E-14: The Truth Seeker",
    crimson_belief_balancer_velvet: "Model E-22: The Passionate Healer",
    crimson_belief_balancer_steel: "Model E-23: The Strategic Idealist",
    crimson_belief_balancer_leather: "Model E-24: The Honest Advocate",
    crimson_belief_escapist_velvet: "Model E-32: The Gentle Rebel",
    crimson_belief_escapist_steel: "Model E-33: The Calculated Hermit",
    crimson_belief_escapist_leather: "Model E-34: The Raw Dissident",

    crimson_fear_explorer_velvet: "Model F-12: The Brave Heart",
    crimson_fear_explorer_steel: "Model F-13: The Fearful Warrior",
    crimson_fear_explorer_leather: "Model F-14: The Honest Fighter",
    crimson_fear_balancer_velvet: "Model F-22: The Protective Nurturer",
    crimson_fear_balancer_steel: "Model F-23: The Defended Diplomat",
    crimson_fear_balancer_leather: "Model F-24: The Alert Guardian",
    crimson_fear_escapist_velvet: "Model F-32: The Tender Fugitive",
    crimson_fear_escapist_steel: "Model F-33: The Armored Exile",
    crimson_fear_escapist_leather: "Model F-34: The Burning Runner",

    obsidian_desire_explorer_velvet: "Model G-12: The Dark Romantic",
    obsidian_desire_explorer_steel: "Model G-13: The Shadow Analyst",
    obsidian_desire_explorer_leather: "Model G-14: The Midnight Wanderer",
    obsidian_desire_balancer_velvet: "Model G-22: The Mysterious Mediator",
    obsidian_desire_balancer_steel: "Model G-23: The Cold Negotiator",
    obsidian_desire_balancer_leather: "Model G-24: The Deep Diplomat",
    obsidian_desire_escapist_velvet: "Model G-32: The Gentle Shadow",
    obsidian_desire_escapist_steel: "Model G-33: The Void Walker",
    obsidian_desire_escapist_leather: "Model G-34: The Dark Hermit",

    obsidian_belief_explorer_velvet: "Model H-12: The Compassionate Mystic",
    obsidian_belief_explorer_steel: "Model H-13: The Dark Philosopher",
    obsidian_belief_explorer_leather: "Model H-14: The Truth in Darkness",
    obsidian_belief_balancer_velvet: "Model H-22: The Secret Keeper",
    obsidian_belief_balancer_steel: "Model H-23: The Silent Strategist",
    obsidian_belief_balancer_leather: "Model H-24: The Honest Shadow",
    obsidian_belief_escapist_velvet: "Model H-32: The Gentle Void",
    obsidian_belief_escapist_steel: "Model H-33: The Calculated Recluse",
    obsidian_belief_escapist_leather: "Model H-34: The Deep Exile",

    obsidian_fear_explorer_velvet: "Model I-12: The Worried Night",
    obsidian_fear_explorer_steel: "Model I-13: The Paranoid Detective",
    obsidian_fear_explorer_leather: "Model I-14: The Survival Shadow",
    obsidian_fear_balancer_velvet: "Model I-22: The Anxious Peacekeeper",
    obsidian_fear_balancer_steel: "Model I-23: The Guarded Diplomat",
    obsidian_fear_balancer_leather: "Model I-24: The Vigilant Shadow",
    obsidian_fear_escapist_velvet: "Model I-32: The Soft Darkness",
    obsidian_fear_escapist_steel: "Model I-33: The Armored Void",
    obsidian_fear_escapist_leather: "Model I-34: The Honest Coward in Black"
};

// ========================================
// PERSONA DESCRIPTION GENERATOR
// ========================================
function generatePersonaDescription() {
    const { shell, engine, mode, interior } = appState.selections;

    // Shell descriptions
    const shellDesc = {
        arctic: "Your exterior is calm and pristine, radiating clarity.",
        crimson: "Your surface pulses with energy, bold and unapologetic.",
        obsidian: "Your shell is dark and mysterious, inviting curiosity."
    };

    // Engine descriptions
    const engineDesc = {
        desire: "You move forward chasing warmth and meaning, driven by what you lack and crave.",
        belief: "Your engine runs on conviction, every action aligned with purpose and principle.",
        fear: "Anxiety powers your motion—survival instinct keeps you alert and adaptive."
    };

    // Mode descriptions
    const modeDesc = {
        explorer: "You seek new horizons, embracing the unknown with open arms.",
        balancer: "You maintain equilibrium, navigating between extremes with grace.",
        escapist: "You flee from pressure, finding freedom in distance and detachment."
    };

    // Interior descriptions
    const interiorDesc = {
        velvet: "Inside, you're soft and empathetic, feeling deeply what others miss.",
        steel: "Your interior is polished steel—rational, reserved, and protected.",
        leather: "Within, you're raw and honest, wearing your truth without pretense."
    };

    return `${shellDesc[shell]} ${engineDesc[engine]} ${modeDesc[mode]} ${interiorDesc[interior]} The world may not always understand—but you drive anyway.`;
}

// ========================================
// AUDIO MANAGEMENT (with graceful fallback)
// ========================================
function playSound(soundId) {
    try {
        const audio = document.getElementById(soundId);
        if (audio && audio.src) {
            audio.currentTime = 0;
            audio.play().catch(e => {
                // Silently fail if audio can't play
                console.log('Audio playback not available:', e.message);
            });
        }
    } catch (e) {
        // Silently fail
    }
}

// ========================================
// SCENE TRANSITIONS
// ========================================
function showScene(sceneId) {
    const scenes = document.querySelectorAll('.scene');

    scenes.forEach(scene => {
        scene.classList.remove('active');
    });

    setTimeout(() => {
        document.getElementById(sceneId).classList.add('active');
    }, 500);
}

// ========================================
// COLOR AND GRADIENT UPDATES
// ========================================
function updateVisuals(color, gradient) {
    const gradientBg = document.getElementById('gradientBg');
    const carBody = document.getElementById('carBody');
    const carGradient = document.getElementById('carGradient');

    // Update background gradient
    if (gradient) {
        gradientBg.style.background = gradient;
        appState.currentGradient = gradient;
    }

    // Update car color
    if (color) {
        const stops = carGradient.querySelectorAll('stop');
        stops[0].style.stopColor = color;
        stops[1].style.stopColor = adjustColor(color, 30);
        appState.currentColor = color;
    }
}

// Helper function to lighten/darken colors
function adjustColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

// ========================================
// REFLECTION TEXT UPDATE
// ========================================
function updateReflectionText(category, value) {
    const reflectionText = document.getElementById('reflectionText');
    const text = reflectiveTexts[category][value];

    reflectionText.style.animation = 'none';
    setTimeout(() => {
        reflectionText.textContent = text;
        reflectionText.style.animation = 'fadeIn 0.5s ease-in';
    }, 50);
}

// ========================================
// OPTION SELECTION LOGIC
// ========================================
function setupOptionListeners() {
    const optionButtons = document.querySelectorAll('.option-btn');

    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.closest('.category').dataset.category;
            const value = this.dataset.value;
            const color = this.dataset.color;
            const gradient = this.dataset.gradient;

            // Remove selected class from siblings
            const siblings = this.closest('.options').querySelectorAll('.option-btn');
            siblings.forEach(sib => sib.classList.remove('selected'));

            // Add selected class to this button
            this.classList.add('selected');

            // Update state
            appState.selections[category] = value;

            // Update visuals
            if (gradient) {
                updateVisuals(color, gradient);
            }

            // Update reflection text
            updateReflectionText(category, value);

            // Play click sound
            playSound('clickSound');

            // Check if all categories are selected
            checkCompletion();
        });
    });
}

// ========================================
// CHECK IF CONFIGURATION IS COMPLETE
// ========================================
function checkCompletion() {
    const { shell, engine, mode, interior } = appState.selections;
    const completeBtn = document.getElementById('completeBtn');
    const progressText = document.getElementById('progressText');

    const selectedCount = [shell, engine, mode, interior].filter(Boolean).length;

    if (selectedCount === 4) {
        completeBtn.classList.remove('hidden');
        progressText.textContent = 'Configuration complete! Generate your persona.';
    } else {
        completeBtn.classList.add('hidden');
        progressText.textContent = `${selectedCount} of 4 attributes selected`;
    }
}

// ========================================
// GENERATE RESULT
// ========================================
function generateResult() {
    const { shell, engine, mode, interior } = appState.selections;

    // Generate persona key
    const personaKey = `${shell}_${engine}_${mode}_${interior}`;
    const personaName = personaNames[personaKey] || "Model X-00: The Unique Self";

    // Generate description
    const description = generatePersonaDescription();

    // Update result scene
    document.getElementById('personaName').textContent = personaName;
    document.getElementById('specShell').textContent = capitalizeFirst(shell);
    document.getElementById('specEngine').textContent = capitalizeFirst(engine) + ' Engine';
    document.getElementById('specMode').textContent = capitalizeFirst(mode);
    document.getElementById('specInterior').textContent = capitalizeFirst(interior);
    document.getElementById('personaDescription').textContent = description;

    // Update result car color
    const resultCarGradient = document.getElementById('resultCarGradient');
    const stops = resultCarGradient.querySelectorAll('stop');
    stops[0].style.stopColor = appState.currentColor;
    stops[1].style.stopColor = adjustColor(appState.currentColor, 30);

    // Play engine sound
    playSound('engineSound');

    // Transition to result scene
    showScene('resultScene');
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ========================================
// RESET CONFIGURATION
// ========================================
function resetConfiguration() {
    // Reset state
    appState.selections = {
        shell: null,
        engine: null,
        mode: null,
        interior: null
    };
    appState.currentColor = '#888888';
    appState.currentGradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

    // Reset visuals
    updateVisuals('#888888', 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');

    // Remove all selected classes
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.classList.remove('selected'));

    // Reset reflection text
    document.getElementById('reflectionText').textContent = 'Your journey begins here...';

    // Hide complete button
    document.getElementById('completeBtn').classList.add('hidden');
    document.getElementById('progressText').textContent = 'Select your attributes';

    // Go to intro scene
    showScene('introScene');
}

// ========================================
// EVENT LISTENERS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Start button
    document.getElementById('startBtn').addEventListener('click', () => {
        showScene('configuratorScene');
        playSound('ambientSound');
    });

    // Setup option listeners
    setupOptionListeners();

    // Complete button
    document.getElementById('completeBtn').addEventListener('click', () => {
        generateResult();
    });

    // Rebuild button
    document.getElementById('rebuildBtn').addEventListener('click', () => {
        resetConfiguration();
    });

    console.log('Build Your Self - Identity Configurator Loaded');
});

// ========================================
// KEYBOARD SHORTCUTS (OPTIONAL)
// ========================================
document.addEventListener('keydown', (e) => {
    // Press 'R' to restart from result screen
    if (e.key === 'r' || e.key === 'R') {
        const resultScene = document.getElementById('resultScene');
        if (resultScene.classList.contains('active')) {
            resetConfiguration();
        }
    }

    // Press 'Escape' to go back to intro
    if (e.key === 'Escape') {
        resetConfiguration();
    }
});
