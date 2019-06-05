// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Entity, model, property, hasMany, belongsTo, RelationType, HasManyDefinition } from '@loopback/repository';
import { UserPermission } from '../authorization';
import { BaseEntity } from './base-entity.model';
import { Role, RoleWithRelations } from './role.model';
import { UserRole } from './user-role.model';
import { Relation, BelongsTo } from 'loopback-datasource-juggler';
import { Company, CompanyWithRelations } from './company.model';

@model({
  name: 'users'
})
export class User extends Entity {

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
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property.array(String)
  permissions: UserPermission[];

  @property({
    type: 'date',
    mysql: {
      columnName: 'last_login',
    },
  })
  lastLogin?: string;

  @hasMany(() => Role, { keyTo: 'user_id' })
  roles: Role[];

  @hasMany(() => Company, { keyTo: 'user_id', name: 'companies' })
  companies: Company[];

  constructor(data?: Partial<User>) {
    super(data);

  }
}

export interface UserRelations {
  roles?: RoleWithRelations[];
  companies?: CompanyWithRelations[];
}

export type UserWithRelations = User & UserRelations;
