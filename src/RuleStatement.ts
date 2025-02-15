import type { RuleOperate } from './RuleOperate'
import type { RuleValue } from './RuleValue'

export enum RuleStatementType {
  /** 如果 */
  IF = 'if',
  /** 否则如果 */
  ELIF = 'elif',
  /** 否则 */
  ELSE = 'else',
  /** for 循环 */
  FOR = 'for',
  /** while 循环 */
  WHILE = 'while',
  /** 延时 */
  DELAY = 'delay',
  /** 尝试 */
  TRY = 'try',
  /** 赋值 */
  ASSIGN = 'assign',
  /** 删除 */
  DEL = 'del',
  /** 清空 */
  CLEAR = 'clear',
  /** 声明变量 */
  VAR = 'var',
  /** 停止 */
  BREAK = 'break',
  /** 跳过当前循环 */
  CONTINUE = 'continue',
  /** 返回 */
  RETURN = 'return'
}

export interface RuleStatement {
  type: RuleStatementType
  value: RuleValue
  target: RuleValue
  operates: Array<RuleOperate>
  child?: RuleStatement[]
  description?: string
  priority?: number
  retry?: number | {
    message: string | {
      pass: string
      fail: string
    }
    limit: number
  }
  result?: unknown
}
