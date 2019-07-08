import { DefaultCrudRepository } from '@loopback/repository';
import { CustomerMessage, CustomerMessageRelations } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class CustomerMessageRepository extends DefaultCrudRepository<
  CustomerMessage,
  typeof CustomerMessage.prototype.id,
  CustomerMessageRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(CustomerMessage, dataSource);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(CustomerMessage & CustomerMessageRelations)[]> {
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
