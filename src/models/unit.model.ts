import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'units' })
export class Unit extends BaseEntity {

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
    name: 'company_id'
  })
  companyId: number;

  constructor(data?: Partial<Unit>) {
    super(data);
  }
}
