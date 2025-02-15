import { expect, test } from 'vitest'
import { RuleValueType, transformValue } from './../src'

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
  age: 27,
  // died: false,
  address: 'China GuangDong ShenZhen BaoAn',
  skills: ['eat', 'drink', 'run', 'play game']
}

const school = {
  students: [
    zhangSan,
    liSi,
  ],
  classrooms: [
    {
      id: '1F-1',
      name: 'Chinese Classroom',
      students: [
        zhangSan
      ],
      teacher: wangWu
    },
    {
      id: '3F-2',
      name: 'Math Classroom',
      students: [],
      teacher: null
    }
  ],
  teachers: [
    {
      id: 3,
      info: wangWu
    }
  ]
}

test('transform tuple value', () => {
  const result = transformValue({
    name: 'tuple',
    type: RuleValueType.TUPLE,
    child: [
      {
        name: 'element',
        type: RuleValueType.OBJECT,
        child: [
          {
            name: 'id',
            type: RuleValueType.INT
          },
          {
            name: 'name',
            type: RuleValueType.STR
          },
          {
            name: 'age',
            type: RuleValueType.INT
          }
        ]
      }
    ]
  }, [zhangSan])

  expect(result).toEqual([{
    id: 1,
    name: 'Zhang San',
    age: 18
  }])
})

test('transform list value', () => {
  const result = transformValue({
    name: 'list',
    type: RuleValueType.LIST,
    child: [
      {
        name: 'element',
        type: RuleValueType.OBJECT,
        child: [
          {
            name: 'id',
            type: RuleValueType.INT
          },
          {
            name: 'name',
            type: RuleValueType.STR
          },
          {
            name: 'age',
            type: RuleValueType.INT
          }
        ]
      }
    ]
  }, [zhangSan, liSi, wangWu])
  const eq = [zhangSan, liSi, wangWu].map(({ id, name, age }) => ({ id, name, age }))

  expect(result).toEqual(eq)
})

test('transform base value', () => {
  expect(transformValue({ name: 'name', type: RuleValueType.STR }, zhangSan.name)).toEqual(zhangSan.name)

  expect(transformValue({ name: 'age', type: RuleValueType.INT }, zhangSan.age)).toEqual(zhangSan.age)

  expect(transformValue({ name: 'birthday', type: RuleValueType.DATE }, zhangSan.birthday)).toEqual(zhangSan.birthday)

  expect(transformValue({ name: 'died', type: RuleValueType.BOOL }, undefined)).toEqual(false)

  expect(transformValue(
    {
      name: 'skills',
      type: RuleValueType.LIST,
      child: [
        {
          name: 'skill',
          type: RuleValueType.STR
        }
      ]
    }, zhangSan.skills)
  )
    .toEqual(zhangSan.skills)

  expect(transformValue(
    {
      name: 'skills',
      type: RuleValueType.LIST,
      child: [
        {
          name: 'skill',
          type: RuleValueType.STR
        }
      ]
    }, liSi.skills)
  )
    .not.toEqual(zhangSan.skills)
})

test('transform complex value', () => {
  expect(transformValue({
    name: 'school',
    type: RuleValueType.OBJECT,
    child: [
      {
        name: 'students',
        type: RuleValueType.LIST,
        child: [
          {
            name: 'student',
            type: RuleValueType.OBJECT,
            required: false,
            child: [
              {
                name: 'id',
                type: RuleValueType.INT
              },
              {
                name: 'name',
                type: RuleValueType.STR
              }
            ]
          }
        ]
      },
      {
        name: 'classrooms',
        type: RuleValueType.LIST,
        child: [
          {
            name: 'classroom',
            type: RuleValueType.OBJECT,
            child: [
              {
                name: 'id',
                type: RuleValueType.STR
              },
              {
                name: 'name',
                type: RuleValueType.STR
              },
              {
                name: 'teacher',
                type: RuleValueType.OBJECT,
                required: false,
                child: [
                  {
                    name: 'id',
                    type: RuleValueType.INT
                  },
                  {
                    name: 'name',
                    type: RuleValueType.STR
                  },
                  {
                    name: 'skills',
                    type: RuleValueType.LIST,
                    child: [
                      {
                        name: 'skill',
                        type: RuleValueType.STR,
                      }
                    ]
                  }
                ]
              },
              {
                name: 'students',
                type: RuleValueType.LIST,
                child: [
                  {
                    name: 'student',
                    type: RuleValueType.OBJECT,
                    required: false,
                    child: [
                      {
                        name: 'id',
                        type: RuleValueType.INT
                      },
                      {
                        name: 'name',
                        type: RuleValueType.STR
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        name: 'teachers',
        type: RuleValueType.LIST,
        child: [
          {
            name: 'teacher',
            type: RuleValueType.OBJECT,
            child: [
              {
                name: 'id',
                type: RuleValueType.INT
              },
              {
                name: 'info',
                type: RuleValueType.OBJECT,
                child: [
                  {
                    name: 'id',
                    type: RuleValueType.INT
                  },
                  {
                    name: 'age',
                    type: RuleValueType.INT
                  },
                  {
                    name: 'name',
                    type: RuleValueType.STR
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }, school))
    .toEqual({
      students: [
        {
          id: 1,
          name: 'Zhang San',
        },
        {
          id: 2,
          name: 'Li Si',
        }
      ],
      classrooms: [
        {
          id: '1F-1',
          name: 'Chinese Classroom',
          students: [
            {
              id: 1,
              name: 'Zhang San',
            },
          ],
          teacher: {
            id: 3,
            name: 'Wang Wu',
            skills: ['eat', 'drink', 'run', 'play game']
          }
        },
        {
          id: '3F-2',
          name: 'Math Classroom',
          students: [],
        }
      ],
      teachers: [
        {
          id: 3,
          info: {
            id: 3,
            name: 'Wang Wu',
            age: 27
          }
        }
      ]
    })
})
