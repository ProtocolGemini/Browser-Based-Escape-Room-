export class RoomManager {
    constructor(game) {
        this.game = game;
        this.currentRoom = null;
        this.rooms = {
            lab: {
                name: 'Research Laboratory',
                description: 'A dimly lit laboratory filled with vintage computer equipment and mysterious research apparatus. A large mainframe computer blinks steadily in the corner.',
                items: ['keycard', 'research_notes'],
                exits: ['hallway'],
                examine: {
                    mainframe: 'A CDC 6600 mainframe computer. The screen displays: "ENTER ACCESS CODE:"',
                    desk: 'A wooden desk with several drawers. One is slightly ajar.',
                    research_notes: `**CLASSIFIED DOCUMENT**

**Project ECHO - Interim Report Summary**

**[REDACTED]**

Date: [REDACTED]

Subject: Ethereal Caustic Hyperfrequency Object (ECHO)

The purpose of this document is to provide a comprehensive overview of ongoing activities under the auspices of Project ECHO. Initial findings suggest remarkable potential in the utilization of hyperfrequency oscillations to interact with non-corporeal entities and dimensions. Our principal investigators, Dr. [REDACTED] and Dr. [REDACTED], report significant advances in harnessing hyperfrequencies to achieve controlled interface with ethereal phenomena.

Noteworthy Incident: On [REDACTED], an unforeseen escalation in hyperfrequency output caused a temporary destabilization, substantiating theoretical models while highlighting inherent risks. All personnel are advised to exercise extreme caution and adhere to updated safety protocols (see Appendix C-4).

The imperative secrecy surrounding Project ECHO mandates that all discoveries remain confined to authorized personnel only. Unauthorized dissemination of information is subject to immediate disciplinary action under Code [REDACTED].

Further research is necessary to validate the viability of secure interaction methods. Next steps will focus on refining stabilization frameworks and fail-safe countermeasures. Comprehensive findings are anticipated upon phase conclusion.

**END OF REPORT**

**[REDACTED]**`
                },
                interactives: [
                    {
                        id: 'mainframe',
                        type: 'terminal',
                        x: 60,
                        y: 30,
                        width: 128,
                        height: 192,
                        className: 'interactive terminal'
                    },
                    {
                        id: 'keycard',
                        type: 'keycard',
                        x: 30,
                        y: 70,
                        width: 64,
                        height: 64,
                        className: 'interactive keycard'
                    },
                    {
                        id: 'research_notes',
                        type: 'document',
                        x: 20,
                        y: 40,
                        width: 64,
                        height: 64,
                        className: 'interactive document'
                    }
                ],
                puzzles: {
                    mainframe: {
                        solved: false,
                        solution: '53815',
                        hint: 'Look at the research notes carefully. The key might be in the project name...'
                    }
                },
                getDescription() {
                    return this.description;
                },
                getHint() {
                    const unsolved = Object.entries(this.puzzles)
                        .find(([, puzzle]) => !puzzle.solved);
                    return unsolved ? unsolved[1].hint : "There's nothing more to solve here.";
                },
                takeItem(item) {
                    const index = this.items.indexOf(item);
                    if (index > -1) {
                        this.items.splice(index, 1);
                        // Remove the interactive element when item is taken
                        const element = document.querySelector(`[data-id="${item}"]`);
                        if (element) {
                            element.remove();
                        }
                        return item;
                    }
                    return null;
                }
            },
            hallway: {
                name: 'Hallway',
                description: 'A long, dimly lit corridor with flickering fluorescent lights. Doors line both sides.',
                items: [],
                exits: ['lab', 'server_room', 'archives'],
                examine: {
                    lights: 'The fluorescent lights buzz and flicker ominously.',
                    doors: 'Several doors, each marked with different department names.'
                },
                interactives: [],
                getDescription() {
                    return this.description;
                },
                getHint() {
                    return "Try examining the doors or lights for clues.";
                },
                takeItem(item) {
                    const index = this.items.indexOf(item);
                    if (index > -1) {
                        this.items.splice(index, 1);
                        return item;
                    }
                    return null;
                }
            }
        };
        this.loadRoom('lab');
    }

    getCurrentRoom() {
        return this.currentRoom;
    }

    getCurrentRoomDescription() {
        return this.currentRoom.getDescription();
    }

    showTerminalPopup() {
        const popup = document.createElement('div');
        popup.className = 'terminal-popup';
        
        popup.innerHTML = `
            <div class="terminal-header">CDC 6600 MAINFRAME</div>
            <div class="terminal-content">
                <div>SECURITY SYSTEM ACTIVE</div>
                <div>ENTER ACCESS CODE:</div>
                <input type="text" class="terminal-input" maxlength="10" autocomplete="off">
                <div class="terminal-error"></div>
                <div class="terminal-buttons">
                    <button class="terminal-button" data-action="submit">SUBMIT</button>
                    <button class="terminal-button" data-action="cancel">CANCEL</button>
                </div>
            </div>
        `;

        const input = popup.querySelector('.terminal-input');
        const error = popup.querySelector('.terminal-error');
        
        const handleSubmit = () => {
            const code = input.value.trim();
            if (code === this.currentRoom.puzzles.mainframe.solution) {
                this.currentRoom.puzzles.mainframe.solved = true;
                this.game.displayMessage('ACCESS GRANTED. Hallway security doors unlocked.');
                this.game.state.solvePuzzle('mainframe');
                popup.remove();
            } else {
                error.textContent = 'ACCESS DENIED. Invalid code.';
                input.value = '';
            }
        };

        popup.querySelector('[data-action="submit"]').addEventListener('click', handleSubmit);
        popup.querySelector('[data-action="cancel"]').addEventListener('click', () => popup.remove());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSubmit();
            }
        });

        document.body.appendChild(popup);
        input.focus();
    }

    setupRoomVisuals() {
        const roomView = document.getElementById('room-view');
        roomView.innerHTML = '';
        
        const roomElement = document.createElement('div');
        roomElement.className = `room ${this.currentRoom.name.toLowerCase().replace(/\s+/g, '_')} room-transition`;
        
        const helpBox = document.createElement('div');
        helpBox.className = 'help-box';
        helpBox.innerHTML = `
            <h3>Commands</h3>
            <ul>
                <li><code>look</code> - Examine the room</li>
                <li><code>examine [object]</code> - Look at something closely</li>
                <li><code>take [item]</code> - Pick up an item</li>
                <li><code>use [item]</code> - Use an item</li>
                <li><code>inventory</code> - Check your items</li>
                <li><code>go [direction]</code> - Move to another room</li>
            </ul>
            <h3>How to Play</h3>
            <p>Type commands in the terminal below to interact with the environment. Click objects to examine them. Collect items and solve puzzles to escape the facility.</p>
        `;
        roomElement.appendChild(helpBox);
        
        if (this.currentRoom.interactives) {
            this.currentRoom.interactives.forEach(item => {
                const interactive = document.createElement('div');
                interactive.className = item.className || `interactive ${item.type}`;
                interactive.style.left = `${item.x}%`;
                interactive.style.top = `${item.y}%`;
                interactive.style.width = `${item.width}px`;
                interactive.style.height = `${item.height}px`;
                interactive.dataset.id = item.id;
                
                interactive.addEventListener('click', () => {
                    this.handleInteraction(item.id);
                });
                
                roomElement.appendChild(interactive);
            });
        }
        
        roomView.appendChild(roomElement);
    }

    handleInteraction(itemId) {
        const room = this.currentRoom;
        
        if (itemId === 'mainframe') {
            this.showTerminalPopup();
            return;
        }

        // If it's an item that can be taken
        if (room.items.includes(itemId)) {
            this.game.parser.take(itemId);
            return;
        }
        
        // For other interactions (examining objects)
        if (room.examine[itemId]) {
            this.game.displayMessage(room.examine[itemId]);
        }
    }

    loadRoom(roomId) {
        if (this.rooms[roomId]) {
            this.currentRoom = this.rooms[roomId];
            this.setupRoomVisuals();
            return this.currentRoom.getDescription();
        }
        return 'Error: Room not found';
    }
}