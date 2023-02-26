export {}

declare global {
  type Nullable<T> = T | undefined | null

  interface DictRecord {
    [index: string]: string | DictRecord
  }

  type MapRecord = Map<string, string | MapRecord>
}
