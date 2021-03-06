/**
 * This file contains all type transformations used by schema builder
 */

/**
 * Drop keys K from T.
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * T & U but where overlapping properties use the type from U only.
 */
export type Overwrite<T, U> = Omit<T, Extract<keyof T, keyof U>> & U;

/**
 * Like `T & U`, but where there are overlapping properties use the
 * type from T[P] | U[P].
 */
export type Merge<T, U> = Omit<T, Extract<keyof T, keyof U>> & Omit<U, Extract<keyof U, keyof T>> & { [P in keyof (T | U)]: (T[P] | U[P]) };

/**
 * Type modifier that makes all properties optionals deeply
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
};

/**
 * Make all properties of T required and non-nullable.
 */
export type Required<T> = {
    [P in keyof T]-?: T[P];
}

/**
 * T with properties K optionals
 */
export type PartialProperties<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>

/**
 * T with properties K required
 */
export type RequiredProperties<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

/**
 * T with property K renamed to K2. Optional is detected with conditional type.
 * Note : {} extends {K?: any} is true whereas {} extends {K: any} is false
 */
export type Rename<T, K extends keyof T, K2 extends keyof any> = {} extends Pick<T, K> ? RenameOptional<T, K, K2> : RenameRequired<T, K, K2>;

/**
 * T with property K renamed to K2 with required modifier
 */
export type RenameRequired<T, K extends keyof T, K2 extends keyof any> = Omit<T, K> & { [P in K2]: T[K] }

/**
 * T with property K renamed to K2 and optional modifier
 */
export type RenameOptional<T, K extends keyof T, K2 extends keyof any> = Omit<T, K> & { [P in K2]?: T[K] }

/**
 * T with properties K Transformed to U | T[K]
 */
export type TransformProperties<T, K extends keyof T, U> = Omit<T, K> & { [P in K]: (T[P] | U) }

/**
 * T with properties K Transformed to T[P] | T[P][] only if T[P] is not already an Array
 */
export type TransformPropertiesToArray<T, K extends keyof T> = Omit<T, K> & { [P in K]: T[P] extends any[] ? T[P] : (T[P] | T[P][]) }

/**
 * T with properties K Transformed to A | T[P] only if T[P] is A[]
 */
export type UnwrapArrayProperties<T, K extends keyof T> = Omit<T, K> & { [P in K]: T[P] extends Array<infer A> ? (A | T[P]) : T[P] }

/**
 * Combine T with properties K of type U
 */
export type Combine<T, U, K extends keyof any, R extends boolean, N extends boolean> = R extends true ? N extends true ? T & { [P in K]: U | null } : T & { [P in K]: U } : N extends true ? T & { [P in K]?: U | null } : T & { [P in K]?: U }

/**
 * Make all optional properties of T nullable.
 */
export type Nullable<T> = {
    [P in keyof T]: undefined extends T[P] ? T[P] | null : T[P];
}