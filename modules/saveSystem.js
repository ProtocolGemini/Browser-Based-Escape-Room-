export class SaveSystem {
    constructor(game) {
        this.game = game;
    }

    save() {
        const saveData = {
            inventory: Array.from(this.game.inventory.items.entries()),
            currentRoom: this.game.roomManager.currentRoom.name,
            solvedPuzzles: Array.from(this.game.state.state.solvedPuzzles),
            timestamp: Date.now()
        };

        localStorage.setItem('escapeRoomSave', JSON.stringify(saveData));
    }

    load() {
        const saveData = localStorage.getItem('escapeRoomSave');
        if (!saveData) return false;

        const data = JSON.parse(saveData);
        
        // Clear current inventory
        this.game.inventory.items.clear();
        
        // Restore inventory
        data.inventory.forEach(([key, value]) => {
            this.game.inventory.items.set(key, value);
        });
        
        // Restore room
        this.game.roomManager.loadRoom(data.currentRoom);
        
        // Restore puzzles
        this.game.state.state.solvedPuzzles = new Set(data.solvedPuzzles);
        
        this.game.inventory.updateDisplay();
        return true;
    }
}