import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Service, ServiceRelations, Deal} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DealRepository} from './deal.repository';

export class ServiceRepository extends DefaultCrudRepository<
  Service,
  typeof Service.prototype.id,
  ServiceRelations
> {

  public readonly deal: BelongsToAccessor<Deal, typeof Service.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DealRepository') protected dealRepositoryGetter: Getter<DealRepository>,
  ) {
    super(Service, dataSource);
    this.deal = this.createBelongsToAccessorFor('deal', dealRepositoryGetter,);
  }
}
