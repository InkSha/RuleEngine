export enum RuleValueType {
  STR = 'str',
  INT = 'int',
  FLOAT = 'float',
  BOOL = 'bool',
  LIST = 'list',
  OBJECT = 'object',
  DATE = 'date',
  TIME = 'time',
  TUPLE = 'tuple',
  NULL = 'null',
  UNDEFINED = 'undefined',
  ANY = 'any',
}

export interface RuleValue {
  name: string
  type: RuleValueType
  child?: RuleValue[]
  defaultValue?: unknown
  required?: boolean
  dynamic?: boolean
  description?: string
}
