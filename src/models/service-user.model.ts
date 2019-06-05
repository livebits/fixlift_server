import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_users' })
export class ServiceUser extends Entity {

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
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  mobile?: string;

  @property({
    type: 'string',
  })
  mobile2?: string;

  @property({
    type: 'string',
  })
  latitude?: string;

  @property({
    type: 'string',
  })
  longitude?: string;

  @property({
    type: 'geopoint',
  })
  location?: string;

  @property({
    type: 'number',
    required: true,
    mysql: {
      columnName: 'company_id',
    },
  })
  companyId: number;

  @property({
    type: 'string',
    mysql: {
      columnName: 'fcm_token',
    },
  })
  fcmToken?: string;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'boolean',
    mysql: {
      columnName: 'can_use_app',
    },
  })
  canUseApp?: boolean;


  constructor(data?: Partial<ServiceUser>) {
    super(data);
  }
}
