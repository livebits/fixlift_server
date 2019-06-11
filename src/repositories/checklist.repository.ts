import {DefaultCrudRepository} from '@loopback/repository';
import {Checklist, ChecklistRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ChecklistRepository extends DefaultCrudRepository<
  Checklist,
  typeof Checklist.prototype.id,
  ChecklistRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Checklist, dataSource);
  }
}
