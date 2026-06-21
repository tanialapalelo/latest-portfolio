import { describe, it, expect } from 'vitest'
import { wrapPosition, initSnake, moveSnake, checkFoodCollision } from '@/lib/snake'

describe('wrapPosition', () => {
  it('wraps x past right edge', () => {
    expect(wrapPosition({ x: 10, y: 5 }, 10, 8)).toEqual({ x: 0, y: 5 })
  })
  it('wraps x past left edge', () => {
    expect(wrapPosition({ x: -1, y: 5 }, 10, 8)).toEqual({ x: 9, y: 5 })
  })
  it('wraps y past bottom', () => {
    expect(wrapPosition({ x: 3, y: 8 }, 10, 8)).toEqual({ x: 3, y: 0 })
  })
})

describe('initSnake', () => {
  it('starts at center with length 3', () => {
    const state = initSnake(20, 15)
    expect(state.snake).toHaveLength(3)
    expect(state.snake[0]).toEqual({ x: 10, y: 7 })
    expect(state.score).toBe(0)
  })
})

describe('moveSnake', () => {
  it('moves head in direction', () => {
    const state = initSnake(20, 15)
    const next = moveSnake(state, { x: 1, y: 0 }, 20, 15)
    expect(next.snake[0]).toEqual({ x: 11, y: 7 })
  })

  it('grows snake on food collision', () => {
    const state = initSnake(20, 15)
    const foodState = { ...state, food: { x: 11, y: 7 } }
    const next = moveSnake(foodState, { x: 1, y: 0 }, 20, 15)
    expect(next.snake).toHaveLength(4)
    expect(next.score).toBe(1)
  })
})

describe('checkFoodCollision', () => {
  it('returns true when head matches food', () => {
    expect(checkFoodCollision({ x: 5, y: 3 }, { x: 5, y: 3 })).toBe(true)
  })
  it('returns false otherwise', () => {
    expect(checkFoodCollision({ x: 5, y: 3 }, { x: 5, y: 4 })).toBe(false)
  })
})

describe('moveSnake self-collision', () => {
  it('sets gameOver true when head collides with body', () => {
    // U-shaped snake: head at (2,1) moving down (x:0,y:1) would land on (2,2),
    // which is occupied by an existing body segment.
    const state = {
      snake: [
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
      ],
      food: { x: 19, y: 14 },
      score: 0,
      gameOver: false,
    }
    const next = moveSnake(state, { x: 0, y: 1 }, 20, 15)
    expect(next.gameOver).toBe(true)
  })

  it('does not treat moving into the vacating tail cell as a collision', () => {
    // 4-segment snake forming a tight square loop:
    // head (1,0) -> (1,1) -> (0,1) -> tail (0,0)
    // Moving left (x:-1,y:0): head goes from (1,0) to (0,0), which is the
    // tail cell. Since no food is eaten, the tail vacates (0,0) this same
    // tick, so this must NOT be flagged as a collision.
    const state = {
      snake: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: 0 },
      ],
      food: { x: 19, y: 14 },
      score: 0,
      gameOver: false,
    }
    const next = moveSnake(state, { x: -1, y: 0 }, 20, 15)
    expect(next.gameOver).toBe(false)
    expect(next.snake[0]).toEqual({ x: 0, y: 0 })
  })

  it('is a no-op when state is already game over', () => {
    const state = {
      snake: [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
      ],
      food: { x: 1, y: 1 },
      score: 3,
      gameOver: true,
    }
    const next = moveSnake(state, { x: 1, y: 0 }, 20, 15)
    expect(next).toEqual(state)
  })
})
