export class Parser {
    constructor(game) {
        this.game = game;
        this.commands = {
            look: this.look.bind(this),
            examine: this.examine.bind(this),
            take: this.take.bind(this),
            use: this.use.bind(this),
            inventory: this.inventory.bind(this),
            go: this.go.bind(this)
        };
    }

    parse(input) {
        const [command, ...args] = input.toLowerCase().split(' ');
        const action = this.commands[command];
        
        if (action) {
            action(args.join(' '));
        } else {
            this.game.displayMessage("I don't understand that command.");
        }
    }

    look() {
        const description = this.game.getCurrentRoom().getDescription();
        this.game.displayMessage(description);
    }

    examine(target) {
        if (target === 'research_notes' && this.game.inventory.hasItem('research_notes')) {
            this.showClassifiedDocument();
            return;
        }

        const room = this.game.getCurrentRoom();
        if (room.examine[target]) {
            this.game.displayMessage(room.examine[target]);
        } else {
            this.game.displayMessage("There's nothing special about that.");
        }
    }

    showClassifiedDocument() {
        const popup = document.createElement('div');
        popup.className = 'classified-popup';
        
        popup.innerHTML = `
            <div class="coffee-stain"></div>
            <div class="coffee-stain"></div>
            <div class="file-tab">FILE: ECHO-7</div>
            <div class="paperclip"></div>
            <button class="close-button">×</button>
            <div class="classified-header">
                <div class="document-number">DOC: 7734-ECHO-1970</div>
                <h2>CLASSIFIED DOCUMENT</h2>
            </div>
            <div class="document-content">
                <p><strong>Project ECHO - Interim Report Summary</strong></p>
                <p><strong>[REDACTED]</strong></p>
                <p>Date: <span data-redacted>[REDACTED]</span></p>
                <p>Subject: Ethereal Caustic Hyperfrequency Object (ECHO)</p>
                <p>The purpose of this document is to provide a comprehensive overview of ongoing activities under the auspices of Project ECHO. Initial findings suggest remarkable potential in the utilization of hyperfrequency oscillations to interact with non-corporeal entities and dimensions. Our principal investigators, Dr. <span data-redacted>[REDACTED]</span> and Dr. <span data-redacted>[REDACTED]</span>, report significant advances in harnessing hyperfrequencies to achieve controlled interface with ethereal phenomena.</p>
                <p>Noteworthy Incident: On <span data-redacted>[REDACTED]</span>, an unforeseen escalation in hyperfrequency output caused a temporary destabilization, substantiating theoretical models while highlighting inherent risks. All personnel are advised to exercise extreme caution and adhere to updated safety protocols (see Appendix C-4).</p>
                <p>The imperative secrecy surrounding Project ECHO mandates that all discoveries remain confined to authorized personnel only. Unauthorized dissemination of information is subject to immediate disciplinary action under Code <span data-redacted>[REDACTED]</span>.</p>
                <p>Further research is necessary to validate the viability of secure interaction methods. Next steps will focus on refining stabilization frameworks and fail-safe countermeasures. Comprehensive findings are anticipated upon phase conclusion.</p>
                <p><strong>END OF REPORT</strong></p>
                <p><strong>[REDACTED]</strong></p>
            </div>
        `;

        // Add close button functionality
        popup.querySelector('.close-button').addEventListener('click', () => {
            popup.remove();
        });

        // Add escape key functionality
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                popup.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        document.body.appendChild(popup);
    }

    take(item) {
        const room = this.game.getCurrentRoom();
        const takenItem = room.takeItem(item);
        
        if (takenItem) {
            this.game.inventory.addItem(takenItem);
            this.game.displayMessage(`Taken: ${item}`);
        } else {
            this.game.displayMessage("You can't take that.");
        }
    }

    use(item) {
        const room = this.game.getCurrentRoom();
        if (item === 'mainframe') {
            const code = prompt('Enter the access code:');
            if (code === room.puzzles.mainframe.solution) {
                room.puzzles.mainframe.solved = true;
                this.game.displayMessage('ACCESS GRANTED. Hallway security doors unlocked.');
                this.game.state.solvePuzzle('mainframe');
            } else {
                this.game.displayMessage('ACCESS DENIED. Invalid code.');
            }
            return;
        }
        
        if (room.puzzles && room.puzzles[item]) {
            this.game.displayMessage(`Using: ${item}`);
        } else {
            this.game.displayMessage("You can't use that here.");
        }
    }

    inventory() {
        const items = this.game.inventory.getItems();
        if (items.length > 0) {
            this.game.displayMessage(`You are carrying: ${items.join(', ')}`);
        } else {
            this.game.displayMessage('You are not carrying anything.');
        }
    }

    go(direction) {
        const room = this.game.getCurrentRoom();
        if (direction === 'server_room' || direction === 'archives') {
            if (!this.game.state.isPuzzleSolved('mainframe')) {
                this.game.displayMessage('The security doors are locked. You need to unlock them first.');
                return;
            }
        }
        
        if (room.exits.includes(direction)) {
            const description = this.game.roomManager.loadRoom(direction);
            this.game.displayMessage(description);
        } else {
            this.game.displayMessage("You can't go that way.");
        }
    }
}