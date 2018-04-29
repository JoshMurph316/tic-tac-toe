import { Component, OnInit } from '@angular/core';

import { GameService } from '../game.service';
import { BotService } from '../bot.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  board: string[][];

  constructor(private game: GameService) { }

  ngOnInit() {
    this.board = this.game.getBoard();
  }

  onClick(tile: string) {
    this.board = this.game.userMoved(tile);
  }
}