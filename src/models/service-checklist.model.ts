import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_checklists' })
export class ServiceChecklist extends BaseEntity {

  @property({
    type: 'number',
    name: 'service_id'
  })
  serviceId?: number;

  @property({
    type: 'number',
    name: 'checklist_id'
  })
  checklistId?: number;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  description?: string;

  constructor(data?: Partial<ServiceChecklist>) {
    super(data);
  }
}
