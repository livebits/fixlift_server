import { Entity, model, property } from '@loopback/repository';

@model({
  name: 'user_roles'
})
export class UserRole extends Entity {
  @property({
    type: 'number',
    name: 'user_id'
  })
  userId?: number;

  @property({
    type: 'number',
    name: 'role_id'
  })
  roleId?: number;


  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}
