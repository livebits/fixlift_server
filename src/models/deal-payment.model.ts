import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'deal_payments' })
export class DealPayment extends BaseEntity {

  @property({
    type: 'number',
    name: 'deal_id'
  })
  dealId?: number;

  @property({
    type: 'number',
    name: 'payment_id'
  })
  paymentId?: number;


  constructor(data?: Partial<DealPayment>) {
    super(data);
  }
}
