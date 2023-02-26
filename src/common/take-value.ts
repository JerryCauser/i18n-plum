/**
 * @param {Nullable<Map<string, any>>} map
 * @param {string | string[]} keys
 * @param {string} [separator]
 * @return {Nullable<string | Function>}
 */
function takeValue (
  map: Nullable<Map<string, any>>,
  keys: string | string[],
  separator: string = '.'
): Nullable<string | Function> {
  if (map === null || map === undefined) {
    return Array.isArray(keys) ? keys.join(separator) : keys
  }
  if (typeof keys === 'string') keys = keys.split(separator)
  if (!Array.isArray(keys) || keys.length === 0) return undefined
  if (keys.length === 1) return map.get(keys[0])

  let result = map.get(keys[0])

  for (let i = 1; Boolean(result) && i < keys.length; ++i) {
    result = result.get(keys[i])
  }

  return result
}

export default takeValue
