import { type RuleOperate, RuleOperateType } from './RuleOperate'
import { RuleStatementType, type RuleStatement } from './RuleStatement'
import { type RuleValue, RuleValueType } from './RuleValue'

export type RuleEngineStatementHandlerName = `execute${Uppercase<RuleStatementType>}`

export type RuleEngineStatementHandler = {
  [K in RuleEngineStatementHandlerName]: (rule: RuleStatement, data: unknown) => unknown
}

function applyStatic<T extends RuleEngineStatementHandler>(Constructor: T) {
  return Constructor
}

class RuleEvent {

  constructor(
    private readonly result: unknown = undefined,
  ) {}

  public listen(callback: (args: unknown) => void) {
    console.log('listen')
    callback(this.result)
  }
}
@applyStatic
export class RuleEngine {
  private id = 0
  private rules: { id: number, rule: RuleStatement }[] = []

  constructor() {
    console.log('RuleEngine')
  }

  public addRule(rule: RuleStatement): number
  public addRule(rules: RuleStatement): number
  public addRule(...rule: RuleStatement[]): number
  public addRule(...rules: RuleStatement[]): number {
    this.rules.push(...rules.map(rule => ({ id: this.id++, rule })))
    return this.id
  }

  public removeRule(id: number): void
  public removeRule(rule: RuleStatement): void
  public removeRule(rule: number | RuleStatement): void {
    if (typeof rule === 'number') {
      this.rules = this.rules.filter(r => r.id !== rule)
    } else {
      this.rules = this.rules.filter(r => r.rule !== rule)
    }
  }

  public clearRule(): void {
    this.rules = []
  }

  public execute(data: unknown): RuleEvent {

    const result: Record<number, RuleStatement> = {}

    const event = new RuleEvent(result)

    return event
  }

  public static checkValue(value: RuleValue, data: unknown): boolean {
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
              return value.child?.some(child => RuleEngine.checkValue(child, item))
            })
          }

          return true
        }
        return false
      }
      case RuleValueType.TUPLE: {
        if (Array.isArray(data) && value.child?.length && value.child.length === data.length) {
          for (let i = 0; i < value.child.length; i++) {
            if (!RuleEngine.checkValue(value.child[i], data[i])) {
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
                if (!RuleEngine.checkValue(property, data[property.name])) {
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

  public static transformValue(target: RuleValue, data: unknown): unknown {
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
              if (!RuleEngine.checkValue(target.child[i], data[i])) {
                throw new TypeError(`${target.child[i].name} type not equal data ${i}th elements type`)
              }
              result.push(RuleEngine.transformValue(target.child[i], data[i]))
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
                if (RuleEngine.checkValue(type, element)) {
                  flag = false
                  result.push(RuleEngine.transformValue(type, element))
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
              if (!RuleEngine.checkValue(property, data[property.name])) {
                throw new TypeError(`${data[property.name]} type not is ${target.name}.${property.name} need type`)
              }
              result[property.name] = RuleEngine.transformValue(property, data[property.name])
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

  public static executeRule(rule: RuleStatement, data: unknown) {

    if (!RuleEngine.checkValue(rule.target, data)) {
      return
    }

    switch (rule.type) {
      case RuleStatementType.IF:
        return RuleEngine.executeIF(rule, data)
      case RuleStatementType.ELIF:
        return RuleEngine.executeELIF(rule, data)
      case RuleStatementType.ELSE:
        return RuleEngine.executeELSE(rule, data)
      case RuleStatementType.FOR:
        return RuleEngine.executeFOR(rule, data)
      case RuleStatementType.WHILE:
        return RuleEngine.executeWHILE(rule, data)
      case RuleStatementType.DELAY:
        return RuleEngine.executeDELAY(rule, data)
      case RuleStatementType.TRY:
        return RuleEngine.executeTRY(rule, data)
      case RuleStatementType.ASSIGN:
        return RuleEngine.executeASSIGN(rule, data)
      case RuleStatementType.DEL:
        return RuleEngine.executeDEL(rule, data)
      case RuleStatementType.CLEAR:
        return RuleEngine.executeCLEAR(rule, data)
      case RuleStatementType.VAR:
        return RuleEngine.executeVAR(rule, data)
      case RuleStatementType.BREAK:
        return RuleEngine.executeBREAK(rule, data)
      case RuleStatementType.CONTINUE:
        return RuleEngine.executeCONTINUE(rule, data)
      case RuleStatementType.RETURN:
        return RuleEngine.executeRETURN(rule, data)
      default: {
        const _: never = rule.type
        break
      }
    }
  }

  public static retryWrapper<R = unknown>(callback: () => R, retry: RuleStatement['retry']): R | null {
    const quantity = typeof retry === 'number' ? retry : (retry?.limit ?? 1)

    const print = (pass = false) => {
      if (!(typeof retry === 'number')) {
        if (typeof retry?.message === 'string') {
          console.log(retry.message)
        }
        if (typeof retry?.message === 'object') {
          console.log(
            pass ? retry.message.pass : retry.message.fail
          )
        }
      }
    }

    for (let i = 0; i < quantity; i++) {
      try {
        const result = callback()
        print(true)
        return result
      } catch (error) {
        print(false)
      }
    }

    return null
  }

  public static executeOperate(operate: RuleOperate, data: unknown) {
    if (RuleEngine.checkValue(operate.target, data)) {
      switch (operate.operate) {
      }
    }
  }

  public static executeIF(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {
    }, rule.retry)
  }

  public static executeELIF(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeELSE(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeFOR(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeWHILE(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {

    }, rule.retry)
  }

  public static executeDELAY(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeTRY(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeASSIGN(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeDEL(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeCLEAR(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeVAR(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeBREAK(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeCONTINUE(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }

  public static executeRETURN(rule: RuleStatement, data: unknown) {
    return RuleEngine.retryWrapper(() => {}, rule.retry)
  }
}
