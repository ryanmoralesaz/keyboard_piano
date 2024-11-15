Things I need to add
> Pitch change mechanism
```js
// Assuming you have an AudioContext instance
let audioContext = new AudioContext();

// Load your WAV file
fetch('path/to/yourfile.wav')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
    // Create a buffer source
    let source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Lower the pitch by one octave
    source.playbackRate.value = 0.5;

    // Connect to the audio context
    source.connect(audioContext.destination);

    // Start playing
    source.start();
  });
```

youtube video claire de lune
https://www.youtube.com/watch?v=ogAP1fUqERk