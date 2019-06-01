import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({
  name: 'checklist_categories',
})
export class ChecklistCategory extends BaseEntity {

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
    name: 'company_id'
  })
  companyId?: number;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<ChecklistCategory>) {
    super(data);
  }
}
