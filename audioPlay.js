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

// Create a mapping for keys to note IDs
const keyToNoteId = {
  z: "gSharp2",
  a: "a2",
  q: "aSharp2",
  v: "b2",
  s: "c3",
  w: "cSharp3",
  d: "d3",
  e: "dSharp3",
  f: "e3",
  b: "f3",
  g: "fSharp3",
  r: "g3",
  t: "gSharp3",
  ";": "a3",
  p: "aSharp3",
  m: "b3",
  l: "c4",
  o: "cSharp4",
  k: "d4",
  i: "dSharp4",
  j: "e4",
  n: "f4",
  h: "fSharp4",
  u: "g4",
  y: "gSharp4",
};

notes.forEach((note) => {
  [2, 3, 4].forEach((octave) => {
    const audioEl = document.createElement("audio");
    audioEl.id = `${note}${octave}`;
    audioEl.src = `./sound_assets/${note}_${octave}_elec_guitar.wav`;
    audioEl.preload = "auto";
    document.body.appendChild(audioEl);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  let keysCurrentlyPressed = {};
  document.addEventListener("keydown", (e) => {
    if (keysCurrentlyPressed[e.key] || !keyToNoteId[e.key]) {
      return;
    }

    const noteId = keyToNoteId[e.key];
    const audioEl = document.getElementById(noteId);

    console.log(`Key pressed: ${e.key}, Note: ${noteId}`);

    if (audioEl) {
      audioEl.currentTime = 0;
      audioEl.play();
    }
    keysCurrentlyPressed[e.key] = true;
  });

  document.addEventListener("keyup", (e) => {
    keysCurrentlyPressed[e.key] = false;
  });
});
