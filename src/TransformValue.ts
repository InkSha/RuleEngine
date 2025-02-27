import { RuleValueType, type RuleValue } from './RuleValue'
import { checkValue } from './CheckValue'

export function transformValue<T>(target: RuleValue, data: unknown): unknown {
  switch (target.type) {
    case RuleValueType.ANY:
      return data
    case RuleValueType.BOOL:
      return typeof data === 'boolean' ? data : !!data
    case RuleValueType.FLOAT:
    case RuleValueType.INT:
      return typeof data === 'number' ? data : Number(data)
    case RuleValueType.NULL:
      return null
    case RuleValueType.STR:
      return typeof data === 'string' ? data : Object.toString.call(data)
    case RuleValueType.UNDEFINED:
      return undefined
    case RuleValueType.TUPLE: {
      if (Array.isArray(data)) {
        if (target.child && target.child.length === data.length) {
          const result: unknown[] = []
          for (let i = 0; i < data.length; i++) {
            if (!checkValue(target.child[i], data[i])) {
              throw new TypeError(`${target.child[i].name} type not equal data ${i}th elements type`)
            }
            result.push(transformValue(target.child[i], data[i]))
          }
          return result
        }

        throw new TypeError(`${target.name} elements length not equal data elements length`)
      }
      throw new TypeError(`${target.name} type must is tuple`)
    }
    case RuleValueType.LIST: {
      if (Array.isArray(data)) {
        const result: unknown[] = []

        if (target.child) {
          for (const element of data) {
            let flag = true
            for (const type of target.child) {
              if (checkValue(type, element)) {
                flag = false
                result.push(transformValue(type, element))
                break
              }
            }
            if (flag) {
              throw new TypeError(`${element} type not is ${target.name} element type`)
            }
          }
        }

        return result
      }
      throw new TypeError(`${target.name} type must is array`)
    }
    case RuleValueType.OBJECT: {
      const isObject = (data: unknown): data is Record<string, unknown> => typeof data === 'object' && data !== null

      if (isObject(data)) {
        const result: Record<string, unknown> = {}

        if (target.child) {
          for (const property of target.child) {
            if (!data[property.name]) {
              if (property.required) throw new EvalError(`${target.name} need has ${property.name} field`)
              continue
            }
            if (!checkValue(property, data[property.name])) {
              throw new TypeError(`${data[property.name]} type not is ${target.name}.${property.name} need type`)
            }
            result[property.name] = transformValue(property, data[property.name] as Record<string, unknown>)
          }
        }

        return result
      }
      throw new TypeError(`${data} type not is object`)
    }
    case RuleValueType.DATE:
    case RuleValueType.TIME: {
      const datetime = Date.parse(`${data}`)
      if (Number.isFinite(datetime)) {
        return `${data}`
      }
      throw new TypeError(`parse type error, ${target.name} must date or time type`)
    }
    default: {
      const _: never = target.type
      break
    }
  }
  return null
}
