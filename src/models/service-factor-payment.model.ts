import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_factor_payments' })
export class ServiceFactorPayment extends BaseEntity {

  @property({
    type: 'number',
    name: 'service_factor_id'
  })
  serviceFactorId?: number;

  @property({
    type: 'number',
    name: 'payment_id'
  })
  paymentId?: number;


  constructor(data?: Partial<ServiceFactorPayment>) {
    super(data);
  }
}
