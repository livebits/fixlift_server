import { Entity, model, property } from '@loopback/repository';

@model({
  name: 'user_roles'
})
export class UserRole extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'user_id',
    },
  })
  userId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'role_id',
    },
  })
  roleId?: number;


  constructor(data?: Partial<UserRole>) {
    super(data);
  }
}

export interface UserRoleRelations {

}

export type UserRoleWithRelations = UserRole & UserRoleRelations;
