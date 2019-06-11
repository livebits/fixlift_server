import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'emergencies' })
export class Emergency extends Entity {

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
    type: 'string',
  })
  status?: string;

  @property({
    type: 'date',
  })
  time?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'service_user_report',
    },
  })
  serviceUserReport?: string;

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
    type: 'date',
    mysql: {
      columnName: 'done_time',
    },
  })
  doneTime?: string;


  constructor(data?: Partial<Emergency>) {
    super(data);
  }
}

export interface EmergencyRelations {

}

export type EmergencyWithRelations = Emergency & EmergencyRelations;
