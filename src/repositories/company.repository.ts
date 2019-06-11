import { DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory } from '@loopback/repository';
import { Company, CompanyRelations, User, Deal, Customer, ServiceUser } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { UserRepository } from './user.repository';
import { DealRepository } from './deal.repository';
import { CustomerRepository } from './customer.repository';
import { ServiceUserRepository } from './service-user.repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
  > {

  public readonly user: BelongsToAccessor<User, typeof Company.prototype.id>;

  public readonly deals: HasManyRepositoryFactory<Deal, typeof Company.prototype.id>;

  public readonly customers: HasManyRepositoryFactory<Customer, typeof Company.prototype.id>;

  public readonly serviceUsers: HasManyRepositoryFactory<ServiceUser, typeof Company.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('DealRepository') protected dealRepositoryGetter: Getter<DealRepository>, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>, @repository.getter('ServiceUserRepository') protected serviceUserRepositoryGetter: Getter<ServiceUserRepository>,
  ) {
    super(Company, dataSource);
    this.serviceUsers = this.createHasManyRepositoryFactoryFor('serviceUsers', serviceUserRepositoryGetter);
    this.customers = this.createHasManyRepositoryFactoryFor('customers', customerRepositoryGetter);
    this.deals = this.createHasManyRepositoryFactoryFor('deals', dealRepositoryGetter);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
  }
}
