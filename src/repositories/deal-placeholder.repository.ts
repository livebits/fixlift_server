import {DefaultCrudRepository} from '@loopback/repository';
import {DealPlaceholder, DealPlaceholderRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DealPlaceholderRepository extends DefaultCrudRepository<
  DealPlaceholder,
  typeof DealPlaceholder.prototype.id,
  DealPlaceholderRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DealPlaceholder, dataSource);
  }
}
