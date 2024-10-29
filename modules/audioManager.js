export class AudioManager {
    constructor() {
        this.sounds = new Map();
        this.music = null;
        this.isMuted = false;
    }

    init() {
        this.loadSound('ambient', 'data:audio/mp3;base64,...'); // Base64 ambient sound
        this.loadSound('beep', 'data:audio/mp3;base64,...'); // Base64 computer beep
        this.loadSound('door', 'data:audio/mp3;base64,...'); // Base64 door sound
        this.playAmbient();
    }

    loadSound(name, base64) {
        const audio = new Audio(base64);
        this.sounds.set(name, audio);
    }

    playSound(name) {
        if (this.isMuted) return;
        const sound = this.sounds.get(name);
        if (sound) {
            sound.currentTime = 0;
            sound.play();
        }
    }

    playAmbient() {
        const ambient = this.sounds.get('ambient');
        if (ambient) {
            ambient.loop = true;
            ambient.volume = 0.3;
            ambient.play();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.sounds.forEach(sound => {
            sound.muted = this.isMuted;
        });
    }
}