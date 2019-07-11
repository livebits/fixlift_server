import { Entity, model, property } from '@loopback/repository';

@model({ name: 'company_message_templates' })
export class CompanyMessageTemplate extends Entity {
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
      columnName: 'message_template_id',
    },
  })
  messageTemplateId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'reminder_value',
    },
  })
  reminderValue?: number;

  @property({
    type: 'string',
    mysql: {
      columnName: 'reminder_time_type_value',
    },
  })
  reminderTimeTypeValue?: string;

  @property({
    type: 'string',
  })
  body?: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  @property({
    type: 'number',
    mysql: {
      columnName: 'company_user_id',
    },
  })
  companyUserId?: number;


  constructor(data?: Partial<CompanyMessageTemplate>) {
    super(data);
  }
}

export interface CompanyMessageTemplateRelations {
  // describe navigational properties here
}

export type CompanyMessageTemplateWithRelations = CompanyMessageTemplate & CompanyMessageTemplateRelations;
