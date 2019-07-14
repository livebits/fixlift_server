import { Entity, model, property, belongsTo, hasMany, hasOne } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';
import { Company } from './company.model';
import { Damage } from './damage.model';
import { Service, ServiceWithRelations } from './service.model';
import { ServiceUser } from './service-user.model';
import { Customer } from './customer.model';
import { Insurance, InsuranceWithRelations } from './insurance.model';
import { Lift, LiftWithRelations } from './lift.model';

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
  contractStartDate: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'contract_finish_date',
    },
  })
  contractFinishDate: string;

  @property({
    type: 'date',
    mysql: {
      columnName: 'warranty_finish_date',
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
  serviceDay: number;

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

  @hasMany(() => Damage, { keyTo: 'dealId' })
  damages: Damage[];

  @hasMany(() => Service, { keyTo: 'dealId' })
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

  @hasOne(() => Insurance, { keyTo: 'dealId' })
  insurance?: Insurance;

  @hasOne(() => Lift, { keyTo: 'dealId' })
  lift?: Lift;

  @property({
    type: 'number',
  })
  company_user_id?: number;


  constructor(data?: Partial<Deal>) {
    super(data);
  }
}

export interface DealRelations {
  services: ServiceWithRelations[],
  insurance: InsuranceWithRelations,
  lift: LiftWithRelations,
}

export type DealWithRelations = Deal & DealRelations;


export class FullDeal extends Deal {
  @property({
    type: 'date',
  })
  startDate?: string;

  @property({
    type: 'date',
  })
  finishDate?: string;

  @property({
    type: 'number',
  })
  cost?: number;


  @property({
    type: 'number',
  })
  insuranceId?: number;

  @property({
    type: 'string',
  })
  insuranceNumber?: string;

  @property({
    type: 'boolean',
  })
  addDealCost?: boolean;

  @property({
    type: 'string',
  })
  location: string;

  //lift fields
  @property({
    type: 'number',
  })
  liftId?: number;

  @property({
    type: 'string',
  })
  nationalId?: string;

  @property({
    type: 'number',
  })
  capacity?: number;

  @property({
    type: 'number',
  })
  stopsCount?: number;

  @property({
    type: 'string',
  })
  deviceTypeId?: string;

  @property({
    type: 'string',
  })
  liftType?: string;

  @property({
    type: 'string',
  })
  field?: any;
}
