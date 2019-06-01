import { Entity, model, property } from '@loopback/repository';

@model({ name: 'damage_comments' })
export class DamageComment extends Entity {

  @property({
    type: 'number',
    name: 'damage_id'
  })
  damageId?: number;

  @property({
    type: 'number',
    name: 'comment_id'
  })
  commentId?: number;


  constructor(data?: Partial<DamageComment>) {
    super(data);
  }
}
