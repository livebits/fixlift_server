import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({
  name: 'checklist_categories',
})
export class ChecklistCategory extends Entity {

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
      columnName: 'company_user_id',
    },
  })
  companyUserId?: number;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<ChecklistCategory>) {
    super(data);
  }
}

export interface ChecklistCategoryRelations {

}

export type ChecklistCategoryWithRelations = ChecklistCategory & ChecklistCategoryRelations;
