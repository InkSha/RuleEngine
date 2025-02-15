import { type RuleValue, RuleValueType } from './RuleValue'

export function checkValue(value: RuleValue, data: unknown): boolean {
  switch (value.type) {
    case RuleValueType.STR:
      return typeof data === 'string'
    case RuleValueType.INT:
      return Number.isInteger(typeof data === 'number' ? data : Number(data))
    case RuleValueType.FLOAT: {
      const num = typeof data === 'number' ? data : Number(data)
      return !Number.isNaN(num) && !Number.isInteger(num)
    }
    case RuleValueType.BOOL:
      return typeof data === 'boolean'
    case RuleValueType.LIST: {
      if (Array.isArray(data)) {
        if (Array.isArray(value.child)) {
          return data.every(item => {
            return value.child?.some(child => checkValue(child, item))
          })
        }

        return true
      }
      return false
    }
    case RuleValueType.TUPLE: {
      if (Array.isArray(data) && value.child?.length && value.child.length === data.length) {
        for (let i = 0; i < value.child.length; i++) {
          if (!checkValue(value.child[i], data[i])) {
            return false
          }
        }
        return true
      }
      return false
    }
    case RuleValueType.OBJECT: {
      const isObject = (data: unknown): data is Record<string, unknown> => typeof data === 'object' && data !== null
      if (isObject(data)) {
        if (value.child?.length) {
          for (const property of value.child) {
            if (property.required && !data[property.name]) {
              return false
            }
            if (data[property.name]) {
              if (!checkValue(property, data[property.name])) {
                return false
              }
            }
          }
        }
        return true
      }
      return false
    }
    case RuleValueType.NULL:
      return data === null
    case RuleValueType.DATE:
    case RuleValueType.TIME:
      return !Number.isNaN(Date.parse(`${data}`))
    case RuleValueType.UNDEFINED:
      return typeof data === 'undefined'
    case RuleValueType.ANY:
      return true
    default: {
      const _: never = value.type
      return false
    }
  }
}
