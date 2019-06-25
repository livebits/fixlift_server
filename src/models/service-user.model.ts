import { Entity, model, property, belongsTo } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Company } from './company.model';

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
    type: 'string',
  })
  location?: string;

  // @property({
  //   type: 'number',
  //   required: true,
  //   mysql: {
  //     columnName: 'company_user_id',
  //   },
  // })
  // companyUserId: number;

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
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'last_login',
    },
  })
  lastLogin?: string;

  constructor(data?: Partial<ServiceUser>) {
    super(data);
  }
}

export interface ServiceUserRelations {

}

export type ServiceUserWithRelations = ServiceUser & ServiceUserRelations;
