import { Injectable } from '@angular/core';

import { BotService } from './bot.service';
import { Player } from './player.model';

@Injectable()
export class GameService {
    private user: Player = new Player('x');
    private zangief: Player = new Player('o');
    private winning_row: string[];
    private move_count = 0;
    private board = [
        ['TL', 'TM', 'TR'],
        ['ML', 'MM', 'MR'],
        ['BL', 'BM', 'BR']
    ];
    constructor(private bot: BotService) {}

    getBoard() {
        return this.board.slice();
    }
    getWinningRow() {
        return this.winning_row;
    }

    userMoved(tile: string) {

        this.updateBoard(this.user.getToken(), tile);
        this.move_count ++;

        if (this.winCheck()) {
            this.resetBoard();
        } else {
            const move  = this.bot.getMove(this.board, this.zangief.getToken());
            this.updateBoard(this.zangief.getToken(), move);
            if (this.winCheck()) {
                this.resetBoard();
            }
        }

        if (this.move_count >= 5) {
            this.resetBoard();
        }

    }

    private winCheck() {
        const leftD = [];
        const rightD = [];
        let check_result = false;

        const rowCheck = row => row.every(ele => ele === 'x') || row.every(ele => ele === 'o');
        const setWinner = token => this.user.getToken() === token ? this.user.wonGame() : this.zangief.wonGame() ;

        function check(row: string[]) {
            if (rowCheck(row)) {
                check_result = true;
                setWinner(row[0]);
            }
        }

        for (let row = 0; row < this.board.length; row ++) {
            const col = [];

            leftD.push(this.board[row][row]);
            rightD.push(this.board[row][2 - row]);
            this.board[row].forEach((ele, cell) => col.push(this.board[cell][row]));

            check(this.board[row]);
            check(col);
        }

        check(leftD);
        check(rightD);

        return check_result;
    }

    private updateBoard(token: string, move: string) {
        for (let row = 0; row < this.board.length; row++) {
            for (let cell = 0; cell < this.board[row].length; cell++) {
                if (this.board[row][cell] === move) {
                    this.board[row][cell] = token;
                }
            }
        }
    }

    private resetBoard() {
        this.move_count = 0;
        this.board = [['TL', 'TM', 'TR'], ['ML', 'MM', 'MR'], ['BL', 'BM', 'BR']];
        this.user.switchToken();
        this.zangief.switchToken();

        if (this.zangief.getToken() === 'x') {
            const move  = this.bot.getMove(this.board, this.zangief.getToken());
            this.updateBoard(this.zangief.getToken(), move);
        }
    }

}
