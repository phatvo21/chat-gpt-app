import { BaseEntity } from '@app/common/schemas/base.schema';
import { Logger, NotFoundException } from '@nestjs/common';
import { assign, isEmpty, map } from 'lodash';
import { DeleteResult } from 'mongodb';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { nanoid } from 'nanoid';

import { BaseRepositoryInterface } from './base-repository.interface';

export abstract class BaseRepository<T extends BaseEntity> implements BaseRepositoryInterface<T> {
  private baseModel: Model<T>;

  protected abstract readonly logger: Logger;

  protected constructor(model: Model<T>) {
    this.baseModel = model;
  }

  public parse(entity): T {
    return entity.toJSON() as T;
  }

  public async findById(
    id: string,
    projection?: any | null,
    options?: (QueryOptions & { suppressNotFound?: boolean }) | null,
  ): Promise<Partial<T>> {
    const calledId = nanoid();
    this.logger.log({ calledId, id }, '.findById called');
    return this.findOne({ _id: id }, projection, options);
  }

  public async findOne(
    filter: FilterQuery<T & any>,
    projection?: any | null,
    options?: (QueryOptions & { suppressNotFound?: boolean }) | null,
  ): Promise<T> {
    const defaultProjection = { 'history.previousData': 0 };
    const queryProjection = isEmpty(projection) ? defaultProjection : projection;

    const defaultOptions = { lean: true };
    const queryOptions = assign(defaultOptions, options || {});

    const calledId = nanoid();
    this.logger.log({ calledId, filter, projection, options }, '.findOne called');

    let result;

    try {
      result = await this.baseModel.findOne(filter, queryProjection, queryOptions).exec();

      if (queryOptions.suppressNotFound) return result;

      if (!result) throw new NotFoundException();
    } catch (error) {
      this.logger.warn({ error, calledId, filter, projection, options }, '.findOne thrown error!');
      throw error;
    }

    this.logger.log({ calledId, filter, projection, options }, '.findOne found result');

    return result;
  }

  public async findMany(
    filter: FilterQuery<T & any>,
    projection: any | null = { 'history.previousData': 0 },
    options?: (QueryOptions & { suppressNotFound?: boolean }) | null,
  ): Promise<Array<T> | null> {
    const calledId = nanoid();
    this.logger.log({ calledId, filter, projection, options }, '.findMany called');

    const defaultOptions = { lean: true };
    const queryOptions = assign(defaultOptions, options || {});

    const result = await this.baseModel.find(filter, projection, queryOptions).exec();

    this.logger.log({ calledId, ids: map(result, '_id') }, '.findById found result');
    return result;
  }

  public async create(entity: Partial<T>): Promise<T> {
    const calledId = nanoid();

    delete entity._id;
    delete entity.createdAt;
    delete entity.updatedAt;

    this.logger.log({ calledId, entity }, '.create called');
    const newEntity = await new this.baseModel(entity).save();
    this.logger.log({ calledId, id: newEntity.id }, '.create success');
    return this.parse(newEntity);
  }

  public async findManyByIds(
    ids: string[],
    projection?: any | null,
    options?: QueryOptions | null,
  ): Promise<Array<T> | null> {
    const calledId = nanoid();
    this.logger.log({ calledId, ids, projection, options }, '.findManyByIds called');

    return this.findMany({ _id: ids }, projection, options);
  }

  public updateById(id: string, entity: Partial<T>): Promise<T> {
    const calledId = nanoid();
    this.logger.log({ calledId, id, entity }, '.updateById called');
    return this.update({ _id: id }, entity);
  }

  public async update(filter: FilterQuery<T & any>, entity: Partial<T>): Promise<T> {
    const calledId = nanoid();
    this.logger.log({ calledId, filter, entity }, '.update called');

    delete entity._id;
    delete entity.createdAt;
    delete entity.updatedAt;

    let result;
    try {
      const oldEntity = await this.findOne(filter);

      if (!oldEntity) throw new NotFoundException();

      const updatePayload = {
        $set: entity,
      };

      result = await this.baseModel.findOneAndUpdate(filter, updatePayload, { new: true }).lean().exec();
    } catch (error) {
      this.logger.warn({ error, calledId }, '.update thrown error!');
      throw error;
    }

    this.logger.log({ calledId }, '.updateById success');
    return result;
  }

  public async deleteById(id: string): Promise<DeleteResult> {
    const calledId = nanoid();
    this.logger.log({ calledId, id }, '.delete called');

    return this.baseModel.deleteOne({ _id: id });
  }

  public async deleteMany(filter: FilterQuery<T & any>): Promise<any> {
    const calledId = nanoid();
    this.logger.log({ calledId, filter }, '.deleteMany called');

    return this.baseModel.deleteMany(filter).exec();
  }
}
