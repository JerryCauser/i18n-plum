import type { DictRecord } from './common/types.js'
import type { I18nOptions } from './i18n.js'
import I18n from './i18n.js'

export type pathCompiler = (
  path: string,
  token: string,
  language: string
) => string
export type fetcher = (path: string) => Promise<DictRecord | Response | string>

export interface RemoteI18Options extends I18nOptions {
  path?: string
  fetcher?: fetcher
  languageToken?: string
  pathCompiler?: pathCompiler
}

export class I18nRemote extends I18n {
  #fetcher: fetcher
  #path: string
  #languageToken: string
  #pathCompiler: pathCompiler

  constructor (options?: RemoteI18Options) {
    super(options)

    this.#fetcher = options?.fetcher ?? (async (input: string) => await fetch(input))
    this.#languageToken = options?.languageToken ?? '{{lang}}'
    this.#path = options?.path ?? `/i18n/${this.#languageToken}.json`
    this.#pathCompiler =
      options?.pathCompiler ??
      function (path, token, language) {
        return path.replace(token, language)
      }
  }

  async loadLocale (langKey: string): Promise<void> {
    if (!this.has(langKey)) {
      const path = this.#pathCompiler(this.#path, this.#languageToken, langKey)
      let res = await this.#fetcher(path)

      if (res instanceof Response) res = await res.json()
      else if (typeof res === 'string') res = JSON.parse(res)

      this.extend(langKey, res as DictRecord)
    }

    super.setLocale(langKey)
  }

  setLocale (lang: string): void {
    this.loadLocale(lang).catch(console.error)
  }
}

export default I18nRemote
