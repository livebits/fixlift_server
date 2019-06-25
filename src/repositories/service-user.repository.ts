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
}
