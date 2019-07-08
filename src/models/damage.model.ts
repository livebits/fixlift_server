import { Entity, model, property, belongsTo } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Deal } from './deal.model';

@model({ name: 'damages' })
export class Damage extends Entity {

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
      columnName: 'service_user_id',
    },
  })
  serviceUserId?: number;

  @property({
    type: 'string',
    mysql: {
      columnName: 'damage_text',
    },
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
    mysql: {
      columnName: 'created_by',
    }
  })
  createdBy?: string;

  @property({
    type: 'number',
    mysql: {
      columnName: 'created_id',
    },
  })
  creatorId?: number;

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
      columnName: 'service_user_reminder',
    },
  })
  serviceUserReminder?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'customer_reminder',
    },
  })
  customerReminder?: string;

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

  @belongsTo(
    () => Deal,
    { keyFrom: 'deal_id', name: 'deal' },
    {
      type: 'number',
      name: 'deal_id',
      mysql: {
        columnName: 'deal_id',
      },
    },
  )
  dealId: number;

  constructor(data?: Partial<Damage>) {
    super(data);
  }
}

export interface DamageRelations {

}

export type DamageWithRelations = Damage & DamageRelations;

export class DamageFilter extends Damage {

  @property({
    type: 'string',
  })
  dealContractNumber?: string;

}
