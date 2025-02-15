import { expect, test } from 'vitest'
import { operateValue, RuleOperateType, RuleValueType } from '../src'

const zhangSan = {
  id: 1,
  name: 'Zhang San',
  age: 18,
  died: false,
  birthday: '2000 01 01',
  address: 'China GuangDong ShenZhen BaoAn',
  skills: ['eat', 'drink', 'run', 'play game']
}

const liSi = {
  id: 2,
  name: 'Li Si',
  age: 19,
  died: false,
  address: 'China GuangDong ShenZhen BaoAn',
  skills: ['eat', 'drink', 'play game', 'run']
}

const wangWu = {
  id: 3,
  name: 'Wang Wu',
  age: 17,
  // died: false,
  address: 'China GuangDong ShenZhen BaoAn',
  skills: ['eat', 'drink', 'run', 'play game']
}

test('data equal value', () => {
  expect(operateValue({
    left: {
      target: {
        name: 'user',
        type: RuleValueType.OBJECT,
        child: [
          {
            name: 'id',
            type: RuleValueType.INT,
          },
          {
            name: 'name',
            type: RuleValueType.STR
          }
        ]
      },
      index: ['id'],
    },
    middle: RuleOperateType.EQ,
    right: {
      target: {
        name: 'order',
        type: RuleValueType.OBJECT,
        child: [
          {
            name: 'id',
            type: RuleValueType.INT,
          },
          {
            name: 'user',
            type: RuleValueType.INT
          }
        ]
      },
      index: ['user'],
    }
  }, {
    user: {
      id: 2,
      name: 'ZhangSan'
    },
    order: {
      id: 3,
      user: 2
    }
  }))
    .toBeTruthy()
})

test('data not equal value', () => {})

test('data greater than value', () => {})

test('opreate data greater than or equal value', () => {})

test('data less than value', () => {})

test('data less than or equal value', () => {})

test('value in data', () => {})

test('value not int data', () => {})

test('data contains value', () => {})

test('data not contains value', () => {})

test('data starts with value', () => {})

test('not data starts with value', () => {})

test('data ends with value', () => {})

test('not data ends with value', () => {})

test('data can match regex', () => {})

test('not data can match regex', () => {})

test('data is null', () => {})

test('data is empty', () => {})

test('data increment value', () => {})

test('data decrement value', () => {})

test('data multiply value', () => {})

test('data divide value', () => {})

test('data len equal value', () => {})

test('data set value', () => {})

test('match not', () => {})

test('match and', () => {})

test('match or', () => {})

test('complex operate', () => {})
