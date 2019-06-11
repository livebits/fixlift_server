import { Entity, model, property } from '@loopback/repository';

@model({ name: 'damage_factor_payments' })
export class DamageFactorPayment extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'damage_factor_id',
    },
  })
  damageFactorId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'payment_id',
    },
  })
  paymentId?: number;


  constructor(data?: Partial<DamageFactorPayment>) {
    super(data);
  }
}

export interface DamageFactorPaymentRelations {

}

export type DamageFactorPaymentWithRelations = DamageFactorPayment & DamageFactorPaymentRelations;
