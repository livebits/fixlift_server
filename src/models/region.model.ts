import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'regions' })
export class Region extends Entity {

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
    type: 'number',
    mysql: {
      columnName: 'company_id',
    },
  })
  companyId?: number;

  @property({
    type: 'string',
  })
  description?: string;


  constructor(data?: Partial<Region>) {
    super(data);
  }
}
