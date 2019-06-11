import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'deal_payments' })
export class DealPayment extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'deal_id',
    },
  })
  dealId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'payment_id',
    },
  })
  paymentId?: number;


  constructor(data?: Partial<DealPayment>) {
    super(data);
  }
}

export interface DealPaymentRelations {

}

export type DealPaymentWithRelations = DealPayment & DealPaymentRelations;
