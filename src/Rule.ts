import { checkValue } from './CheckValue'
import { type RuleOperate, RuleOperateType } from './RuleOperate'
import { RuleStatementType, type RuleStatement } from './RuleStatement'

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

  public static executeRule(rule: RuleStatement, data: unknown) {

    if (!checkValue(rule.target, data)) {
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
    if (checkValue(operate.target, data)) {
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
