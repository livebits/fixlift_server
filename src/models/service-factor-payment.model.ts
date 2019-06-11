import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_factor_payments' })
export class ServiceFactorPayment extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'number',
    id: true,
    mysql: {
      columnName: 'service_factor_id',
    },
  })
  serviceFactorId?: number;

  @property({
    type: 'number',
    id: true,
    mysql: {
      columnName: 'payment_id',
    },
  })
  paymentId?: number;


  constructor(data?: Partial<ServiceFactorPayment>) {
    super(data);
  }
}

export interface ServiceFactorPaymentRelations {

}

export type ServiceFactorPaymentWithRelations = ServiceFactorPayment & ServiceFactorPaymentRelations;
