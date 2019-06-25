import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {
  Company,
  CompanyRelations,
  User,
  Deal,
  Customer,
  ServiceUser,
} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';
import {DealRepository} from './deal.repository';
import {CustomerRepository} from './customer.repository';
import {ServiceUserRepository} from './service-user.repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {
  public readonly user: BelongsToAccessor<User, typeof Company.prototype.id>;

  public readonly deals: HasManyRepositoryFactory<
    Deal,
    typeof Company.prototype.id
  >;

  public readonly customers: HasManyRepositoryFactory<
    Customer,
    typeof Company.prototype.id
  >;

  public readonly serviceUsers: HasManyRepositoryFactory<
    ServiceUser,
    typeof Company.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
    @repository.getter('DealRepository')
    protected dealRepositoryGetter: Getter<DealRepository>,
    @repository.getter('CustomerRepository')
    protected customerRepositoryGetter: Getter<CustomerRepository>,
    @repository.getter('ServiceUserRepository')
    protected serviceUserRepositoryGetter: Getter<ServiceUserRepository>,
  ) {
    super(Company, dataSource);
    this.serviceUsers = this.createHasManyRepositoryFactoryFor(
      'serviceUsers',
      serviceUserRepositoryGetter,
    );
    this.customers = this.createHasManyRepositoryFactoryFor(
      'customers',
      customerRepositoryGetter,
    );
    this.deals = this.createHasManyRepositoryFactoryFor(
      'deals',
      dealRepositoryGetter,
    );
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(Company & CompanyRelations)[]> {
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
