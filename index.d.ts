/// <reference types="react" />
declare module "common/take-value" {
    /**
     * @param {Nullable<Map<string, any>>} map
     * @param {string | string[]} keys
     * @param {string} [separator]
     * @return {Nullable<string | Function>}
     */
    function takeValue(map: Nullable<Map<string, any>>, keys: string | string[], separator?: string): Nullable<string | Function>;
    export default takeValue;
}
declare module "common/fill-template" {
    /**
     *
     * @param {string} template
     * @param {DictRecord} params
     * @return {string}
     */
    function fillTemplate(template: string, params: DictRecord): string;
    export default fillTemplate;
}
declare module "common/convert-dict-to-map" {
    /**
     * Recursively convert object to a map. Inner objects will be converted only if they have Object as the constructor
     * @param {Record<string, any>} dict
     * @return {Map<string, Exclude<any, Record<any, any>>>}
     */
    function convertDictToMap(dict: Record<string, any>): Map<string, Exclude<any, Record<any, any>>>;
    export default convertDictToMap;
}
declare module "i18n" {
    export interface I18nOptions {
        locale?: string;
        tables?: TablesRecordType;
        separator?: string;
    }
    export type TablesRecordType = Record<string, Nullable<DictRecord>>;
    export type TablesMapType = Map<string, Nullable<MapRecord>>;
    export class I18n {
        constructor(options?: I18nOptions);
        get locale(): string;
        has(lang: string): boolean;
        set(lang: string, table: DictRecord | MapRecord): void;
        extend(lang: string, table: DictRecord | MapRecord): void;
        delete(lang: string): boolean;
        setLocale(lang: string): void;
        get(lang: string): Nullable<MapRecord>;
        t(key: string | string[], params: DictRecord, lang?: string): string | any;
        emit(eventName: string, payload: any): boolean;
        on(eventName: string, fn: Function): I18n;
        once(eventName: string, fn: Function): I18n;
        off(fn: Function): I18n;
    }
    export default I18n;
}
declare module "i18n-remote" {
    import type { I18nOptions } from "i18n";
    import I18n from "i18n";
    export type pathCompiler = (path: string, token: string, language: string) => string;
    export type fetcher = (path: string) => Promise<DictRecord | Response | string>;
    export interface RemoteI18Options extends I18nOptions {
        path?: string;
        fetcher?: fetcher;
        languageToken?: string;
        pathCompiler?: pathCompiler;
    }
    export class I18nRemote extends I18n {
        constructor(options?: RemoteI18Options);
        loadLocale(langKey: string): Promise<void>;
        setLocale(lang: string): void;
    }
    export default I18nRemote;
}
declare module "i18n-remote-cache" {
    import type { RemoteI18Options } from "i18n-remote";
    import I18nRemote from "i18n-remote";
    export interface I18nCacheStorage {
        set: (key: any, value: DictRecord | string) => void;
        get: (key: any) => DictRecord | string | null;
    }
    export interface CacheI18Options extends RemoteI18Options {
        storage?: I18nCacheStorage;
    }
    export class I18nRemoteCache extends I18nRemote {
        constructor(options?: CacheI18Options);
        loadLocale(lang: string): Promise<void>;
    }
    export default I18nRemoteCache;
}
declare module "i18n-react-remote-cache" {
    import type * as React from 'react';
    import type { CacheI18Options } from "i18n-remote-cache";
    import { I18nRemoteCache } from "i18n-remote-cache";
    interface initI18nReactOptions extends CacheI18Options {
        defaultLocale?: string;
    }
    interface I18nReactWrapperOptions {
        children: React.ReactElement;
        locale?: string | null;
        lngDict?: DictRecord;
    }
    interface initialisedI18NReact {
        I18nContext: React.Context<I18nReact>;
        I18nWrapper: (options: I18nReactWrapperOptions) => React.ReactElement;
        useI18n: () => I18nReact;
    }
    class I18nReact extends I18nRemoteCache {
    }
    export function initI18n(options?: initI18nReactOptions): initialisedI18NReact;
}
declare module "common/types" {
    export {};
    global {
        type Nullable<T> = T | undefined | null;
        interface DictRecord {
            [index: string]: string | DictRecord;
        }
        type MapRecord = Map<string, string | MapRecord>;
    }
}
