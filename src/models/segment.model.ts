import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'segments' })
export class Segment extends BaseEntity {

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  country?: string;

  @property({
    type: 'string',
  })
  brand?: string;

  @property({
    type: 'number',
  })
  price?: number;

  @property({
    type: 'number',
    name: 'company_id'
  })
  companyId?: number;

  constructor(data?: Partial<Segment>) {
    super(data);
  }
}
