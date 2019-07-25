import { DefaultCrudRepository } from '@loopback/repository';
import { Emergency, EmergencyRelations } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class EmergencyRepository extends DefaultCrudRepository<
  Emergency,
  typeof Emergency.prototype.id,
  EmergencyRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Emergency, dataSource);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(Emergency & EmergencyRelations)[]> {
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
