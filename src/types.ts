export interface BlockState {
  x: number
  y: number
  revealed: boolean
  mine?: boolean
  figged?: boolean
  adjacentMines: number
}

