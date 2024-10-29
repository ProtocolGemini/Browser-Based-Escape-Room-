export class Inventory {
    constructor() {
        this.items = [];
        this.element = document.getElementById('inventory');
        this.itemIcons = {
            keycard: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="40" rx="4" fill="%23fff"/><rect x="4" y="8" width="56" height="8" fill="%23000"/></svg>',
            research_notes: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M8 0h48v64H8z" fill="%23fff"/><rect x="16" y="8" width="32" height="4" fill="%23000"/><rect x="16" y="16" width="32" height="4" fill="%23000"/><rect x="16" y="24" width="32" height="4" fill="%23000"/></svg>'
        };
    }

    addItem(item) {
        this.items.push(item);
        this.updateDisplay();
    }

    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            this.updateDisplay();
            return true;
        }
        return false;
    }

    hasItem(item) {
        return this.items.includes(item);
    }

    getItems() {
        return [...this.items];
    }

    updateDisplay() {
        this.element.innerHTML = '';
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.dataset.item = item;
            itemElement.title = item.replace(/_/g, ' ').toUpperCase();
            
            // Set the background image using the icon mapping
            if (this.itemIcons[item]) {
                itemElement.style.backgroundImage = `url('${this.itemIcons[item]}')`;
                itemElement.style.backgroundSize = 'contain';
                itemElement.style.backgroundRepeat = 'no-repeat';
                itemElement.style.backgroundPosition = 'center';
            }
            
            this.element.appendChild(itemElement);
        });
    }
}