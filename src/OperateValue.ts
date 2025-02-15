import type { RuleOperateType, RuleOperate } from './RuleOperate'

type OperateHandlerName = `execute${Uppercase<RuleOperateType>}`

export const OperateHandler: Record<OperateHandlerName, (opreate: RuleOperate, data: Record<string, unknown>) => boolean> = {
  executeCONTAINS: (operate, data) => true,
  executeDEC: (operate, data) => true,
  executeDIV: (operate, data) => true,
  executeENDSWITH: (operate, data) => true,
  executeEQ: (operate, data) => true,
  executeNE: (operate, data) => true,
  executeGT: (operate, data) => true,
  executeGE: (operate, data) => true,
  executeLT: (operate, data) => true,
  executeLE: (operate, data) => true,
  executeIN: (operate, data) => true,
  executeNIN: (operate, data) => true,
  executeNCONTAINS: (operate, data) => true,
  executeSTARTSWITH: (operate, data) => true,
  executeNSTARTSWITH: (operate, data) => true,
  executeNENDSWITH: (operate, data) => true,
  executeREGEX: (operate, data) => true,
  executeNREGEX: (operate, data) => true,
  executeISNULL: (operate, data) => true,
  executeISUNDEFINED: (operate, data) => true,
  executeINC: (operate, data) => true,
  executeMUL: (operate, data) => true,
  executeLENGTH: (operate, data) => true,
  executeSET: (operate, data) => true
}


export function operateValue(operate: RuleOperate, data: Record<string, unknown>) {
  const handlerName: OperateHandlerName = `execute${operate.middle.toUpperCase() as Uppercase<RuleOperateType>}`
  if (handlerName in OperateHandler) {
    return OperateHandler[handlerName](operate, data)
  }

  return false
}
