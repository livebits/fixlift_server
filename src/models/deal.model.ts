import { Entity, model, property } from '@loopback/repository';
import { BaseEntity } from './base-entity.model';

@model({ name: 'deals' })
export class Deal extends BaseEntity {

  @property({
    type: 'number',
    required: true,
    name: 'customer_id'
  })
  customerId: number;

  @property({
    type: 'number',
    name: 'service_user_id'
  })
  serviceUserId?: number;

  @property({
    type: 'string',
    name: 'contract_number'
  })
  contractNumber?: string;

  @property({
    type: 'string',
    name: 'building_name'
  })
  buildingName?: string;

  @property({
    type: 'string',
    name: 'second_name'
  })
  secondName?: string;

  @property({
    type: 'date',
    name: 'contract_start_date'
  })
  contractStartDate?: string;

  @property({
    type: 'date',
    name: 'contract_finish_date'
  })
  contractFinishDate?: string;

  @property({
    type: 'date',
    name: 'warrantly_finish_date'
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
    name: 'insurance_id'
  })
  insuranceId?: number;

  @property({
    type: 'number',
    name: 'full_deal_cost'
  })
  fullDealCost?: number;

  @property({
    type: 'number',
  })
  discount?: number;

  @property({
    type: 'number',
    name: 'cost_per_service'
  })
  costPerService?: number;

  @property({
    type: 'number',
    name: 'previous_debt'
  })
  previousDebt?: number;

  @property({
    type: 'boolean',
    name: 'has_resident_service_user'
  })
  hasResidentServiceUser?: boolean;

  @property({
    type: 'boolean',
    name: 'has_two_month_service'
  })
  hasTwoMonthService?: boolean;

  @property({
    type: 'boolean',
    name: 'official_time_service'
  })
  officialTimeService?: boolean;

  @property({
    type: 'boolean',
    name: 'all_time_service'
  })
  allTimeService?: boolean;

  @property({
    type: 'number',
    name: 'repair_man_id'
  })
  repairManId?: number;

  @property({
    type: 'number',
    name: 'building_region'
  })
  buildingRegion?: number;

  @property({
    type: 'number',
    name: 'service_day'
  })
  serviceDay?: number;

  @property({
    type: 'string',
    name: 'building_latitude'
  })
  buildingLatitude?: string;

  @property({
    type: 'string',
    name: 'building_longitude'
  })
  buildingLongitude?: string;

  @property({
    type: 'geopoint',
    name: 'building_location'
  })
  buildingLocation?: string;

  @property({
    type: 'number',
    name: 'company_id'
  })
  companyId?: number;


  constructor(data?: Partial<Deal>) {
    super(data);
  }
}
