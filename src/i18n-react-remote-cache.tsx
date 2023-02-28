import type * as React from 'react'
import type { CacheI18Options } from './i18n-remote-cache.js'
import type { DictRecord } from './common/types.js'
import { useContext, createContext, useState, useRef, useEffect } from 'react'
import { I18nRemoteCache } from './i18n-remote-cache.js'

export interface initI18nReactOptions extends CacheI18Options {
  defaultLocale?: string
}

export interface I18nReactWrapperOptions {
  children: React.ReactElement
  locale?: string | null
  lngDict?: DictRecord
}

export type i18nContextValue = Pick<I18nReact, 't' | 'locale'>

export interface initialisedI18NReact {
  I18nContext: React.Context<i18nContextValue>
  I18nWrapper: (options: I18nReactWrapperOptions) => React.ReactElement
  i18nHelper: I18nReact
  useI18n: () => i18nContextValue
}

export class I18nReact extends I18nRemoteCache {}

export function initI18n (options?: initI18nReactOptions): initialisedI18NReact {
  options ??= {}

  const {
    defaultLocale = 'en',
    path,
    storage,
    fetcher,
    pathCompiler,
    languageToken
  } = options

  const i18nHelper = new I18nReact({
    path,
    storage,
    fetcher,
    pathCompiler,
    languageToken
  })

  i18nHelper.setLocale(defaultLocale)

  const pickContextValue: () => i18nContextValue = () => ({
    t: i18nHelper.t.bind(i18nHelper),
    locale: i18nHelper.locale
  })

  const I18nContext = createContext<i18nContextValue>(pickContextValue())

  function I18nWrapper (options: I18nReactWrapperOptions): React.ReactElement {
    const { children, locale = null, lngDict = null } = options

    const [, setTick] = useState(0)
    const forceRerender: () => void = () => setTick((tick: number) => tick + 1)

    const firstRender = useRef(true) as { current: boolean }

    useEffect(() => {
      i18nHelper.on('change', forceRerender)

      return () => {
        i18nHelper.off(forceRerender)
      }
    })

    if (firstRender.current && lngDict !== null && locale !== null) {
      firstRender.current = false
      i18nHelper.set(locale, lngDict)
      i18nHelper.setLocale(locale)
    }

    return (
      <I18nContext.Provider value={pickContextValue()}>{children}</I18nContext.Provider>
    )
  }

  function useI18n (): i18nContextValue {
    const i18n = useContext(I18nContext)

    return i18n
  }

  return {
    I18nContext,
    I18nWrapper,
    i18nHelper,
    useI18n
  }
}
