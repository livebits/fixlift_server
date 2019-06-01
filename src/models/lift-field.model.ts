import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'lift_fields' })
export class LiftField extends BaseEntity {

  @property({
    type: 'number',
    name: 'lift_field_category_id'
  })
  liftFieldCategoryId?: number;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
    name: 'field_type'
  })
  fieldType?: string;

  @property({
    type: 'number',
  })
  priority?: number;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<LiftField>) {
    super(data);
  }
}
