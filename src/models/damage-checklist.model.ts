import { Entity, model, property, belongsTo } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Checklist } from './checklist.model';

@model({ name: 'damage_checklists' })
export class DamageChecklist extends Entity {

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

  @belongsTo(
    () => Checklist,
    { keyFrom: 'checklistId', name: 'checklist' },
    {
      type: 'number',
      name: 'checklist_id',
      mysql: {
        columnName: 'checklist_id',
      },
    },
  )
  checklistId?: number;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  description?: string;

  checklist?: Checklist;

  constructor(data?: Partial<DamageChecklist>) {
    super(data);
  }
}

export interface DamageChecklistRelations {
  checklist?: Checklist;
}

export type DamageChecklistWithRelations = DamageChecklist & DamageChecklistRelations;
