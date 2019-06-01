import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { PermissionKey } from '../authorization';

@model({ name: 'roles' })
export class Role extends BaseEntity {

  @property({
    type: 'string',
  })
  name?: string;

  // @property({
  //   type: 'array',
  //   itemType: 'string',
  // })
  // permissions: string[];

  @property.array(String, {
    required: true,
  })
  permissions: PermissionKey[];


  constructor(data?: Partial<Role>) {
    super(data);
  }
}
