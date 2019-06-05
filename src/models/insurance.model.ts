import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'insurances' })
export class Insurance extends Entity {

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
    type: 'date',
    mysql: {
      columnName: 'start_date',
    },
  })
  startDate?: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'finish_date',
    },
  })
  finishDate?: string;

  @property({
    type: 'number',
  })
  cost?: number;

  @property({
    type: 'string',
    mysql: {
      columnName: 'insurance_number',
    },
  })
  insuranceNumber?: string;

  @property({
    type: 'boolean',
    mysql: {
      columnName: 'all_deal_cost',
    },
  })
  addDealCost?: boolean;

  @property({
    type: 'number',
    mysql: {
      columnName: 'deal_id',
    },
  })
  dealId?: number;


  constructor(data?: Partial<Insurance>) {
    super(data);
  }
}
