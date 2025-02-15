import type { RuleValue } from './RuleValue'

export enum RuleConditionType {
  /** 和 */
  AND = 'and',
  /** 或 */
  OR = 'or',
  /** 非 */
  NOT = 'not',
}

export enum RuleOperateType {
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
  /** 为 undefined */
  ISUNDEFINED = 'isundefined',
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
  /** 设置 */
  SET = 'set'
}

/**
 * rule opreate value
 */
export interface RuleOperateValue {
  /**
   * opereate target object
   */
  target: RuleValue
  /**
   * operate value
   */
  value?: unknown
  /**
   * operate target object property
   *
   * e.g. `index = ['users', '2', 'name'] opreate object = target['users']['2']['name']`
   */
  index?: string[]
}

/**
 * rule operate object
 */
export type RuleOperand =
  | RuleOperate
  | RuleOperateValue

/**
 * rule operate
 */
export interface RuleOperate {
  /**
   * left operate value
   *
   * e.g. operate = 1 + 2, left = 1
   */
  left: RuleOperand
  /**
   * middle operate symbol
   *
   * e.g. operate = 1 + 2, middle = +
   */
  middle: RuleOperateType
  /**
   * optional right operate value
   *
   * e.g. operate = 1 + 2, right = 2
   *
   * e.g. opreate = left is null, is null is middle symbol
   */
  right?: RuleOperand
  /**
   * operate priority
   */
  priority?: number
  /**
   * operate description
   */
  description?: string
  /**
   * opreate message
   */
  message?: {
    /**
     * on execute pass print message
     */
    pass?: string
    /**
     * on execute fail print message
     */
    fail?: string
  }
}

/**
 * rule condition
 */
export interface RuleCondition {
  /**
   * rule condition type
   */
  type: RuleConditionType
  /**
   * rule condition list
   *
   * e.g.
   *
   * a > b && b > c
   *
   * a > b && (b > c || c > d || !(d > e))
   */
  operates: (RuleCondition | RuleOperate)[]
}
