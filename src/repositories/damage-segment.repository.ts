import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DamageSegment, DamageSegmentRelations, Segment} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SegmentRepository} from './segment.repository';

export class DamageSegmentRepository extends DefaultCrudRepository<
  DamageSegment,
  typeof DamageSegment.prototype.id,
  DamageSegmentRelations
> {

  public readonly segment: BelongsToAccessor<Segment, typeof DamageSegment.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SegmentRepository') protected segmentRepositoryGetter: Getter<SegmentRepository>,
  ) {
    super(DamageSegment, dataSource);
    this.segment = this.createBelongsToAccessorFor('segment', segmentRepositoryGetter,);
  }
}
