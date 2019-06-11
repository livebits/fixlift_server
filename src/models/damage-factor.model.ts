import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'damage_factors' })
export class DamageFactor extends Entity {

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
      columnName: 'damage_id',
    },
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

export interface DamageFactorRelations {

}

export type DamageFactorWithRelations = DamageFactor & DamageFactorRelations;
