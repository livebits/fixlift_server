import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'lift_field_categories' })
export class LiftFieldCategory extends BaseEntity {

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'number',
    name: 'device_type_id'
  })
  deviceTypeId?: number;

  @property({
    type: 'number',
  })
  priority?: number;


  constructor(data?: Partial<LiftFieldCategory>) {
    super(data);
  }
}
