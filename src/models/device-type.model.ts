import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'device_types' })
export class DeviceType extends Entity {

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
    type: 'string',
  })
  title?: string;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<DeviceType>) {
    super(data);
  }
}

export interface DeviceTypeRelations {

}

export type DeviceTypeWithRelations = DeviceType & DeviceTypeRelations;
