export type Nullable<T> = T | undefined | null

export interface DictRecord {
  [index: string]: string | DictRecord
}

export type MapRecord = Map<string, string | MapRecord>
