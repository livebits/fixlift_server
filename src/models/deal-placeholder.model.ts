import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'deal_placeholders' })
export class DealPlaceholder extends Entity {

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
  keyword?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'property_name',
    },
  })
  propertyName?: string;

  @property({
    type: 'boolean',
  })
  status?: boolean;

  @property({
    type: 'number',
    mysql: {
      columnName: 'company_user_id',
    },
  })
  companyUserId?: number;


  constructor(data?: Partial<DealPlaceholder>) {
    super(data);
  }
}

export interface DealPlaceholderRelations {

}

export type DealPlaceholderWithRelations = DealPlaceholder & DealPlaceholderRelations;
