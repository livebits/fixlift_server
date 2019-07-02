import { Entity, model, property } from '@loopback/repository';

@model({ name: 'lift_field_values' })
export class LiftFieldValue extends Entity {
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
    required: true,
    mysql: {
      columnName: 'lift_field_id',
    },
  })
  liftFieldId: number;

  @property({
    type: 'number',
    required: true,
    mysql: {
      columnName: 'lift_id',
    },
  })
  liftId?: number;

  @property({
    type: 'string',
  })
  value?: string;


  constructor(data?: Partial<LiftFieldValue>) {
    super(data);
  }
}

export interface LiftFieldValueRelations {
  // describe navigational properties here
}

export type LiftFieldValueWithRelations = LiftFieldValue & LiftFieldValueRelations;
