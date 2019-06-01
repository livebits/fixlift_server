import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'damage_segments' })
export class DamageSegment extends BaseEntity {

  @property({
    type: 'number',
    name: 'damage_id'
  })
  damageId?: number;

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
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<DamageSegment>) {
    super(data);
  }
}
