import { expect, test } from 'vitest'
import { operateValue, RuleOperateType, RuleValueType } from '../src'

const target = {
  target: {
    name: 'user',
    type: RuleValueType.OBJECT,
    child: [
      {
        name: 'id',
        type: RuleValueType.INT,
      },
      {
        name: 'score',
        type: RuleValueType.INT,
      },
      {
        name: 'name',
        type: RuleValueType.STR,
      },
    ],
  },
}

const otherTarget = {
  target: {
    name: 'other',
    type: RuleValueType.OBJECT,
    child: [
      {
        name: 'id',
        type: RuleValueType.INT,
      },
      {
        name: 'score',
        type: RuleValueType.INT,
      },
      {
        name: 'name',
        type: RuleValueType.STR,
      },
    ],
  },
}

const targets = {
  target: {
    name: 'users',
    type: RuleValueType.LIST,
    child: [target.target],
  },
}

const order = {
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
        type: RuleValueType.INT,
      },
      {
        name: 'name',
        type: RuleValueType.STR,
      },
    ],
  },
}

const user = {
  id: 1,
  score: 50,
  name: 'ZhangSan',
} as const

const other = {
  id: 2,
  score: 70,
  name: 'LiSi',
} as const

const valueTarget = {
  target: {
    name: 'value',
    defaultValue: 5,
    type: RuleValueType.INT,
  },
}

const users = [
  {
    id: 1,
    score: 50,
    name: 'ZhangSan',
  },
  {
    id: 2,
    score: 70,
    name: 'LiSi',
  },
  {
    id: 3,
    score: 100,
    name: 'WangWu',
  },
] as const

const orderData = {
  id: 2,
  user: 1,
  name: 'ZhangSan',
} as const

test('data equal value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['id'],
        },
        middle: RuleOperateType.EQ,
        right: {
          ...order,
          index: ['user'],
        },
      },
      { user, order: orderData },
    ),
  ).toBeTruthy()
})

test('data not equal value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['id'],
        },
        middle: RuleOperateType.NE,
        right: {
          ...order,
          index: ['id'],
        },
      },
      { user, order: orderData },
    ),
  ).toBeTruthy()
})

test('data greater than value', () => {
  expect(
    operateValue(
      {
        left: {
          ...otherTarget,
          index: ['score'],
        },
        middle: RuleOperateType.GT,
        right: {
          ...target,
          index: ['score'],
        },
      },
      { user, other },
    ),
  ).toBeTruthy()
})

test('opreate data greater than or equal value', () => {
  expect(
    operateValue(
      {
        left: {
          ...otherTarget,
          index: ['score'],
        },
        middle: RuleOperateType.GE,
        right: {
          ...target,
          index: ['score'],
        },
      },
      { user, other },
    ),
  ).toBeTruthy()
})

test('data less than value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['score'],
        },
        middle: RuleOperateType.LT,
        right: {
          ...otherTarget,
          index: ['score'],
        },
      },
      { user, other },
    ),
  ).toBeTruthy()
})

test('data less than or equal value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['score'],
        },
        middle: RuleOperateType.LE,
        right: {
          ...otherTarget,
          index: ['score'],
        },
      },
      { user, other },
    ),
  ).toBeTruthy()
})

test('value in data', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['id', 'name', 'score'],
        },
        middle: RuleOperateType.IN,
        right: targets,
      },
      { user, users },
    ),
  ).toBeTruthy()
})

test('value not in data', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['id', 'name', 'score'],
        },
        middle: RuleOperateType.NIN,
        right: targets,
      },
      { user, users },
    ),
  ).toBeTruthy()
})

test('data contains value', () => {
  expect(
    operateValue(
      {
        left: targets,
        middle: RuleOperateType.CONTAINS,
        right: {
          ...target,
          index: ['id', 'name', 'score'],
        },
      },
      { user, users },
    ),
  ).toBeTruthy()
})

test('data not contains value', () => {
  expect(
    operateValue(
      {
        left: targets,
        middle: RuleOperateType.NCONTAINS,
        right: {
          ...target,
          index: ['id', 'name', 'score'],
        },
      },
      { user, users },
    ),
  ).toBeTruthy()
})

test('data starts with value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['name'],
        },
        middle: RuleOperateType.STARTSWITH,
        right: {
          target: {
            name: 'Zhang',
            type: RuleValueType.STR,
          },
        },
      },
      {
        user,
        Zhang: 'Zhang',
      },
    ),
  ).toBeTruthy()
})

test('not data starts with value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['name'],
        },
        middle: RuleOperateType.NSTARTSWITH,
        right: {
          target: {
            name: 'Zhang',
            type: RuleValueType.STR,
          },
        },
      },
      {
        user,
        Zhang: 'L',
      },
    ),
  ).toBeTruthy()
})

test('data ends with value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['name'],
        },
        middle: RuleOperateType.ENDSWITH,
        right: {
          target: {
            name: 'San',
            type: RuleValueType.STR,
          },
        },
      },
      {
        user,
        San: 'San',
      },
    ),
  ).toBeTruthy()
})

test('not data ends with value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['name'],
        },
        middle: RuleOperateType.NENDSWITH,
        right: {
          target: {
            name: 'Si',
            type: RuleValueType.STR,
          },
        },
      },
      {
        user,
        Si: 'Si',
      },
    ),
  ).toBeTruthy()
})

test('data can match regex', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['name'],
        },
        middle: RuleOperateType.REGEX,
        right: {
          target: {
            name: 'Zhang',
            type: RuleValueType.STR,
          },
        },
      },
      {
        user,
        Zhang: '/^Z.*n$/',
      },
    ),
  ).toBeTruthy()
})

test('not data can match regex', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['name'],
        },
        middle: RuleOperateType.NREGEX,
        right: {
          target: {
            name: 'Zhang',
            type: RuleValueType.STR,
          },
        },
      },
      {
        user,
        Zhang: '/^Z.*n$/',
      },
    ),
  ).toBeTruthy()
})

test('data is null', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['name'],
        },
        middle: RuleOperateType.ISNULL,
      },
      { user: { name: null, id: 1 } },
    ),
  ).toBeTruthy()
})

test('data is empty', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['name'],
        },
        middle: RuleOperateType.ISUNDEFINED,
      },
      { user: { name: undefined, id: 1 } },
    ),
  ).toBeTruthy()
})

test('data increment value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['score'],
        },
        middle: RuleOperateType.INC,
        right: valueTarget,
      },
      {
        user,
        value: 3,
      },
    ),
  ).toBeTruthy()
  expect(user).toBe({
    id: 1,
    score: 53,
    name: 'ZhangSan',
  })
})

test('data decrement value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['score'],
        },
        middle: RuleOperateType.DEC,
        right: valueTarget,
      },
      {
        user,
        value: 13,
      },
    ),
  ).toBeTruthy()
  expect(user).toBe({
    id: 1,
    score: 40,
    name: 'ZhangSan',
  })
})

test('data multiply value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['score'],
        },
        middle: RuleOperateType.MUL,
        right: valueTarget,
      },
      {
        user,
        value: 3,
      },
    ),
  ).toBeTruthy()
  expect(user).toBe({
    id: 1,
    score: 120,
    name: 'ZhangSan',
  })
})

test('data divide value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['score'],
        },
        middle: RuleOperateType.DIV,
        right: valueTarget,
      },
      {
        user,
        value: 2,
      },
    ),
  ).toBeTruthy()
  expect(user).toBe({
    id: 1,
    score: 60,
    name: 'ZhangSan',
  })
})

test('data len equal value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          middle: RuleOperateType.LEN,
          index: ['name'],
        },
        middle: RuleOperateType.EQ,
        right: valueTarget,
      },
      {
        user,
        value: user.name.length,
      },
    ),
  ).toBeTruthy()
})

test('data set value', () => {
  expect(
    operateValue(
      {
        left: {
          ...target,
          index: ['score'],
        },
        middle: RuleOperateType.SET,
        right: valueTarget,
      },
      {
        user,
        value: 8,
      },
    ),
  ).toBeTruthy()
  expect(user).toBe({
    id: 1,
    score: 8,
    name: 'ZhangSan',
  })
})

// test('match not', () => {})

// test('match and', () => {})

// test('match or', () => {})

// test('complex operate', () => {})
