import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'deal_placeholders' })
export class DealPlaceholder extends BaseEntity {

  @property({
    type: 'string',
  })
  keyword?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    name: 'property_name'
  })
  propertyName?: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  @property({
    type: 'number',
    name: 'company_id'
  })
  companyId?: number;


  constructor(data?: Partial<DealPlaceholder>) {
    super(data);
  }
}
