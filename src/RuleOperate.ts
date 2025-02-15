import type { RuleEvent } from './RuleEvent'
import type { RuleValue } from './RuleValue'

export enum RuleOperateType {
  /** 和 */
  AND = 'and',
  /** 或 */
  OR = 'or',
  /** 非 */
  NOT = 'not',
  /** 等于 */
  EQ = 'eq',
  /** 不等于 */
  NE = 'ne',
  /** 大于 */
  GT = 'gt',
  /** 大于等于 */
  GE = 'ge',
  /** 小于 */
  LT = 'lt',
  /** 小于等于 */
  LE = 'le',
  /** 在 */
  IN = 'in',
  /** 不在 */
  NIN = 'nin',
  /** 包含 */
  CONTAINS = 'contains',
  /** 不包含 */
  NCONTAINS = 'ncontains',
  /** 以...开头 */
  STARTSWITH = 'startswith',
  /** 不以...开头 */
  NSTARTSWITH = 'nstartswith',
  /** 以...结尾 */
  ENDSWITH = 'endswith',
  /** 不以...结尾 */
  NENDSWITH = 'nendswith',
  /** 正则匹配 */
  REGEX = 'regex',
  /** 不正则匹配 */
  NREGEX = 'nregex',
  /** 为 null */
  ISNULL = 'isnull',
  /** 为空 */
  ISEMPTY = 'isempty',
  /** 增 */
  INC = 'inc',
  /** 减 */
  DEC = 'dec',
  /** 乘 */
  MUL = 'mul',
  /** 除 */
  DIV = 'div',
  /** 长度 */
  LEN = 'length',
}

export interface RuleOperate {
  operate: RuleOperateType
  target: RuleValue
  value?: unknown
  index?: string
  priority?: number
  description?: string
  after?: RuleOperate[]
  otherwise?: RuleOperate[]
  retry?: number
  trigger?: RuleEvent[]
  message?: string | {
    pass?: string
    fail?: string
  }
}
