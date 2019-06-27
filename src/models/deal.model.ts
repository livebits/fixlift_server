import { Entity, model, property, belongsTo, hasMany, hasOne } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Company } from './company.model';
import { Damage } from './damage.model';
import { Service } from './service.model';
import { ServiceUser } from './service-user.model';
import { Customer } from './customer.model';
import { Insurance } from './insurance.model';

@model({ name: 'deals' })
export class Deal extends Entity {

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
    mysql: {
      columnName: 'contract_number',
    },
  })
  contractNumber?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'building_name',
    },
  })
  buildingName?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'second_name',
    },
  })
  secondName?: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'contract_start_date',
    },
  })
  contractStartDate?: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'contract_finish_date',
    },
  })
  contractFinishDate?: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'warrantly_finish_date',
    },
  })
  warrantyFinishDate?: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    mysql: {
      columnName: 'full_deal_cost',
    },
  })
  fullDealCost?: number;

  @property({
    type: 'number',
  })
  discount?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'cost_per_service',
    },
  })
  costPerService?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'previous_debt',
    },
  })
  previousDebt?: number;

  @property({
    type: 'boolean',
    mysql: {
      columnName: 'has_resident_service_user',
    },
  })
  hasResidentServiceUser?: boolean;

  @property({
    type: 'boolean',
    mysql: {
      columnName: 'has_two_month_service',
    },
  })
  hasTwoMonthService?: boolean;

  @property({
    type: 'string',
    mysql: {
      columnName: 'service_time_type',
    },
  })
  serviceTimeType?: string;

  @property({
    type: 'number',
    mysql: {
      columnName: 'repair_man_id',
    },
  })
  repairManId?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'building_region',
    },
  })
  buildingRegion?: number;

  @property({
    type: 'number',
    mysql: {
      columnName: 'service_day',
    },

  })
  serviceDay?: number;

  @property({
    type: 'string',
    mysql: {
      columnName: 'building_latitude',
    },
  })
  buildingLatitude?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'building_longitude',
    },
  })
  buildingLongitude?: string;

  @property({
    type: 'string',
    mysql: {
      columnName: 'building_location',
    },
  })
  buildingLocation?: string;

  @belongsTo(
    () => Company,
    { keyFrom: 'company_user_id', name: 'company' },
    {
      type: 'number',
      name: 'company_user_id',
      mysql: {
        columnName: 'company_user_id',
      },
    },
  )
  companyUserId?: number;

  @hasMany(() => Damage, { keyTo: 'deal_id' })
  damages: Damage[];

  @hasMany(() => Service, { keyTo: 'deal_id' })
  services: Service[];

  @belongsTo(
    () => ServiceUser,
    { keyFrom: 'service_user_id', name: 'serviceUser' },
    {
      type: 'number',
      name: 'service_user_id',
      mysql: {
        columnName: 'service_user_id',
      },
    },
  )
  serviceUserId: number;

  @belongsTo(
    () => Customer,
    { keyFrom: 'customer_id', name: 'customer' },
    {
      type: 'number',
      name: 'customer_id',
      mysql: {
        columnName: 'customer_id',
      },
    },
  )
  customerId: number;

  @hasOne(() => Insurance, { keyTo: 'deal_id' })
  insurances: Insurance[];

  constructor(data?: Partial<Deal>) {
    super(data);
  }
}

export interface DealRelations {

}

export type DealWithRelations = Deal & DealRelations;
