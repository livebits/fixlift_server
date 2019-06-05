import { DefaultCrudRepository, repository, HasManyRepositoryFactory } from '@loopback/repository';
import { User, UserRelations, Company } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { CompanyRepository } from './company.repository';

export type Credentials = {
  username: string;
  password: string;
};

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {

  public readonly companies: HasManyRepositoryFactory<Company, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CompanyRepository') protected companyRepositoryGetter: Getter<CompanyRepository>,
  ) {
    super(User, dataSource);
    this.companies = this.createHasManyRepositoryFactoryFor('companies', companyRepositoryGetter);
  }
}
