/**
 * Recursively convert object to a map. Inner objects will be converted only if they have Object as the constructor
 * @param {Record<string, any>} dict
 * @return {Map<string, Exclude<any, Record<any, any>>>}
 */
function convertDictToMap (
  dict: Record<string, any>
): Map<string, Exclude<any, Record<any, any>>> {
  const output = new Map()

  for (const key in dict) {
    if (Object.hasOwn(dict, key)) {
      const value = dict[key]
      if (
        value !== null &&
        typeof value === 'object' &&
        value.constructor?.name === 'Object'
      ) {
        output.set(key, convertDictToMap(value))
      } else {
        output.set(key, value)
      }
    }
  }

  return output
}

export default convertDictToMap
