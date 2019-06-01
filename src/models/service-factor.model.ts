import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_factors' })
export class ServiceFactor extends BaseEntity {

  @property({
    type: 'number',
    name: 'service_id'
  })
  serviceId?: number;

  @property({
    type: 'number',
  })
  cost?: number;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  description?: string;


  constructor(data?: Partial<ServiceFactor>) {
    super(data);
  }
}
