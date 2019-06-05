import { Entity, model, property } from '@loopback/repository';

@model({ name: 'emergency_comments' })
export class EmergencyComment extends Entity {

  @property({
    type: 'number',
    mysql: {
      columnName: 'emergency_id',
    },
    id: true
  })
  emergencyId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'comment_id',
    },
    id: true,
  })
  commentId?: number;


  constructor(data?: Partial<EmergencyComment>) {
    super(data);
  }
}
