import { DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory } from '@loopback/repository';
import { Damage, DamageRelations, Deal, DamageChecklist, DamageSegment, DamageFactor, ServiceUser } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { DealRepository } from './deal.repository';
import { DamageChecklistRepository } from './damage-checklist.repository';
import { DamageSegmentRepository } from './damage-segment.repository';
import { DamageFactorRepository } from './damage-factor.repository';
import { ServiceUserRepository } from './service-user.repository';

export class DamageRepository extends DefaultCrudRepository<
  Damage,
  typeof Damage.prototype.id,
  DamageRelations
  > {

  public readonly deal: BelongsToAccessor<Deal, typeof Damage.prototype.id>;
  public readonly serviceUser: BelongsToAccessor<ServiceUser, typeof Damage.prototype.id>;

  public readonly damageChecklists: HasManyRepositoryFactory<DamageChecklist, typeof Damage.prototype.id>;

  public readonly damageSegments: HasManyRepositoryFactory<DamageSegment, typeof Damage.prototype.id>;

  public readonly damageFactors: HasManyRepositoryFactory<DamageFactor, typeof Damage.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('DealRepository') protected dealRepositoryGetter: Getter<DealRepository>,
    @repository.getter('DamageChecklistRepository') protected damageChecklistRepositoryGetter: Getter<DamageChecklistRepository>,
    @repository.getter('DamageSegmentRepository') protected damageSegmentRepositoryGetter: Getter<DamageSegmentRepository>,
    @repository.getter('DamageFactorRepository') protected damageFactorRepositoryGetter: Getter<DamageFactorRepository>,
    @repository.getter('ServiceUserRepository') protected serviceUserRepositoryGetter: Getter<ServiceUserRepository>
  ) {
    super(Damage, dataSource);
    this.damageFactors = this.createHasManyRepositoryFactoryFor('damageFactors', damageFactorRepositoryGetter);
    this.damageSegments = this.createHasManyRepositoryFactoryFor('damageSegments', damageSegmentRepositoryGetter);
    this.damageChecklists = this.createHasManyRepositoryFactoryFor('damageChecklists', damageChecklistRepositoryGetter);
    this.deal = this.createBelongsToAccessorFor('deal', dealRepositoryGetter);
    this.serviceUser = this.createBelongsToAccessorFor('serviceUser', serviceUserRepositoryGetter);
  }

  async query(
    sql: string,
    params?: any,
    options?: any,
    getIndex?: number,
  ): Promise<(Damage & DamageRelations)[]> {
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
