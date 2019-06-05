import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

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

  @property({
    type: 'number',
    mysql: {
      columnName: 'segment_id',
    },
  })
  segmentId?: number;

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


  constructor(data?: Partial<ServiceSegment>) {
    super(data);
  }
}
