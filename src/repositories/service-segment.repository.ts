import {DefaultCrudRepository} from '@loopback/repository';
import {ServiceSegment, ServiceSegmentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ServiceSegmentRepository extends DefaultCrudRepository<
  ServiceSegment,
  typeof ServiceSegment.prototype.id,
  ServiceSegmentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ServiceSegment, dataSource);
  }
}
