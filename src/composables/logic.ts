import type { Ref } from 'vue'
import type { BlockState } from '~/types'

const direction = [
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
]

interface GameState {
  mineGenerated: Boolean
  gameState: 'play' | 'won' | 'lose'
  board: BlockState[][]
}

export class GamePlay {
  state = ref() as Ref<GameState>

  constructor(public width: number, public height: number) {
    this.reset()
  }

  get board() {
    return this.state.value.board
  }

  reset() {
    this.state.value = {
      mineGenerated: false,
      gameState: 'play',
      board: Array.from({ length: this.height }, (_, y) =>
        Array.from({ length: this.width }, (_, x): BlockState => ({
          x, y, adjacentMines: 0, revealed: false,
        })),
      ),
    }
  }

  generateMines(initial: BlockState) {
    for (const row of this.board) {
      for (const block of row) {
        if (Math.abs(block.x - initial.x) < 1)
          continue
        if (Math.abs(block.y - initial.y) < 1)
          continue
        block.mine = Math.random() < 0.2
      }
    }
    this.updateNumbers()
  }

  updateNumbers() {
    this.board.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block.mine)
          return

        this.getSiblings(block).forEach((b) => {
          if (b.mine)
            block.adjacentMines += 1
        })
      })
    })
  }

  getSiblings(block: BlockState) {
    return direction.map(([dx, dy]) => {
      const x2 = block.x + dx
      const y2 = block.y + dy
      if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height)
        return undefined

      return this.board[y2][x2]
    }).filter(Boolean) as BlockState[]
  }

  expandZero(block: BlockState) {
    if (block.adjacentMines)
      return

    this.getSiblings(block).forEach((s) => {
      if (!s.revealed) {
        s.revealed = true
        this.expandZero(s)
      }
    })
  }

  onRightClick(block: BlockState) {
    if (this.state.value.gameState !== 'play')
      return
    if (block.revealed)
      return
    block.figged = !block.figged
  }

  onClick(e: MouseEvent, block: BlockState) {
    if (!this.state.value.mineGenerated) {
      this.generateMines(block)
      this.state.value.mineGenerated = true
    }
    block.revealed = true

    if (block.mine) {
      this.state.value.gameState = 'lose'
      this.showAllMines()
      return
    }

    this.expandZero(block)
  }

  showAllMines() {
    this.board.flat().forEach((b) => {
      if (b.mine)
        b.revealed = true
    })
  }

  checkGameState() {
    if (!this.state.value.mineGenerated)
      return

    const blocks = this.board.flat()
    if (blocks.every(b => b.revealed || (b.figged && b.mine))) {
      if (blocks.some(b => (b.figged && !b.mine))) {
        this.state.value.gameState = 'lose'
        this.showAllMines()
      }
      else { this.state.value.gameState = 'won' }
    }
  }
}
