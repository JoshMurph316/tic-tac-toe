
export class Player {
    private token: string;
    private win_count = 0;
    private last_move: string;
    private moves_made: string[];

    constructor(token: string) {
        this.token = token;
    }

    makeMove(tile: string) {
        this.last_move = tile;
    }

    switchToken() {
        this.token = this.token === 'o' ? 'x' : 'o';
    }

    getMove() {
        return this.last_move;
    }
    getToken() {
        return this.token;
    }
    gamesWon() {
        return this.win_count;
    }

    wonGame() {
        this.win_count ++;
        this.last_move = '';
        this.moves_made = [];
        console.log(this.token + ' won the round');
    }
}
