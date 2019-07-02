import { DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory } from '@loopback/repository';
import { Deal, DealRelations, Company, Damage, Service, ServiceUser, Customer, Insurance } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { CompanyRepository } from './company.repository';
import { DamageRepository } from './damage.repository';
import { ServiceRepository } from './service.repository';
import { ServiceUserRepository } from './service-user.repository';
import { CustomerRepository } from './customer.repository';
import { InsuranceRepository } from './insurance.repository';

export class DealRepository extends DefaultCrudRepository<
  Deal,
  typeof Deal.prototype.id,
  DealRelations
  > {

  public readonly company: BelongsToAccessor<Company, typeof Deal.prototype.id>;

  public readonly damages: HasManyRepositoryFactory<Damage, typeof Deal.prototype.id>;

  public readonly services: HasManyRepositoryFactory<Service, typeof Deal.prototype.id>;

  public readonly serviceUser: BelongsToAccessor<ServiceUser, typeof Deal.prototype.id>;

  public readonly customer: BelongsToAccessor<Customer, typeof Deal.prototype.id>;

  public readonly insurances: HasManyRepositoryFactory<Insurance, typeof Deal.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CompanyRepository') protected companyRepositoryGetter: Getter<CompanyRepository>, @repository.getter('DamageRepository') protected damageRepositoryGetter: Getter<DamageRepository>, @repository.getter('ServiceRepository') protected serviceRepositoryGetter: Getter<ServiceRepository>, @repository.getter('ServiceUserRepository') protected serviceUserRepositoryGetter: Getter<ServiceUserRepository>, @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>, @repository.getter('InsuranceRepository') protected insuranceRepositoryGetter: Getter<InsuranceRepository>,
  ) {
    super(Deal, dataSource);
    this.insurances = this.createHasManyRepositoryFactoryFor('insurances', insuranceRepositoryGetter);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter);
    this.serviceUser = this.createBelongsToAccessorFor('serviceUser', serviceUserRepositoryGetter);
    this.services = this.createHasManyRepositoryFactoryFor('services', serviceRepositoryGetter);
    this.damages = this.createHasManyRepositoryFactoryFor('damages', damageRepositoryGetter);
    this.company = this.createBelongsToAccessorFor('company', companyRepositoryGetter);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(Deal & DealRelations)[]> {
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
