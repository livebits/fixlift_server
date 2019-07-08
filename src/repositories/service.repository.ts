import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { Service, ServiceRelations, Deal } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { DealRepository } from './deal.repository';

export class ServiceRepository extends DefaultCrudRepository<
  Service,
  typeof Service.prototype.id,
  ServiceRelations
  > {

  public readonly deal: BelongsToAccessor<Deal, typeof Service.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DealRepository') protected dealRepositoryGetter: Getter<DealRepository>,
  ) {
    super(Service, dataSource);
    this.deal = this.createBelongsToAccessorFor('deal', dealRepositoryGetter);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(Service & ServiceRelations)[]> {
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
