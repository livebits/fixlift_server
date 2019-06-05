import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'units' })
export class Unit extends Entity {

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
  name?: string;

  @property({
    type: 'string',
  })
  shortcut?: string;

  @property({
    type: 'number',
    required: true,
    mysql: {
      columnName: 'company_id',
    },
  })
  companyId: number;

  constructor(data?: Partial<Unit>) {
    super(data);
  }
}
