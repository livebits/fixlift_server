import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'segments' })
export class Segment extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id: number;

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
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  country?: string;

  @property({
    type: 'string',
  })
  brand?: string;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'company_user_id',
    },
  })
  companyUserId?: number;

  constructor(data?: Partial<Segment>) {
    super(data);
  }
}

export interface SegmentRelations {

}

export type SegmentWithRelations = Segment & SegmentRelations;

export class CustomSegment extends Segment {
  @property({
    type: 'number',
  })
  count?: number;

  @property({
    type: 'string',
  })
  status?: string;
}
