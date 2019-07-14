import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { Lift, LiftRelations, DeviceType } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { DeviceTypeRepository } from './device-type.repository';

export class LiftRepository extends DefaultCrudRepository<
  Lift,
  typeof Lift.prototype.id,
  LiftRelations
  > {

  public readonly deviceType: BelongsToAccessor<DeviceType, typeof Lift.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DeviceTypeRepository') protected deviceTypeRepositoryGetter: Getter<DeviceTypeRepository>,
  ) {
    super(Lift, dataSource);
    this.deviceType = this.createBelongsToAccessorFor('deviceType', deviceTypeRepositoryGetter);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(Lift & LiftRelations)[]> {
    return new Promise((resolve, reject) => {
      const connector = this.dataSource.connector!;
      connector.execute!(sql, params, options, (err: any, ...results: any) => {
        if (err) {
          return reject(err);
        }

        if (results.length === 0) {
          return resolve();
        }

        if (results.length === 1) {
          return resolve(results[0]);
        }

        if (getIndex) {
          return resolve(results[getIndex]);
        }

        resolve(results);
      });
    });
  }
}
