import { RoomManager } from './roomManager.js';
import { Parser } from './parser.js';
import { Inventory } from './inventory.js';
import { GameState } from './gameState.js';

export class Game {
    constructor() {
        this.state = new GameState();
        this.inventory = new Inventory();
        this.roomManager = new RoomManager(this);
        this.parser = new Parser(this);
        this.commandHistory = document.getElementById('command-history');
        this.init();
    }

    init() {
        this.setupInputHandler();
        this.setupHintSystem();
        this.displayMessage(this.roomManager.getCurrentRoomDescription());
    }

    setupInputHandler() {
        const input = document.getElementById('command-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                const command = input.value.trim();
                this.parser.parse(command);
                input.value = '';
            }
        });
    }

    setupHintSystem() {
        const hintButton = document.getElementById('hint-button');
        hintButton.addEventListener('click', () => {
            const hint = this.roomManager.getCurrentRoom().getHint();
            this.displayMessage(`Hint: ${hint}`);
        });
    }

    displayMessage(message) {
        const entry = document.createElement('div');
        entry.textContent = `> ${message}`;
        this.commandHistory.appendChild(entry);
        this.commandHistory.scrollTop = this.commandHistory.scrollHeight;
    }

    getCurrentRoom() {
        return this.roomManager.getCurrentRoom();
    }
}