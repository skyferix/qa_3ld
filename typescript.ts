import { Piece } from "../Piece";
import { GameTile } from "../Tile";
import { Coordinates, Move, Player } from "../types/types";
import { initialPieces } from "./data";


export class Board {
  private board: GameTile[][] = [];
  private selectedTile: GameTile | null = null;
  private possibleMoves: Move[] = [];

  constructor() {}

  public initialize() {
    this.resetBoard();
    this.setInitialBoard();
  }

  public movePiece(from: Coordinates, to: Coordinates) {
    const pieceToMove = this.board[from.y][from.x].getPiece();
    if (pieceToMove && this.isMoveValid(pieceToMove, to)) {
      const toDelete = this.possibleMoves.find((move) => move.coordinates.x === to.x && move.coordinates.y === to.y);
      toDelete?.wouldDelete.forEach((tile) => this.board[tile.y][tile.x].setPiece(null));
      this.board[from.y][from.x].setPiece(null);
      this.board[to.y][to.x].setPiece(pieceToMove);
      this.possibleMoves = [];
    }
  }

  private isMoveValid(pieceToMove: Piece, to: Coordinates) {
    return this.possibleMoves.some((move) => {
      return to.x === move.coordinates.x && to.y === move.coordinates.y;
    });
  }

  public findAllPossibleMoves(tileToMove: GameTile): Move[] {
    const pieceToMove = tileToMove.getPiece();
    if (pieceToMove) {
      const possibleMoves: Move[] = [];
      const directionOfMotion = [pieceToMove.getBelongsTo() === Player.BLACK ? 1 : -1];
      const leftOrRight = [1, -1];
      
      for (let j = 0; j < directionOfMotion.length; j++) {
        for (let i = 0; i < leftOrRight.length; i++) {
          const moveY = tileToMove.y + directionOfMotion[j];
          const moveX = tileToMove.x + leftOrRight[i];
          
          if (this.board[moveY] !== undefined &&
              this.board[moveY][moveX] !== undefined &&
              this.board[moveY][moveX].getPiece() === null
          ) {
            possibleMoves.push({
              coordinates: {
                x: moveX,
                y: moveY,
              },
              wouldDelete: []
            });
          }
        }
      }

      const jumps = this.findAllJumps(tileToMove.x, tileToMove.y, this.board, directionOfMotion[0], [], [], false, pieceToMove.getBelongsTo());

      for (let i = 0; i < jumps.length; i++) {
        possibleMoves.push(jumps[i]);
      }
      return possibleMoves;
    }
    return [];
  }

  public findAllJumps(x: number, y: number, board: GameTile[][], directionOfMotion: number, possibleJumps: Move[], wouldDelete: Coordinates[], isKing: boolean, activePlayer: Player): Move[] {
    let thisIterationDidSomething = false;
    const directions = [directionOfMotion];
    const leftOrRight = [1, -1];
    if (isKing) {
      directions.push(directions[0] * -1);
    }

    for (let k = 0; k < directions.length; k++) {
      for (let l = 0; l < leftOrRight.length; l++) {
        if (
          this.board[y + directions[k]] &&
          this.board[y + directions[k]][x + leftOrRight[l]] &&
          this.board[y + directions[k]][x + leftOrRight[l]].getPiece() &&
          this.board[y + (directions[k] * 2)] &&
          this.board[y + (directions[k] * 2)][x + (leftOrRight[l] * 2)] &&
          this.board[y + directions[k]][x + leftOrRight[l]].getPiece()?.getBelongsTo() !== this.board[y][x].getPiece()?.getBelongsTo() &&
          !this.board[y + (directions[k] * 2)][x + (leftOrRight[l] * 2)].getPiece()  
        ) {
          if (possibleJumps.map(
            (move) => String(move.coordinates.y) + String(move.coordinates.x)
          ).indexOf(String(y + (directions[k] * 2))+String(x + (leftOrRight[l] * 2))) < 0) {
            //this eventual jump target did not already exist in the list
            const tempJumpObject: Move = {
              coordinates: {
                y: y + (directions[k]*2),
                x: x + (leftOrRight[l]*2),
              },
              wouldDelete:[
                {
                  y: y + directions[k],
                  x: x + leftOrRight[l]
                }
              ]
            };
            for (var i = 0; i < wouldDelete.length; i++) {
              tempJumpObject.wouldDelete.push(wouldDelete[i]);
            }
            possibleJumps.push(tempJumpObject);
            thisIterationDidSomething = true;
          }
        }
      }
    }
    if(thisIterationDidSomething) {
			for (let i = 0; i < possibleJumps.length; i++) {
				var coords = [possibleJumps[i].coordinates.y, possibleJumps[i].coordinates.x];
				var children = this.findAllJumps(coords[0], coords[1], board, directionOfMotion, possibleJumps, possibleJumps[i].wouldDelete, isKing, activePlayer);
				for (var j = 0; j < children.length; j++) {
					if (possibleJumps.indexOf(children[j]) < 0) {
						possibleJumps.push(children[j]);
					}
				}
			}
		}
		return possibleJumps;
  }

  public setSelectedTile(tile: GameTile | null, currentTurn?: Player) {
    if (tile?.getPiece()?.getBelongsTo() === currentTurn) {
      this.selectedTile = tile;
      if (tile) {
        this.possibleMoves = this.findAllPossibleMoves(tile);
        return;
      }
    }

    this.possibleMoves = [];
  }

  public getSelectedTile() {
    return this.selectedTile;
  }

  public getPossibleMoves() {
    return this.possibleMoves;
  }

  public getBoard = () => this.board;

  private resetBoard() {
    const newBoard: GameTile[][] = [];
    let id = 0;
    for (let y = 0; y < 8; y++) {
      newBoard[y] = [];
      for (let x = 0; x < 8; x++) {
        newBoard[y][x] = new GameTile(id, x, y);
      }
      id++;
    }
    this.board = newBoard;
  }

  private setInitialBoard() {
    for (const {x, y, belongsTo} of initialPieces) {
      this.board[y][x].addPiece(belongsTo);
    }
  }
}
