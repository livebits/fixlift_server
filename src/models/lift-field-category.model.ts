import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'lift_field_categories' })
export class LiftFieldCategory extends Entity {

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
  })
  title?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'number',
    mysql: {
      columnName: 'device_type_id',
    },
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

export interface LiftFieldCategoryRelations {

}

export type LiftFieldCategoryWithRelations = LiftFieldCategory & LiftFieldCategoryRelations;
