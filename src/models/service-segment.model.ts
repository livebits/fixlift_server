import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_segments' })
export class ServiceSegment extends BaseEntity {

  @property({
    type: 'number',
    name: 'service_id'
  })
  serviceId?: number;

  @property({
    type: 'number',
    name: 'segment_id'
  })
  segmentId?: number;

  @property({
    type: 'number',
  })
  count?: number;

  @property({
    type: 'number',
    name: 'single_cost'
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
