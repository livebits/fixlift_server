import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'damage_segments' })
export class DamageSegment extends Entity {

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
      columnName: 'damage_id',
    },
  })
  damageId?: number;

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
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<DamageSegment>) {
    super(data);
  }
}

export interface DamageSegmentRelations {

}

export type DamageSegmentWithRelations = DamageSegment & DamageSegmentRelations;
