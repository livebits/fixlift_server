import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'emergencies' })
export class Emergency extends BaseEntity {

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
  })
  status?: string;

  @property({
    type: 'date',
  })
  time?: string;

  @property({
    type: 'string',
    name: 'service_user_report'
  })
  serviceUserReport?: string;

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
    type: 'date',
    name: 'done_time'
  })
  doneTime?: string;


  constructor(data?: Partial<Emergency>) {
    super(data);
  }
}
