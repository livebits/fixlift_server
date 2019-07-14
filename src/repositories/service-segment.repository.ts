import { DefaultCrudRepository, BelongsToAccessor, repository } from '@loopback/repository';
import { ServiceSegment, ServiceSegmentRelations, Segment } from '../models';
import { DbDataSource } from '../datasources';
import { inject, Getter } from '@loopback/core';
import { SegmentRepository } from './segment.repository';

export class ServiceSegmentRepository extends DefaultCrudRepository<
  ServiceSegment,
  typeof ServiceSegment.prototype.id,
  ServiceSegmentRelations
  > {

  public readonly segment: BelongsToAccessor<Segment, typeof ServiceSegment.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SegmentRepository') protected segmentRepositoryGetter: Getter<SegmentRepository>,
  ) {
    super(ServiceSegment, dataSource);
    this.segment = this.createBelongsToAccessorFor('segment', segmentRepositoryGetter);
  }
}
