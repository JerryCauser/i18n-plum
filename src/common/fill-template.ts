import type { DictRecord } from './types.js'

/**
 *
 * @param {string} template
 * @param {DictRecord} params
 * @return {string}
 */
function fillTemplate (template: string, params: DictRecord): string {
  const regexp = /{{(.*?)}}/g

  // todo ".replace()" is a fast, but not efficient solution. May be prepare tables as a map functions?
  return template.replace(regexp, (_, match) => {
    const keys = match.trim().split('.')

    if (keys.length === 0) return ''

    let result: any = params[keys[0]]

    if (keys.length > 1) {
      for (let i = 1; Boolean(result) && i < keys.length; ++i) {
        result = result[keys[i]]
      }
    }

    if (typeof result === 'string') return result

    return ''
  })
}

export default fillTemplate
