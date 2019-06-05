import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'services' })
export class Service extends Entity {

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
      columnName: 'deal_id',
    },
  })
  dealId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'service_user_id',
    },
  })
  serviceUserId?: number;

  @property({
    type: 'date',
  })
  time?: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'done_date',
    },
  })
  doneDate?: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'start_time',
    },
  })
  startTime?: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'finish_time',
    },
  })
  finishTime?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'service_user_report',
    },
  })
  serviceUserReport?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'customer_description',
    },
  })
  customerDescription?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'service_user_reminder',
    },
  })
  serviceUserReminder?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'service_user_signature',
    },
  })
  serviceUserSignature?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'customer_signature',
    },
  })
  customerSignature?: string;


  constructor(data?: Partial<Service>) {
    super(data);
  }
}
