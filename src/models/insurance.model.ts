import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'insurances' })
export class Insurance extends BaseEntity {

  @property({
    type: 'date',
    name: 'start_date'
  })
  startDate?: string;

  @property({
    type: 'date',
    name: 'finish_date'
  })
  finishDate?: string;

  @property({
    type: 'number',
  })
  cost?: number;

  @property({
    type: 'string',
    name: 'insurance_number'
  })
  insuranceNumber?: string;

  @property({
    type: 'boolean',
    name: 'all_deal_cost'
  })
  addDealCost?: boolean;

  @property({
    type: 'number',
    name: 'deal_id'
  })
  dealId?: number;


  constructor(data?: Partial<Insurance>) {
    super(data);
  }
}
