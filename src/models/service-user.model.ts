import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'service_users' })
export class ServiceUser extends BaseEntity {

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
    name: 'company_id'
  })
  companyId: number;

  @property({
    type: 'string',
    name: 'fcm_token'
  })
  fcmToken?: string;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'boolean',
    name: 'can_use_app'
  })
  canUseApp?: boolean;


  constructor(data?: Partial<ServiceUser>) {
    super(data);
  }
}
