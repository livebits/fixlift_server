import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'message_templates' })
export class MessageTemplate extends BaseEntity {

  @property({
    type: 'number',
  })
  reminder?: number;

  @property({
    type: 'string',
  })
  body?: string;

  @property({
    type: 'string',
    name: 'reminder_property'
  })
  reminderProperty?: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  @property({
    type: 'number',
    name: 'company_id'
  })
  companyId: number;


  constructor(data?: Partial<MessageTemplate>) {
    super(data);
  }
}
