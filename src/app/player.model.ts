
export class Player {
    private token: string;
    private win_count = 0;
    private loss_count: number;
    private games_played: number;
    private last_move: string;
    private moves_made: string[];

    constructor(token: string) {
        this.token = token;
    }

    switchToken() {
        this.token = this.token === 'o' ? 'x' : 'o';
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
    }
}
