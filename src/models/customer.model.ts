import { Entity, model, property, belongsTo, hasMany, hasOne } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Company } from './company.model';
import { Deal } from './deal.model';

@model({ name: 'customers' })
export class Customer extends Entity {

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
  type: string;

  @property({
    type: 'boolean',
    mysql: {
      columnName: 'can_use_app',
    },
  })
  canUseApp?: boolean;

  @property({
    type: 'boolean',
    mysql: {
      columnName: 'auto_send_sms',
    },
  })
  autoSendSms?: boolean;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'national_code',
    },
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
    mysql: {
      columnName: 'subscription_code',
    },
  })
  subscriptionCode?: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'birth_date',
    },
  })
  birthDate?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'company_name',
    },
  })
  companyName?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'national_id',
    },
  })
  nationalId?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'register_number',
    },
  })
  registerNumber?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'economy_code',
    },
  })
  economyCode?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'postal_code',
    },
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

  // @property({
  //   type: 'number',
  //   mysql: {
  //     columnName: 'company_user_id',
  //   },
  // })
  // companyUserId?: number;

  @property({
    type: 'string',
  })
  image?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'fcm_token',
    },
  })
  fcmToken?: string;

  @belongsTo(
    () => Company,
    { keyFrom: 'company_user_id', name: 'company' },
    {
      type: 'number',
      name: 'company_user_id',
      mysql: {
        columnName: 'company_user_id',
      },
    },
  )
  companyUserId: number;

  @property({
    type: 'string',
    mysql: {
      columnName: 'verification_code',
    },
  })
  verificationCode: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'last_login',
    },
  })
  lastLogin?: string;

  @hasMany(() => Deal, { keyTo: 'customer_id' })
  deals: Deal[];

  balance: Balance

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  balance: Balance
}

export type CustomerWithRelations = Customer & CustomerRelations;

export class Balance {
  @property({
    type: 'number',
  })
  balance: number;
}
