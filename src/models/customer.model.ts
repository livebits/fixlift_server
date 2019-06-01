import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'customers' })
export class Customer extends BaseEntity {

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'boolean',
    name: 'can_use_app'
  })
  canUseApp?: boolean;

  @property({
    type: 'boolean',
    name: 'auto_send_sms'
  })
  autoSendSms?: boolean;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    name: 'national_code'
  })
  nationalCode?: string;

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
  phone?: string;

  @property({
    type: 'string',
  })
  phone2?: string;

  @property({
    type: 'string',
    name: 'subscription_code'
  })
  subscriptionCode?: string;

  @property({
    type: 'date',
    name: 'birth_date'
  })
  birthDate?: string;

  @property({
    type: 'string',
    name: 'company_name'
  })
  companyName?: string;

  @property({
    type: 'string',
    name: 'national_id'
  })
  nationalId?: string;

  @property({
    type: 'string',
    name: 'register_number'
  })
  registerNumber?: string;

  @property({
    type: 'string',
    name: 'economy_code'
  })
  economyCode?: string;

  @property({
    type: 'string',
    name: 'postal_code'
  })
  postalCode?: string;

  @property({
    type: 'string',
  })
  province?: string;

  @property({
    type: 'string',
  })
  town?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'number',
    name: 'company_id'
  })
  companyId?: number;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'string',
    name: 'fcm_token'
  })
  fcmToken?: string;


  constructor(data?: Partial<Customer>) {
    super(data);
  }
}
