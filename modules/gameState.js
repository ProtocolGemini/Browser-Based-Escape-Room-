export class GameState {
    constructor() {
        this.state = {
            currentRoom: 'lab',
            inventory: [],
            solvedPuzzles: new Set(),
            variables: new Map(),
            timeStarted: Date.now()
        };
    }

    save() {
        localStorage.setItem('gameState', JSON.stringify({
            ...this.state,
            solvedPuzzles: Array.from(this.state.solvedPuzzles),
            variables: Array.from(this.state.variables.entries())
        }));
    }

    load() {
        const saved = JSON.parse(localStorage.getItem('gameState'));
        if (saved) {
            this.state = {
                ...saved,
                solvedPuzzles: new Set(saved.solvedPuzzles),
                variables: new Map(saved.variables)
            };
            return true;
        }
        return false;
    }

    setVariable(key, value) {
        this.state.variables.set(key, value);
    }

    getVariable(key) {
        return this.state.variables.get(key);
    }

    addToInventory(item) {
        this.state.inventory.push(item);
    }

    removeFromInventory(item) {
        const index = this.state.inventory.indexOf(item);
        if (index > -1) {
            this.state.inventory.splice(index, 1);
        }
    }

    hasItem(item) {
        return this.state.inventory.includes(item);
    }

    solvePuzzle(puzzleId) {
        this.state.solvedPuzzles.add(puzzleId);
    }

    isPuzzleSolved(puzzleId) {
        return this.state.solvedPuzzles.has(puzzleId);
    }
}