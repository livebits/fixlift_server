import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'lift_fields' })
export class LiftField extends Entity {

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
      columnName: 'lift_field_category_id',
    },
  })
  liftFieldCategoryId?: number;

  @property({
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'field_type',
    },
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

export interface LiftFieldRelations {

}

export type LiftFieldWithRelations = LiftField & LiftFieldRelations;
