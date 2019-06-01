import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'damages' })
export class Damage extends BaseEntity {

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
    type: 'string',
    name: 'damage_text'
  })
  damageText?: string;

  @property({
    type: 'date',
  })
  time?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'string',
    name: 'created_by'
  })
  createdBy?: string;

  @property({
    type: 'number',
    name: 'creator_id'
  })
  creatorId?: number;

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
    name: 'service_user_reminder'
  })
  serviceUserReminder?: string;

  @property({
    type: 'string',
    name: 'customer_reminder'
  })
  customerReminder?: string;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<Damage>) {
    super(data);
  }
}
