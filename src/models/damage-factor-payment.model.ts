import { Entity, model, property } from '@loopback/repository';

@model({ name: 'damage_factor_payments' })
export class DamageFactorPayment extends Entity {

  @property({
    type: 'number',
    name: 'damage_factor_id'
  })
  damageFactorId?: number;

  @property({
    type: 'number',
    name: 'payment_id'
  })
  paymentId?: number;


  constructor(data?: Partial<DamageFactorPayment>) {
    super(data);
  }
}
