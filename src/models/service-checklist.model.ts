import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Checklist } from './checklist.model';

@model({ name: 'service_checklists' })
export class ServiceChecklist extends Entity {

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
      columnName: 'service_id',
    },
  })
  serviceId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'checklist_id',
    },
  })
  checklistId?: number;

  @property({
    type: 'boolean',
  })
  status: boolean;

  @property({
    type: 'string',
  })
  description?: string;

  checklist?: Checklist;

  constructor(data?: Partial<ServiceChecklist>) {
    super(data);
  }
}

export interface ServiceChecklistRelations {

}

export type ServiceChecklistWithRelations = ServiceChecklist & ServiceChecklistRelations;
