import { Model } from "@sequelize/core";
import { BaseModel } from "@/db/models/BaseModel";

export type ISortType = "ASC" | "DESC";

export type ModelInterface<T> = {
	// We need to map over the keys directly to preserve optionality. We filter with "as"
	// Exclude undefined from the check to properly handle optional properties
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	[K in keyof T as T[K] extends Function ? never : K extends keyof Model ? never : K]: Exclude<T[K], undefined> extends Array<infer E> ? Array<ModelInterface<E>> : T[K] extends BaseModel<Model> ? ModelInterface<T[K]> : Exclude<T[K], undefined> extends Record<string, never> ? ModelInterface<T[K]> : T[K];
};
