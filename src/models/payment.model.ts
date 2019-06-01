import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'payments' })
export class Payment extends BaseEntity {

  @property({
    type: 'number',
  })
  amount?: number;

  @property({
    type: 'string',
    name: 'ref_id'
  })
  refId?: string;

  @property({
    type: 'string',
    name: 'payment_type'
  })
  paymentType?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    name: 'company_id'
  })
  companyId: number;


  constructor(data?: Partial<Payment>) {
    super(data);
  }
}
