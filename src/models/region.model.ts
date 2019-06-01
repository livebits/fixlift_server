import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'regions' })
export class Region extends BaseEntity {

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'number',
    name: 'company_id'
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
