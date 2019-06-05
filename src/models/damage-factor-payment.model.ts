import { Entity, model, property } from '@loopback/repository';

@model({ name: 'damage_factor_payments' })
export class DamageFactorPayment extends Entity {

  @property({
    type: 'number',
    mysql: {
      columnName: 'damage_factor_id',
    },
    id: true
  })
  damageFactorId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'payment_id',
    },
    id: true
  })
  paymentId?: number;


  constructor(data?: Partial<DamageFactorPayment>) {
    super(data);
  }
}
