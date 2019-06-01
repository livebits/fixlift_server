import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'services' })
export class Service extends BaseEntity {

  @property({
    type: 'number',
    name: 'deal_id'
  })
  dealId?: number;

  @property({
    type: 'number',
    name: 'service_user_id'
  })
  serviceUserId?: number;

  @property({
    type: 'date',
  })
  time?: string;

  @property({
    type: 'date',
    name: 'done_date'
  })
  doneDate?: string;

  @property({
    type: 'date',
    name: 'start_time'
  })
  startTime?: string;

  @property({
    type: 'date',
    name: 'finish_time'
  })
  finishTime?: string;

  @property({
    type: 'string',
    name: 'service_user_report'
  })
  serviceUserReport?: string;

  @property({
    type: 'string',
    name: 'customer_description'
  })
  customerDescription?: string;

  @property({
    type: 'string',
    name: 'service_user_reminder'
  })
  serviceUserReminder?: string;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<Service>) {
    super(data);
  }
}
