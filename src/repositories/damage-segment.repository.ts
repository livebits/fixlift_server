import {DefaultCrudRepository} from '@loopback/repository';
import {DamageSegment, DamageSegmentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DamageSegmentRepository extends DefaultCrudRepository<
  DamageSegment,
  typeof DamageSegment.prototype.id,
  DamageSegmentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(DamageSegment, dataSource);
  }
}
