import { DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import { Service, ServiceRelations, Deal, ServiceChecklist, ServiceSegment, ServiceFactor} from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { DealRepository } from './deal.repository';
import {ServiceChecklistRepository} from './service-checklist.repository';
import {ServiceSegmentRepository} from './service-segment.repository';
import {ServiceFactorRepository} from './service-factor.repository';

export class ServiceRepository extends DefaultCrudRepository<
  Service,
  typeof Service.prototype.id,
  ServiceRelations
  > {

  public readonly deal: BelongsToAccessor<Deal, typeof Service.prototype.id>;

  public readonly serviceChecklists: HasManyRepositoryFactory<ServiceChecklist, typeof Service.prototype.id>;

  public readonly serviceSegments: HasManyRepositoryFactory<ServiceSegment, typeof Service.prototype.id>;

  public readonly serviceFactors: HasManyRepositoryFactory<ServiceFactor, typeof Service.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DealRepository') protected dealRepositoryGetter: Getter<DealRepository>, @repository.getter('ServiceChecklistRepository') protected serviceChecklistRepositoryGetter: Getter<ServiceChecklistRepository>, @repository.getter('ServiceSegmentRepository') protected serviceSegmentRepositoryGetter: Getter<ServiceSegmentRepository>, @repository.getter('ServiceFactorRepository') protected serviceFactorRepositoryGetter: Getter<ServiceFactorRepository>,
  ) {
    super(Service, dataSource);
    this.serviceFactors = this.createHasManyRepositoryFactoryFor('serviceFactors', serviceFactorRepositoryGetter,);
    this.serviceSegments = this.createHasManyRepositoryFactoryFor('serviceSegments', serviceSegmentRepositoryGetter,);
    this.serviceChecklists = this.createHasManyRepositoryFactoryFor('serviceChecklists', serviceChecklistRepositoryGetter,);
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
