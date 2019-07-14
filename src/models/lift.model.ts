import { Entity, model, property, belongsTo } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { DeviceType, DeviceTypeWithRelations } from './device-type.model';
import { Deal } from './deal.model';

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

  @belongsTo(
    () => DeviceType,
    { keyFrom: 'deviceTypeId', name: 'deviceType' },
    {
      type: 'string',
      name: 'device_type_id',
      mysql: {
        columnName: 'device_type_id',
      },
    },
  )
  deviceTypeId?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'lift_type',
    },
  })
  liftType?: string;

  @belongsTo(
    () => Deal,
    { keyFrom: 'dealId', name: 'deal' },
    {
      type: 'number',
      name: 'deal_id',
      mysql: {
        columnName: 'deal_id',
      },
    },
  )
  dealId?: number;

  deviceType?: DeviceType;


  constructor(data?: Partial<Lift>) {
    super(data);
  }
}

export interface LiftRelations {
  deviceType?: DeviceTypeWithRelations
}

export type LiftWithRelations = Lift & LiftRelations;
