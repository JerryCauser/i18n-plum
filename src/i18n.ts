import takeValue from './common/take-value.js'
import fillTemplate from './common/fill-template.js'
import convertDictToMap from './common/convert-dict-to-map.js'

export interface I18nOptions {
  locale?: string
  tables?: TablesRecordType
  separator?: string
}

export type TablesRecordType = Record<string, Nullable<DictRecord>>
export type TablesMapType = Map<string, Nullable<MapRecord>>

interface eventContext {
  eventName: string
  once: boolean
}

export class I18n {
  #locale: string
  #tables: TablesMapType = new Map()
  #separator: string

  #eventFunctions: Map<Function, eventContext> = new Map()

  constructor (options?: I18nOptions) {
    this.#tables = convertDictToMap(options?.tables ?? {})
    this.#locale = options?.locale ?? ''
    this.#separator = options?.separator ?? '.'
  }

  get locale (): string {
    return this.#locale
  }

  has (lang: string): boolean {
    return this.#tables.has(lang)
  }

  set (lang: string, table: DictRecord | MapRecord): void {
    if (table instanceof Map) this.#tables.set(lang, table)
    else this.#tables.set(lang, convertDictToMap(table))
  }

  extend (lang: string, table: DictRecord | MapRecord): void {
    const record = this.#tables.get(lang)

    if (record === null || record === undefined) {
      return this.set(lang, table)
    }

    if (!(table instanceof Map)) table = convertDictToMap(table)

    for (const entry of table) record.set(entry[0], entry[1])
  }

  delete (lang: string): boolean {
    return this.#tables.delete(lang)
  }

  setLocale (lang: string): void {
    if (this.#locale !== lang) {
      // ??
      this.#locale = lang
      this.emit('change', lang)
    }
  }

  get (lang: string): Nullable<MapRecord> {
    return this.#tables.get(lang)
  }

  t (key: string | string[], params: DictRecord, lang?: string): string | any {
    const table = this.get(lang ?? this.#locale)
    const val = takeValue(table, key, this.#separator) ?? key.toString()

    if (typeof val === 'function') return val(params)

    return fillTemplate(val, params)
  }

  emit (eventName: string, payload: any): boolean {
    let output = false

    for (const [fn, context] of this.#eventFunctions) {
      if (eventName === context.eventName) {
        setTimeout(() => fn(payload), 0)
        if (context.once) this.#eventFunctions.delete(fn)
        output = true
      }
    }

    return output
  }

  on (eventName: string, fn: Function): I18n {
    this.#eventFunctions.set(fn, { eventName, once: false })

    return this
  }

  once (eventName: string, fn: Function): I18n {
    this.#eventFunctions.set(fn, { eventName, once: true })

    return this
  }

  off (fn: Function): I18n {
    this.#eventFunctions.delete(fn)

    return this
  }
}

export default I18n
