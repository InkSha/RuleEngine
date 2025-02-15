import { expect, test } from 'vitest'
import { type RuleStatement, RuleStatementType, RuleValueType, RuleOperateType, RuleEngine } from './../src'

// test('list item contains id equal 2 and name equal "李四"', () => {
//   const ruleEngine = new RuleEngine()

//   const data = [
//     { id: 1, name: '张三' },
//     { id: 2, name: '李四' },
//     { id: 3, name: '王五' },
//     { id: 4, name: '赵六' },
//     { id: 5, name: '孙七' },
//   ]

//   ruleEngine.addRule({
//     type: RuleStatementType.FOR,
//     value: {
//       name: 'item',
//       type: RuleValueType.OBJECT,
//       child: [
//         {
//           name: 'id',
//           type: RuleValueType.INT,
//         },
//         {
//           name: 'name',
//           type: RuleValueType.INT,
//         }
//       ]
//     },
//     target: {
//       name: 'items',
//       type: RuleValueType.LIST,
//       child: [
//         {
//           name: 'item',
//           type: RuleValueType.OBJECT,
//           child: [
//             {
//               name: 'id',
//               type: RuleValueType.INT,
//             },
//             {
//               name: 'name',
//               type: RuleValueType.INT,
//             }
//           ]
//         }
//       ]
//     },
//     operates: [
//       {
//         operate: RuleOperateType.CONTAINS,
//         target: {
//           name: 'id',
//           type: RuleValueType.INT,
//         },
//         message: {
//           pass: '存在 id = 2',
//           fail: '不存在 id = 2',
//         },
//         value: 2,
//         after: [
//           {
//             operate: RuleOperateType.EQ,
//             target: {
//               name: 'name',
//               type: RuleValueType.STR,
//             },
//             value: '李四',
//             message: {
//               pass: '李四存在',
//               fail: '李四不存在',
//             }
//           }
//         ]
//       }
//     ],
//     result: 'list item contains id equal 2 and name equal "李四"'
//   })

//   ruleEngine
//     .execute(data)
//     .listen(result => {
//       expect(result).toEqual('list item contains id equal 2 and name equal "李四"')
//     })
// })


// test('object name equal "张三" and age equal 18', () => {
//   const ruleEngine = new RuleEngine()

//   const data = {
//     name: '张三',
//     age: 18,
//   }

//   ruleEngine.addRule({
//     type: RuleStatementType.IF,
//     value: {
//       name: 'name',
//       type: RuleValueType.STR,
//     },
//     target: {
//       name: 'data',
//       type: RuleValueType.OBJECT,
//       child: [
//         {
//           name: 'name',
//           type: RuleValueType.STR,
//         },
//         {
//           name: 'age',
//           type: RuleValueType.INT,
//         }
//       ]
//     },
//     operates: [
//       {
//         operate: RuleOperateType.EQ,
//         target: {
//           name: 'name',
//           type: RuleValueType.STR,
//         },
//         value: '张三',
//         message: {
//           pass: 'name 等于张三',
//           fail: 'name 不等于张三',
//         }
//       },
//       {
//         operate: RuleOperateType.EQ,
//         target: {
//           name: 'age',
//           type: RuleValueType.INT,
//         },
//         value: 18,
//         message: {
//           pass: 'age 等于18',
//           fail: 'age 不等于18',
//         }
//       }
//     ],
//     result: 'object name equal "张三" and age equal 18'
//   })

//   ruleEngine
//     .execute(data)
//     .listen(result => {
//       expect(result).toEqual('object name equal "张三" and age equal 18')
//     })
// })

test('example', () => {
  expect(1 + 1).toEqual(2)
})
