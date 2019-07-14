import { Entity, model, property, belongsTo } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Segment } from './segment.model';

@model({ name: 'service_segments' })
export class ServiceSegment extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'created_on',
    },
  })
  createdOn?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'modified_on',
    },
  })
  modifiedOn?: Date;

  @property({
    type: 'number',
    mysql: {
      columnName: 'service_id',
    },
  })
  serviceId?: number;

  @belongsTo(
    () => Segment,
    { keyFrom: 'segmentId', name: 'segment' },
    {
      type: 'number',
      name: 'segment_id',
      mysql: {
        columnName: 'segment_id',
      },
    },
  )
  segmentId: number;

  @property({
    type: 'number',
  })
  count?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'single_cost',
    },
  })
  singleCost?: number;

  @property({
    type: 'number',
  })
  cost?: number;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  segment?: Segment;

  constructor(data?: Partial<ServiceSegment>) {
    super(data);
  }
}

export interface ServiceSegmentRelations {

}

export type ServiceSegmentWithRelations = ServiceSegment & ServiceSegmentRelations;
