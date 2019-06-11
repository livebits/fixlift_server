import {DefaultCrudRepository} from '@loopback/repository';
import {ChecklistCategory, ChecklistCategoryRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ChecklistCategoryRepository extends DefaultCrudRepository<
  ChecklistCategory,
  typeof ChecklistCategory.prototype.id,
  ChecklistCategoryRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ChecklistCategory, dataSource);
  }
}
