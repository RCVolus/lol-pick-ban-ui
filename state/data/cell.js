class Cell {
    constructor(id, spell1, spell2, champion) {
        this.id = id;
        this.spells = [spell1, spell2];
        this.champion = champion;
    }
}

export default Cell;