import { Entity, model, property } from '@loopback/repository';

@model({ name: 'damage_comments' })
export class DamageComment extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'damage_id',
    },
  })
  damageId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'comment_id',
    },
  })
  commentId?: number;


  constructor(data?: Partial<DamageComment>) {
    super(data);
  }
}

export interface DamageCommentRelations {

}

export type DamageCommentWithRelations = DamageComment & DamageCommentRelations;
