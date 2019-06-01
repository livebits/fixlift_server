import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'checklists' })
export class Checklist extends BaseEntity {

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
    name: 'checklist_category_id'
  })
  checklistCategoryId?: number;

  @property({
    type: 'number',
    name: 'company_id'
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
