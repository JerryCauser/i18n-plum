import type { RemoteI18Options } from './i18n-remote.js'
import I18nRemote from './i18n-remote.js'

export interface I18nCacheStorage {
  set: (key: any, value: DictRecord | string) => void
  get: (key: any) => DictRecord | string | null
}

export interface CacheI18Options extends RemoteI18Options {
  storage?: I18nCacheStorage
}

export class I18nRemoteCache extends I18nRemote {
  #storage: I18nCacheStorage

  constructor (options?: CacheI18Options) {
    super(options)

    this.#storage = options?.storage ?? new Map()
  }

  async loadLocale (lang: string): Promise<void> {
    if (!this.has(lang)) {
      let cachedTable = this.#storage.get(lang)
      if (typeof cachedTable === 'string') {
        cachedTable = JSON.parse(cachedTable) as DictRecord
      }

      if (cachedTable !== null) this.extend(lang, cachedTable)
    }

    return await super.loadLocale(lang)
  }
}

export default I18nRemoteCache
