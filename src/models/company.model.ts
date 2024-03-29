import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { User, UserWithRelations } from './user.model';
import { Deal } from './deal.model';
import { Customer } from './customer.model';
import { ServiceUser } from './service-user.model';

@model({
  name: 'companies',
  settings: {
    foreignKeys: {
      fk_user_userId: {
        // optional, overrides keyName
        name: 'fk_user_userId',

        // Property name(s) (will be mapped to column name)
        // formerly: foreignKey
        sourceProperties: ['userId'],

        // formerly: entity
        targetModel: 'users',

        // Property name(s) (will be mapped to column name)
        // formerly: entityKey
        targetProperties: ['id'],

        // referential actions (optional)
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
  },
})
export class Company extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
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
  })
  title?: string;

  @property({
    type: 'string',
  })
  mobile?: number;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  address?: string;

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
  location: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  logo?: string;

  @belongsTo(
    () => User,
    { keyFrom: 'user_id', name: 'user' },
    {
      type: 'number',
      index: true,
      name: 'user_id',
      mysql: {
        columnName: 'user_id',
        foreignKeys: {
          fk_user_userId: {
            name: 'fk_user_userId',
            sourceProperties: ['userId'],
            targetModel: 'users',
            targetProperties: ['id'],
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        },
      },
    },
  )
  userId: number;

  @hasMany(() => Deal, { keyTo: 'company_user_id' })
  deals: Deal[];

  @hasMany(() => Customer, { keyTo: 'company_user_id' })
  customers: Customer[];

  @hasMany(() => ServiceUser, { keyTo: 'company_user_id' })
  serviceUsers: ServiceUser[];

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  user?: UserWithRelations;
}

export type CompanyWithRelations = Company & CompanyRelations;

export class CompanyWithUser extends Company {
  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'number',
    required: true,
  })
  role: number;
}
