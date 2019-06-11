import {DefaultCrudRepository} from '@loopback/repository';
import {Segment, SegmentRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SegmentRepository extends DefaultCrudRepository<
  Segment,
  typeof Segment.prototype.id,
  SegmentRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Segment, dataSource);
  }
}
