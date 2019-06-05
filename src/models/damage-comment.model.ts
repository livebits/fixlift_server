import { Entity, model, property } from '@loopback/repository';

@model({ name: 'damage_comments' })
export class DamageComment extends Entity {

  @property({
    type: 'number',
    mysql: {
      columnName: 'damage_id',
    },
    id: true
  })
  damageId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'comment_id',
    },
    id: true
  })
  commentId?: number;


  constructor(data?: Partial<DamageComment>) {
    super(data);
  }
}
