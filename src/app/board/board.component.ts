import { Component, OnInit } from '@angular/core';

import { BotService } from '../bot.service';
import { Player } from '../player.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  user: Player = new Player('x');
  bot: Player = new Player('o');
  winner: boolean;
  result: string;
  move_count = 0;
  board = [
    ['TL', 'TM', 'TR'],
    ['ML', 'MM', 'MR'],
    ['BL', 'BM', 'BR']
];

  constructor(private botService: BotService) {}

  onClick(tile: string) {

    this.updateBoard(this.user.getToken(), tile);

      if (this.winCheck()) {
        this.result = 'win';
        this.resetBoard();
      } else {
        this.botMove();
        if (this.winCheck()) {
          this.result = 'lost';
          this.resetBoard();
        }
      }

      if (this.move_count >= 9) {
        this.result = 'draw';
        this.resetBoard();
    }
  }

  private botMove() {
    const bot_move = this.botService.getMove(this.board, this.bot.getToken());
    this.updateBoard(this.bot.getToken(), bot_move);
  }

  private updateBoard(token: string, move: string) {
    this.move_count ++;
    console.log(this.move_count);
    for (let row = 0; row < this.board.length; row++) {
        for (let cell = 0; cell < this.board[row].length; cell++) {
            if (this.board[row][cell] === move) {
                this.board[row][cell] = token;
            }
        }
    }
  }

  private winCheck() {
    const leftD = [];
    const rightD = [];
    let check_result = false;

    const rowCheck = row => row.every(ele => ele === 'x') || row.every(ele => ele === 'o');
    const setWinner = token => this.winner  = this.user.getToken() === token;

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

  private resetBoard() {
    this.move_count = 0;
    this.winner = false;
    this.board = [['TL', 'TM', 'TR'], ['ML', 'MM', 'MR'], ['BL', 'BM', 'BR']];
    this.user.switchToken();
    this.bot.switchToken();

    if (this.bot.getToken() === 'x') {
      this.botMove();
    }
    setTimeout(() => this.result = '' , 500);
  }

}
