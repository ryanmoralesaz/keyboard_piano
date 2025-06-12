/**
 * audioPlay.js
 *
 * Handles the creation of audio elements and plays piano notes based on keyboard input.
 * Switches mappings based on selected keyboard layout.
 * Provides functionality to translate sheet music to keys based on current layout.
 */

// Define the available notes
const notes = [
    "a",
    "aSharp",
    "b",
    "c",
    "cSharp",
    "d",
    "dSharp",
    "e",
    "f",
    "fSharp",
    "g",
    "gSharp",
];

// Standard keyboard mapping (AutoHotkey OFF)
const standardKeyToNoteId = {
    z: "gSharp2",
    a: "a2",
    q: "aSharp2",
    v: "b2",
    s: "c3",
    w: "cSharp3",
    d: "d3",
    e: "dSharp3",
    f: "f3",
    b: "e3",
    r: "fSharp3",
    g: "g3",
    t: "gSharp3",
    "/":"gSharp3",
    ";": "a3",
    p: "aSharp3",
    m: "b3",
    l: "c4",
    o: "cSharp4",
    k: "d4",
    i: "dSharp4",
    j: "f4",
    n: "e4",
    u: "fSharp4",
    h: "g4",
    y: "gSharp4",
};

// Custom keyboard mapping (AutoHotkey ON)
const customKeyToNoteId = {
    "'": "gSharp2",
    a: "a2",
    ";": "aSharp2",
    k: "b2",
    o: "c3",
    ",": "cSharp3",
    e: "d3",
    ".": "dSharp3",
    u: "f3",
    x: "e3",
    p: "fSharp3",
    i: "g3",
    y: "gSharp3",
    "/": "gSharp3",
    s: "a3",
    l: "aSharp3",
    m: "b3",
    n: "c4",
    r: "cSharp4",
    t: "d4",
    c: "dSharp4",
    b: "e4",
    h: "f4",
    g: "fSharp4",
    d: "g4",
    f: "gSharp4",
};

// Current keyboard mapping (default is standard)
let currentKeyToNoteId = { ...standardKeyToNoteId };

// Cache for audio elements
const audioElements = {};

// Create audio elements for each note and octave
notes.forEach((note) => {
    [2, 3, 4].forEach((octave) => {
        const noteId = `${note}${octave}`;
        const audioEl = document.createElement("audio");
        audioEl.id = noteId;
        audioEl.src = `./sound_assets/${note}_${octave}_elec_guitar.wav`;
        audioEl.preload = "auto";
        document.body.appendChild(audioEl);
        audioElements[noteId] = audioEl;
    });
});

// Updates the current keyboard layout mapping
function updateKeyboardLayout(layout) {
    if (layout === 'standard') {
        currentKeyToNoteId = { ...standardKeyToNoteId };
        document.getElementById('currentLayout').innerText = 'Standard';
    } else if (layout === 'custom') {
        currentKeyToNoteId = { ...customKeyToNoteId };
        document.getElementById('currentLayout').innerText = 'Custom';
    }
    console.log(`Keyboard layout switched to: ${layout}`);
}

/**
 * Translates sheet music input into keys to press based on the current keyboard layout.
 * Handles both individual notes and chords.
 * @param {Array<string>} sheetMusic - Array of note IDs and chords.
 * @returns {Array<string | Array<string>>} - Array of keys to press or arrays of keys for chords.
 */
function translateSheetMusicToKeys(sheetMusic) {
    const noteIdToKey = {};
    for (const [key, noteId] of Object.entries(currentKeyToNoteId)) {
        noteIdToKey[noteId] = key;
    }

    const translatedKeys = [];

    sheetMusic.forEach(item => {
        if (item.includes('+')) {
            // Handle chord
            const chordNotes = item.split('+');
            const chordKeys = chordNotes.map(noteId => {
                const key = noteIdToKey[noteId];
                if (key) {
                    return key;
                } else {
                    console.warn(`No key mapping found for note '${noteId}' in the current layout.`);
                    return null;
                }
            });
            translatedKeys.push(chordKeys);
        } else {
            // Handle single note
            const noteId = item;
            const key = noteIdToKey[noteId];
            if (key) {
                translatedKeys.push(key);
            } else {
                console.warn(`No key mapping found for note '${noteId}' in the current layout.`);
                translatedKeys.push(null);
            }
        }
    });

    return translatedKeys;
}

document.addEventListener("DOMContentLoaded", () => {
    // Handle layout toggle
    const layoutRadios = document.getElementsByName('keyboardLayout');
    layoutRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            updateKeyboardLayout(e.target.value);
        });
    });

    // Key press handling
    let keysCurrentlyPressed = {};

    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        if (keysCurrentlyPressed[key] || !currentKeyToNoteId[key]) {
            return;
        }

        const noteId = currentKeyToNoteId[key];
        const audioEl = audioElements[noteId];

        console.log(`Key pressed: '${key}', Note: '${noteId}'`);

        if (audioEl) {
            audioEl.currentTime = 0;
            audioEl.play().catch(error => {
                console.error(`Failed to play ${noteId}:`, error);
            });
        } else {
            console.warn(`Audio element for '${noteId}' not found.`);
        }

        keysCurrentlyPressed[key] = true;
    });

    document.addEventListener("keyup", (e) => {
        const key = e.key.toLowerCase();
        keysCurrentlyPressed[key] = false;
    });

    // Handle sheet music translation
    document.getElementById('translateButton').addEventListener('click', () => {
        const input = document.getElementById('sheetMusicInput').value.trim();
        if (!input) {
            alert('Please enter some sheet music notes.');
            return;
        }

        // Split input by spaces to get notes and chords
        const sheetMusic = input.split(/\s+/);

        // Validate notes and chords
        const validNoteIds = new Set();
        for (const note of notes) {
            [2, 3, 4].forEach(octave => validNoteIds.add(`${note}${octave}`));
        }

        const invalidItems = [];
        sheetMusic.forEach(item => {
            const notesInItem = item.split('+');
            notesInItem.forEach(noteId => {
                if (!validNoteIds.has(noteId)) {
                    invalidItems.push(noteId);
                }
            });
        });

        if (invalidItems.length > 0) {
            alert(`Invalid note IDs: ${invalidItems.join(', ')}`);
            return;
        }

        const keysToPlay = translateSheetMusicToKeys(sheetMusic);

        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';

        // Collect keys to display
        const keysOutput = [];

        keysToPlay.forEach((item) => {
            if (Array.isArray(item)) {
                // This is a chord
                const keys = item.filter(k => k !== null).join('+');
                keysOutput.push(keys);
            } else if (item) {
                // Single note
                keysOutput.push(item);
            } else {
                keysOutput.push('N/A');
            }
        });

        const outputText = keysOutput.join(' ');
        outputDiv.textContent = outputText;
    });
});
