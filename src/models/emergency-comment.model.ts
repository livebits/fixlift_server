import { Entity, model, property } from '@loopback/repository';

@model({ name: 'emergency_comments' })
export class EmergencyComment extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'emergency_id',
    },
  })
  emergencyId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'comment_id',
    },
  })
  commentId?: number;


  constructor(data?: Partial<EmergencyComment>) {
    super(data);
  }
}

export interface EmergencyCommentRelations {

}

export type EmergencyCommentWithRelations = EmergencyComment & EmergencyCommentRelations;
