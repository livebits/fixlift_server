import { DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory } from '@loopback/repository';
import { Customer, CustomerRelations, Company, Deal } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { CompanyRepository } from './company.repository';
import { DealRepository } from './deal.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
  > {

  public readonly company: BelongsToAccessor<Company, typeof Customer.prototype.id>;

  public readonly deals: HasManyRepositoryFactory<Deal, typeof Customer.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CompanyRepository') protected companyRepositoryGetter: Getter<CompanyRepository>, @repository.getter('DealRepository') protected dealRepositoryGetter: Getter<DealRepository>,
  ) {
    super(Customer, dataSource);
    this.deals = this.createHasManyRepositoryFactoryFor('deals', dealRepositoryGetter);
    this.company = this.createBelongsToAccessorFor('company', companyRepositoryGetter);
  }
}
