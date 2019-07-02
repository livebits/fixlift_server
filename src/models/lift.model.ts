import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'lifts' })
export class Lift extends Entity {

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
    type: 'string',
    mysql: {
      columnName: 'national_id',
    },
  })
  nationalId?: string;

  @property({
    type: 'number',
  })
  capacity?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'stops_count',
    },
  })
  stopsCount?: number;

  @property({
    type: 'string',
    mysql: {
      columnName: 'device_type_id',
    },
  })
  deviceTypeId?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'lift_type',
    },
  })
  liftType?: string;

  @property({
    type: 'number',
    mysql: {
      columnName: 'deal_id',
    },
  })
  dealId?: number;


  constructor(data?: Partial<Lift>) {
    super(data);
  }
}

export interface LiftRelations {

}

export type LiftWithRelations = Lift & LiftRelations;
