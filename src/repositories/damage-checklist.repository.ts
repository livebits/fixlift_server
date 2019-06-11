import {DefaultCrudRepository} from '@loopback/repository';
import {DamageChecklist, DamageChecklistRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DamageChecklistRepository extends DefaultCrudRepository<
  DamageChecklist,
  typeof DamageChecklist.prototype.id,
  DamageChecklistRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DamageChecklist, dataSource);
  }
}
