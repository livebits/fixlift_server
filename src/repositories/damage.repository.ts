import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Damage, DamageRelations, Deal} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DealRepository} from './deal.repository';

export class DamageRepository extends DefaultCrudRepository<
  Damage,
  typeof Damage.prototype.id,
  DamageRelations
> {

  public readonly deal: BelongsToAccessor<Deal, typeof Damage.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DealRepository') protected dealRepositoryGetter: Getter<DealRepository>,
  ) {
    super(Damage, dataSource);
    this.deal = this.createBelongsToAccessorFor('deal', dealRepositoryGetter,);
  }
}
