import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { GameService } from './game.service';
import { BotService } from './bot.service';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GameService, BotService],
  bootstrap: [AppComponent]
})
export class AppModule { }
