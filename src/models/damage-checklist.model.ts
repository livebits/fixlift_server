import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'damage_checklists' })
export class DamageChecklist extends BaseEntity {

  @property({
    type: 'number',
    name: 'damage_id'
  })
  damageId?: number;

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


  constructor(data?: Partial<DamageChecklist>) {
    super(data);
  }
}
