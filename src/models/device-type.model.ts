import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'device_types' })
export class DeviceType extends BaseEntity {

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
