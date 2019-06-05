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
