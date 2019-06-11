import {DefaultCrudRepository} from '@loopback/repository';
import {LiftFieldCategory, LiftFieldCategoryRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LiftFieldCategoryRepository extends DefaultCrudRepository<
  LiftFieldCategory,
  typeof LiftFieldCategory.prototype.id,
  LiftFieldCategoryRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LiftFieldCategory, dataSource);
  }
}
