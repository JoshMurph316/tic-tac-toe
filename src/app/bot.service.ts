import { Injectable } from '@angular/core';

@Injectable()
export class BotService {
    private open_spots: string[][];
    private attack = 'Cyclone Lariat';
    private hot_spot = 'TL';
    private opponent = 'o';
    private player = 'x' ;
    private won_last = false;
    private turn = 0;

    // needs *pick any open_spot function
    getMove(board: string[][], token: string) {
        this.open_spots = board;
        this.setUpGame(token);

        if (!this.winCheck()) {
            this.attackSequence();
        }

        return this.hot_spot;
    }

    private attackSequence() {
        if (this.player === 'x') {
            if (this.attack === 'Cyclone Lariat') {
                this.cycloneLariat();
            } else {
                this.siberianExpress();
            }
        } else {
            this.guard();
        }
    }

    private cycloneLariat() {
        switch (this.turn) {
            case 1:
                this.hot_spot = 'TL';
                break;
            case 2:
                if (this.open_spots[1][1] === 'MM') {
                    if (this.open_spots[0].includes('o')) {
                        this.hot_spot = 'BL';
                    } else {
                        this.hot_spot = 'TR';
                    }
                } else if (this.open_spots[2][2] === 'BR') {
                    this.hot_spot = 'BR';
                } else {
                    this.hot_spot = 'BL';
                }
                break;
        }
    }

    private siberianExpress() {
        switch (this.turn) {
            case 1:
                this.hot_spot = 'MM';
                break;
            case 2:
                if (this.cornersEmpty()) {
                    if (this.calcCellValue(0, 0) === 1) {
                        this.hot_spot = 'TL';
                    } else {
                        this.hot_spot = 'BR';
                    }
                } else {
                    if (this.open_spots[2][2] === this.opponent) {
                        this.hot_spot = 'TL';
                    } else if (this.open_spots[0][0] === this.opponent) {
                        this.hot_spot = 'BR';
                    } else if (this.open_spots[0][2] === this.opponent) {
                        this.hot_spot = 'BL';
                    } else {
                        this.hot_spot = 'TR';
                    }
                }
                break;
            case 3:
                if (this.winCheck()) {
                    break;
                } else if (this.sidesEmpty()) {
                    this.guard();
                } else {
                    if (this.calcCellValue(0, 0) >= 1) {
                        this.hot_spot = 'TL';
                    } else if (this.calcCellValue(2, 2) >= 1) {
                        this.hot_spot = 'BR';
                    } else if (this.calcCellValue(2, 0) >= 1) {
                        this.hot_spot = 'BL';
                    } else {
                        this.hot_spot = 'TR';
                    }
                }
                break;
        }
    }

    private guard() {
        switch (this.turn) {
            case 1:
                if (!this.sidesEmpty()) {
                    if (this.open_spots[0].includes('o')) {
                        this.hot_spot = 'TL';
                    } else {
                        this.hot_spot = 'BL';
                    }
                } else if (this.open_spots[1][1] === 'MM') {
                    this.hot_spot = 'MM';
                } else if (this.open_spots[2][2] === 'BR') {
                    this.hot_spot = 'BR';
                } else {
                    this.hot_spot = 'BL';
                }
                break;
            case 2:
                if (this.open_spots[2][2] === 'BR') {
                    this.hot_spot = 'BR';
                } else {
                    this.hot_spot = 'BL';
                }
                break;
            default:
            if (this.open_spots[1][0] === 'ML') {
                this.hot_spot = 'ML';
            } else {
                this.hot_spot = 'TM';
            }
        }
    }

    private winCheck() {
        let found = false;

        for (let row = 0; row < this.open_spots.length; row++) {
            for (let cell = 0; cell < this.open_spots[row].length; cell++) {
                const current_cell = this.open_spots[row][cell];

                if (current_cell.length === 2) {
                    const cell_val = this.calcCellValue(row, cell);

                    // console.log('current cell: ' + current_cell);
                    // console.log('value: ' + cell_val);

                    if (cell_val >= 2) {
                        this.hot_spot = current_cell;
                        this.won_last = true;
                        return true;
                    } else if (cell_val <= -2 && !found) {
                        this.hot_spot = current_cell;
                        found = true;
                    }

                }
            }

        }

        return found;
    }

    private cornersEmpty() {
        for (let i = 0; i < this.open_spots.length; i += 2) {
            if (this.open_spots[i][2 - i].length === 1 || this.open_spots[i][i].length === 1) {
                return false;
            }
        }
        return true;
    }

    private sidesEmpty() {
        for (let i = 0; i <= 1; i++) {
            if (this.open_spots[i][i + 1].length === 1 || this.open_spots[i + 1][i].length === 1) {
                return false;
            }
        }
        return true;
    }

    private calcCellValue(row: number, cell: number) {
        let row_value = 0;
        let col_value = 0;
        let dag_value = 0;

        for (let i = 0; i < this.open_spots.length; i++) {
            switch (this.open_spots[row][cell]) {
                case 'TL':
                case 'BR':
                    if (this.open_spots[i][i] === this.player) {
                        dag_value += 1;
                    } else if (this.open_spots[i][i] === this.opponent) {
                        dag_value -= 1;
                    }

                    break;
                case 'TR':
                case 'BL':
                    if (this.open_spots[2 - i][i] === this.player) {
                        dag_value += 1;
                    } else if (this.open_spots[2 - i][i] === this.opponent) {
                        dag_value -= 1;
                    }

                    break;
                case 'MM':
                    if (this.open_spots[2 - i][i] === this.player) {
                        dag_value += 1;
                    } else if (this.open_spots[2 - i][i] === this.opponent) {
                        dag_value -= 1;
                    } else if (this.open_spots[i][i] === this.player) {
                        dag_value += 1;
                    } else if (this.open_spots[i][i] === this.opponent) {
                        dag_value -= 1;
                    }

                    break;
            }
            if (this.open_spots[i][cell] === this.player) {
                col_value += 1;
            } else if (this.open_spots[i][cell] === this.opponent) {
                col_value -= 1;
            }
            if (this.open_spots[row][i] === this.player) {
                row_value += 1;
            } else if (this.open_spots[row][i] === this.opponent) {
                row_value -= 1;
            }
        }

        if (Math.abs(row_value) >= Math.abs(col_value) && Math.abs(row_value) >= Math.abs(dag_value)) {
            return row_value;
        } else if (Math.abs(col_value) >= Math.abs(row_value) && Math.abs(col_value) >= Math.abs(dag_value)) {
            return col_value;
        } else {
            return dag_value;
        }
    }

    private setUpGame(you: string) {
        const new_round = you !== this.player; // <<<<===== might be broken; check original

        if (new_round) {
            if (this.player === 'x') {
                if (this.won_last) {
                    this.won_last = false;
                } else {
                    this.attack = this.attack === 'Cyclone Lariat' ? 'Siberian Express' : 'Cyclone Lariat';
                }
            }

            this.turn = 1;
            this.player = you;
            this.opponent = this.player === 'x' ? 'o' : 'x';
        } else {
            this.turn += 1;
        }
    }

}
