import {DefaultCrudRepository} from '@loopback/repository';
import {ServiceChecklist, ServiceChecklistRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ServiceChecklistRepository extends DefaultCrudRepository<
  ServiceChecklist,
  typeof ServiceChecklist.prototype.id,
  ServiceChecklistRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ServiceChecklist, dataSource);
  }
}
