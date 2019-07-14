import { DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory, Filter, Options, HasOneRepositoryFactory } from '@loopback/repository';
import { Deal, DealRelations, Company, Damage, Service, ServiceUser, Customer, Insurance, Lift } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { CompanyRepository } from './company.repository';
import { DamageRepository } from './damage.repository';
import { ServiceRepository } from './service.repository';
import { ServiceUserRepository } from './service-user.repository';
import { CustomerRepository } from './customer.repository';
import { InsuranceRepository } from './insurance.repository';
import { LiftRepository } from './lift.repository';

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

  public readonly insurance: HasOneRepositoryFactory<Insurance, typeof Deal.prototype.id>;

  public readonly lift: HasOneRepositoryFactory<Lift, typeof Deal.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CompanyRepository') protected companyRepositoryGetter: Getter<CompanyRepository>,
    @repository.getter('DamageRepository') protected damageRepositoryGetter: Getter<DamageRepository>,
    @repository.getter('ServiceRepository') protected serviceRepositoryGetter: Getter<ServiceRepository>,
    @repository.getter('ServiceUserRepository') protected serviceUserRepositoryGetter: Getter<ServiceUserRepository>,
    @repository.getter('CustomerRepository') protected customerRepositoryGetter: Getter<CustomerRepository>,
    @repository.getter('InsuranceRepository') protected insuranceRepositoryGetter: Getter<InsuranceRepository>,
    @repository.getter('LiftRepository') protected liftRepositoryGetter: Getter<LiftRepository>,
  ) {
    super(Deal, dataSource);
    this.insurance = this.createHasOneRepositoryFactoryFor('insurance', insuranceRepositoryGetter);
    this.lift = this.createHasOneRepositoryFactoryFor('lift', liftRepositoryGetter);
    this.customer = this.createBelongsToAccessorFor('customer', customerRepositoryGetter);
    this.serviceUser = this.createBelongsToAccessorFor('serviceUser', serviceUserRepositoryGetter);
    this.services = this.createHasManyRepositoryFactoryFor('services', serviceRepositoryGetter);
    this.damages = this.createHasManyRepositoryFactoryFor('damages', damageRepositoryGetter);
    this.company = this.createBelongsToAccessorFor('company', companyRepositoryGetter);
  }

  async findByRelations(
    filter?: Filter<Deal>,
    options?: Options,
  ): Promise<DealRelations[]> {
    // Prevent juggler for applying "include" filter
    // Juggler is not aware of LB4 relations
    const include = filter && filter.include;
    filter = { ...filter, include: undefined };

    const result = await super.find(filter, options);

    // poor-mans inclusion resolver, this should be handled by DefaultCrudRepo
    // and use `inq` operator to fetch related todo-lists in fewer DB queries
    // this is a temporary implementation, please see
    // https://github.com/strongloop/loopback-next/issues/3195
    // if (include && include.length && include[0].relation === 'services') {
    await Promise.all(
      result.map(async r => {
        // eslint-disable-next-line require-atomic-updates
        r.services = await this.services(r.id).find();
      }),
    );
    // }

    return result;
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
