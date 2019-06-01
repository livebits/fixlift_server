import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'damage_factors' })
export class DamageFactor extends BaseEntity {

  @property({
    type: 'number',
    name: 'damage_id'
  })
  damageId?: number;

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


  constructor(data?: Partial<DamageFactor>) {
    super(data);
  }
}
