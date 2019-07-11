import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'payments' })
export class Payment extends Entity {

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
  })
  amount?: number;

  @property({
    type: 'string',
    mysql: {
      columnName: 'ref_id',
    },
  })
  refId?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'payment_type',
    },
  })
  paymentType?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'payment_date',
    },
  })
  paymentDate?: string;

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
    mysql: {
      columnName: 'company_user_id',
    },
  })
  companyUserId: number;


  constructor(data?: Partial<Payment>) {
    super(data);
  }
}

export interface PaymentRelations {

}

export type PaymentWithRelations = Payment & PaymentRelations;
