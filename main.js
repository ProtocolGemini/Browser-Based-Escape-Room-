import { Game } from './modules/game.js';
import './style.css';

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});