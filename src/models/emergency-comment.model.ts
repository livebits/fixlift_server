import { Entity, model, property } from '@loopback/repository';

@model({ name: 'emergency_comments' })
export class EmergencyComment extends Entity {

  @property({
    type: 'number',
    name: 'emergency_id'
  })
  emergencyId?: number;

  @property({
    type: 'number',
    name: 'comment_id'
  })
  commentId?: number;


  constructor(data?: Partial<EmergencyComment>) {
    super(data);
  }
}
