import { DeleteResult } from 'mongodb';
import { FilterQuery, QueryOptions } from 'mongoose';

export interface BaseRepositoryInterface<T> {
  findById(
    id: string,
    projection?: any | null,
    options?: (QueryOptions & { suppressNotFound?: boolean }) | null,
  ): Promise<Partial<T>>;

  findOne(
    filter: FilterQuery<T & any>,
    projection?: any | null,
    options?: (QueryOptions & { suppressNotFound?: boolean }) | null,
  ): Promise<T>;

  findMany(
    filter: FilterQuery<T & any>,
    projection: any,
    options?: (QueryOptions & { suppressNotFound?: boolean }) | null,
  ): Promise<Array<T> | null>;

  create(entity: Partial<T>): Promise<T>;

  findManyByIds(ids: string[], projection?: any | null, options?: QueryOptions | null): Promise<Array<T> | null>;

  updateById(id: string, entity: Partial<T>): Promise<T>;

  update(filter: FilterQuery<T & any>, entity: Partial<T>): Promise<T>;

  deleteById(id: string): Promise<DeleteResult>;

  deleteMany(filter: FilterQuery<T & any>): Promise<any>;
}
