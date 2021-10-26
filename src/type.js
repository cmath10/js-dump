export const TYPES = {
  ARRAY: 'ARRAY',
  BIGINT: 'BIGINT',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  ERROR: 'ERROR',
  FUNCTION: 'FUNCTION',
  NULL: 'NULL',
  NUMBER: 'NUMBER',
  RECORD: 'RECORD',
  REGEXP: 'REGEXP',
  STRING: 'STRING',
  SYMBOL: 'SYMBOL',
  UNDEFINED: 'UNDEFINED',
  UNKNOWN: 'UNKNOWN',
}

export function typeOf (value) {
  switch (typeof value) {
    case 'bigint':
      return TYPES.BIGINT
    case 'boolean':
      return TYPES.BOOLEAN
    case 'function':
      return TYPES.FUNCTION
    case 'number':
      return TYPES.NUMBER
    case 'string':
      return TYPES.STRING
    case 'symbol':
      return TYPES.SYMBOL
    case 'undefined':
      return TYPES.UNDEFINED
    case 'object':
      switch (true) {
        case value === null:
          return TYPES.NULL

        case Array.isArray(value):
          return TYPES.ARRAY

        case value instanceof Date:
          return TYPES.DATE

        case value instanceof Error:
          return TYPES.ERROR

        case value instanceof RegExp:
          return TYPES.REGEXP

        case value.constructor.name === 'Object':
          return TYPES.RECORD
      }

      return 'InstanceOf<' + value.constructor.name + '>'
  }

  return TYPES.UNKNOWN
}
