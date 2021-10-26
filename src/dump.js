import { TYPES, typeOf } from './type'

const repeat = (str, times) => times <= 1 ? str : str + repeat(str, times - 1)

/**
 * @param {string} padding
 * @param {string} text
 * @return {string}
 */
const addPadding = (padding, text) => {
  const lines = text.split("\n")
  const first = lines.shift()

  return [first, ...lines.map(line => padding + line)].join("\n")
}

function stringify (value, padding) {
  switch (typeOf(value)) {
    case TYPES.BOOLEAN:
      return value ? 'true' : 'false'
    case TYPES.FUNCTION:
      return addPadding(padding, '' + value)
    case TYPES.REGEXP:
      return value.toString()
    case TYPES.NULL:
      return 'null'
    case TYPES.NUMBER:
      return value
    case TYPES.STRING:
      return `'${value}'`
    case TYPES.UNDEFINED:
      return 'undefined'
  }

  return '' + value
}

const isObjectType = type => [TYPES.ARRAY, TYPES.RECORD].includes(type) || type.includes('InstanceOf')

function dumpObject (obj, dumpedBody, key = false, padding = '') {
  const name = obj.constructor.name

  const hint = ['Array', 'Object'].includes(name) ? '' : ' // InstanceOf<' + name + '>'

  const bracketOpen = name === 'Array' ? '[' : '{'
  const bracketClose = name === 'Array' ? ']' : '}'

  const prefix = key ? `'${key}': ` : ''

  return [
    padding + prefix + bracketOpen + hint + "\n",
    dumpedBody,
    padding + bracketClose,
  ].join('')
}

function dumpContent (value, level, maxNestingLevel) {
  let output = ''

  if (!level) {
    level = 0;
  }

  if (level > maxNestingLevel) {
    return '[Max nesting level reached (' + maxNestingLevel + ') ]'
  }

  const type = typeOf(value)
  const padding = repeat('    ', level + 1)

  if (isObjectType(type)) {
    for (let key in value) {
      const item = value[key]

      if (isObjectType(typeOf(item))) {
        const k = type === TYPES.ARRAY ? false : key

        output += dumpObject(item, dumpContent(item, level + 1), k, padding)
        output += ",\n"
      } else {
        const prefix = type === TYPES.ARRAY ? '' : `'${key}': `

        output += padding + prefix + stringify(item, padding)
        output += ",\n"
      }
    }
  } else {
    output = stringify(value, padding)
  }

  return output
}

export default function dump (value, maxNestingLevel = 512) {
  if (isObjectType(typeOf(value))) {
    return dumpObject(value, dumpContent(value, 0, maxNestingLevel))
  }

  return stringify(value, '')
}
