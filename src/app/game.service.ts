import { Injectable } from '@angular/core';

import { BotService } from './bot.service';
import { Player } from './player.model';

@Injectable()
export class GameService {
    private user: Player = new Player('x');
    private zangief: Player = new Player('o');
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

        return this.getBoard();
    }

    private winCheck() {
        const leftD = [];
        const rightD = [];

        for (let row = 0; row < this.board.length; row ++) {
            const col = [];

            leftD.push(this.board[row][row]);
            rightD.push(this.board[row][2 - row]);
            for (let cell = 0; cell < this.board[row].length; cell++) {
                col.push(this.board[cell][row]);
            }
            if (this.board[row].every(ele => ele === 'x') || this.board[row].every(ele => ele === 'o')) {
                if (this.user.getToken() === this.board[row][0]) {
                    this.user.wonGame();
                } else {
                    this.zangief.wonGame();
                }
                return true;
            }
            if (col.every(ele => ele === 'x') || col.every(ele => ele === 'o')) {
                if (this.user.getToken() === col[0]) {
                    this.user.wonGame();
                } else {
                    this.zangief.wonGame();
                }
                return true;
            }

        }

        if (leftD.every(ele => ele === 'x') || leftD.every(ele => ele === 'o')) {
            if (this.user.getToken() === leftD[0]) {
                this.user.wonGame();
            } else {
                this.zangief.wonGame();
            }

            return true;
        } else if (rightD.every(ele => ele === 'x') || rightD.every(ele => ele === 'o')) {
            if (this.user.getToken() === leftD[0]) {
                this.user.wonGame();
            } else {
                this.zangief.wonGame();
            }

            return true;
        }


        return false;
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
