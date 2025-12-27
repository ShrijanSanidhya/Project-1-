export const speak = (text) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        // Optional: Customization
        // utterance.pitch = 1;
        // utterance.rate = 1;
        // const voices = window.speechSynthesis.getVoices();
        // utterance.voice = voices.find(voice => voice.name.includes('Google US English')); 

        window.speechSynthesis.speak(utterance);
    } else {
        console.error('Text-to-speech not supported.');
    }
};
