import { DefaultCrudRepository } from '@loopback/repository';
import { Segment, SegmentRelations } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class SegmentRepository extends DefaultCrudRepository<
  Segment,
  typeof Segment.prototype.id,
  SegmentRelations
  > {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Segment, dataSource);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(Segment & SegmentRelations)[]> {
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
