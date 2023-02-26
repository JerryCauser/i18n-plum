import type * as React from 'react'
import { useContext, createContext, useState, useRef, useEffect } from 'react'
import type { CacheI18Options } from './i18n-remote-cache.js'
import { I18nRemoteCache } from './i18n-remote-cache.js'

interface initI18nReactOptions extends CacheI18Options {
  defaultLocale?: string
}

interface I18nReactWrapperOptions {
  children: React.ReactElement
  locale?: string | null
  lngDict?: DictRecord
}

interface initialisedI18NReact {
  I18nContext: React.Context<I18nReact>
  I18nWrapper: (options: I18nReactWrapperOptions) => React.ReactElement
  useI18n: () => I18nReact
}

class I18nReact extends I18nRemoteCache {}

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

  const I18nContext = createContext<I18nReact>(i18nHelper)

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
      <I18nContext.Provider value={i18nHelper}>{children}</I18nContext.Provider>
    )
  }

  function useI18n (): I18nReact {
    const i18n = useContext(I18nContext)

    return i18n
  }

  return {
    I18nContext,
    I18nWrapper,
    useI18n
  }
}
