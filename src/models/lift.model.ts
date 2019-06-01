import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'lifts' })
export class Lift extends BaseEntity {

  @property({
    type: 'string',
    name: 'national_id'
  })
  nationalId?: string;

  @property({
    type: 'number',
  })
  capacity?: number;

  @property({
    type: 'number',
    name: 'stops_count'
  })
  stopsCount?: number;

  @property({
    type: 'string',
    name: 'device_type'
  })
  deviceType?: string;

  @property({
    type: 'string',
    name: 'lift_type'
  })
  liftType?: string;

  @property({
    type: 'number',
    name: 'deal_id'
  })
  dealId?: number;


  constructor(data?: Partial<Lift>) {
    super(data);
  }
}
