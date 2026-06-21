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
