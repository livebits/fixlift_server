import { DefaultCrudRepository, repository, BelongsToAccessor } from '@loopback/repository';
import { ServiceUser, ServiceUserRelations, Company } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { CompanyRepository } from './company.repository';

export class ServiceUserRepository extends DefaultCrudRepository<
  ServiceUser,
  typeof ServiceUser.prototype.id,
  ServiceUserRelations
  > {

  public readonly company: BelongsToAccessor<Company, typeof ServiceUser.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CompanyRepository') protected companyRepositoryGetter: Getter<CompanyRepository>,
  ) {
    super(ServiceUser, dataSource);
    this.company = this.createBelongsToAccessorFor('company', companyRepositoryGetter);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(ServiceUser & ServiceUserRelations)[]> {
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
