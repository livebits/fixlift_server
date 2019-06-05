import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { PermissionKey } from '../authorization';
import { AnyObject } from 'loopback-datasource-juggler';
import { UserWithRelations } from './user.model';

@model({ name: 'roles' })
export class Role extends Entity {

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
  })
  name?: string;

  @property.array(String, {
    required: true,
  })
  permissions: PermissionKey[];


  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  user?: UserWithRelations;
}

export type RoleWithRelations = Role & RoleRelations;
