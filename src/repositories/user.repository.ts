import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {User, UserRelations, Company, UserRole} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CompanyRepository} from './company.repository';
import {UserRoleRepository} from './user-role.repository';

export type Credentials = {
  username: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly companies: HasManyRepositoryFactory<
    Company,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CompanyRepository')
    protected companyRepositoryGetter: Getter<CompanyRepository>,
  ) {
    super(User, dataSource);

    this.companies = this.createHasManyRepositoryFactoryFor(
      'companies',
      companyRepositoryGetter,
    );
  }

  // async query(
  //   sql: string,
  //   params?: any,
  //   options?: any,
  //   getIndex?: any,
  // ): Promise<void> {
  //   return await this.helper.query(sql, params, options, getIndex);
  // }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(User & UserRelations)[]> {
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
