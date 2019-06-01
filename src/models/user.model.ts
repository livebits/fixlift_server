// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Entity, model, property, hasMany } from '@loopback/repository';
import { UserPermission } from '../authorization';
import { BaseEntity } from './base-entity.model';
import { UserProfile } from '@loopback/authentication';

@model({
  name: 'users',
})
export class User extends BaseEntity {

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
    name: 'last_login',
  })
  lastLogin?: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
