import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'message_templates' })
export class MessageTemplate extends Entity {

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
  })
  reminder?: number;

  @property({
    type: 'string',
  })
  body?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'reminder_property',
    },
  })
  reminderProperty?: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  @property({
    type: 'number',
    mysql: {
      columnName: 'company_id',
    },
  })
  companyId: number;


  constructor(data?: Partial<MessageTemplate>) {
    super(data);
  }
}
