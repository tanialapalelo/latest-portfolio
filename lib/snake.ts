export type Point = { x: number; y: number }
export type Direction = Point

export type SnakeState = {
  snake: Point[]
  food: Point
  score: number
  gameOver: boolean
}

export function wrapPosition(pos: Point, gridW: number, gridH: number): Point {
  return {
    x: ((pos.x % gridW) + gridW) % gridW,
    y: ((pos.y % gridH) + gridH) % gridH,
  }
}

export function initSnake(gridW: number, gridH: number): SnakeState {
  const cx = Math.floor(gridW / 2)
  const cy = Math.floor(gridH / 2)
  const snake = [{ x: cx, y: cy }, { x: cx - 1, y: cy }, { x: cx - 2, y: cy }]
  return {
    snake,
    food: randomFood(snake, gridW, gridH),
    score: 0,
    gameOver: false,
  }
}

export function randomFood(snake: Point[], gridW: number, gridH: number): Point {
  let food: Point
  do {
    food = { x: Math.floor(Math.random() * gridW), y: Math.floor(Math.random() * gridH) }
  } while (snake.some(s => s.x === food.x && s.y === food.y))
  return food
}

export function checkFoodCollision(head: Point, food: Point): boolean {
  return head.x === food.x && head.y === food.y
}

export function moveSnake(
  state: SnakeState,
  dir: Direction,
  gridW: number,
  gridH: number
): SnakeState {
  if (state.gameOver) return state

  const head = wrapPosition(
    { x: state.snake[0].x + dir.x, y: state.snake[0].y + dir.y },
    gridW,
    gridH
  )
  const ate = checkFoodCollision(head, state.food)

  // The tail vacates its cell this same tick unless food was eaten (in which
  // case the snake grows and the tail stays put), so it must not count as a
  // collision target.
  const body = ate ? state.snake : state.snake.slice(0, -1)
  if (body.some(seg => seg.x === head.x && seg.y === head.y)) {
    return { ...state, gameOver: true }
  }

  const newSnake = ate
    ? [head, ...state.snake]
    : [head, ...state.snake.slice(0, -1)]
  return {
    snake: newSnake,
    food: ate ? randomFood(newSnake, gridW, gridH) : state.food,
    score: ate ? state.score + 1 : state.score,
    gameOver: false,
  }
}
