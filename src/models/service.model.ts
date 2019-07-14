import { Entity, model, property, belongsTo, hasMany } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Deal } from './deal.model';
import { ServiceChecklist } from './service-checklist.model';
import { ServiceSegment } from './service-segment.model';
import { ServiceFactor } from './service-factor.model';

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

  @belongsTo(
    () => Deal,
    { keyFrom: 'dealId', name: 'deal' },
    {
      type: 'number',
      name: 'deal_id',
      mysql: {
        columnName: 'deal_id',
      },
    },
  )
  dealId?: number;

  deal: Deal;

  @hasMany(() => ServiceChecklist, { keyTo: 'serviceId' })
  serviceChecklists: ServiceChecklist[];

  @hasMany(() => ServiceSegment, { keyTo: 'serviceId' })
  serviceSegments: ServiceSegment[];

  @hasMany(() => ServiceFactor, { keyTo: 'serviceId' })
  serviceFactors: ServiceFactor[];

  constructor(data?: Partial<Service>) {
    super(data);
  }
}

export interface ServiceRelations {

}

export type ServiceWithRelations = Service & ServiceRelations;


export class ServiceFilter extends Service {

  @property({
    type: 'string',
  })
  dealContractNumber?: string;

}
