import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'checklists' })
export class Checklist extends Entity {

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
    type: 'number',
  })
  priority?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'checklist_category_id',
    },
  })
  checklistCategoryId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'company_id',
    },
  })
  companyId?: number;

  @property({
    type: 'boolean',
  })
  status?: boolean;


  constructor(data?: Partial<Checklist>) {
    super(data);
  }
}

export interface ChecklistRelations {

}

export type ChecklistWithRelations = Checklist & ChecklistRelations;
