import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'comments' })
export class Comment extends Entity {

  @property({
    type: 'number',
    id: true,
    generated: true
  })
  id?: number;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'created_on',
    },
  })
  createdOn?: Date;

  @property({
    type: 'date',
    default: () => new Date(),
    mysql: {
      columnName: 'modified_on',
    },
  })
  modifiedOn?: Date;

  @property({
    type: 'string',
  })
  comment?: string;

  @property({
    type: 'number',
  })
  rate?: number;

  @property({
    type: 'string',
  })
  status?: string;


  constructor(data?: Partial<Comment>) {
    super(data);
  }
}

export interface CommentRelations {

}

export type CommentWithRelations = Comment & CommentRelations;
