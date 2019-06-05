import { Entity, model, property } from '@loopback/repository';

@model({
  name: 'user_roles'
})
export class UserRole extends Entity {

  @property({
    type: 'number',
    mysql: {
      columnName: 'user_id',
    },
    id: true
  })
  userId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'role_id',
    },
    id: true
  })
  roleId?: number;


  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}
