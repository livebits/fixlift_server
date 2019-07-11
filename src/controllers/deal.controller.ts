import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Deal, FullDeal } from '../models';
import { DealRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { DealService } from '../services/deal.service';
import { service } from 'loopback4-spring';
import { inject } from '@loopback/core';

export class DealController {
  constructor(
    @repository(DealRepository)
    public dealRepository: DealRepository,
    @service(DealService)
    private dealService: DealService,
  ) { }

  @authenticate('jwt')
  @post('/deals', {
    responses: {
      '200': {
        description: 'Deal model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Deal } } },
      },
    },
  })
  async create(
    @requestBody() deal: FullDeal,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<any> {

    return await this.dealService.create(deal, Number(currentUser.id), false);

    // return await this.dealRepository.create(deal);
  }

  @get('/deals/count', {
    responses: {
      '200': {
        description: 'Deal model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Deal)) where?: Where<Deal>,
  ): Promise<Count> {
    return await this.dealRepository.count(where);
  }

  @authenticate('jwt')
  @get('/deals', {
    responses: {
      '200': {
        description: 'Array of Deal model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Deal } },
          },
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Deal)) filter?: Filter<Deal>,
  ): Promise<any[]> {
    // return await this.dealRepository.find(filter);

    const sql = `SELECT d.id, c.id AS customer_id, c.name AS customer_name, d.building_name, d.contract_number,
      d.contract_finish_date, d.cost_per_service, d.full_deal_cost, d.service_day,
      r.name AS region, su.name as service_user_name, su.id as service_user_id
      FROM deals d
      LEFT JOIN customers c ON c.id = d.customer_id
      LEFT JOIN regions r ON r.id = d.building_region
      LEFT JOIN service_users su ON d.service_user_id = su.id
      order by d.id desc`;

    return await this.dealRepository.query(sql);
  }

  @patch('/deals', {
    responses: {
      '200': {
        description: 'Deal PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() deal: Deal,
    @param.query.object('where', getWhereSchemaFor(Deal)) where?: Where<Deal>,
  ): Promise<Count> {
    return await this.dealRepository.updateAll(deal, where);
  }

  @get('/deals/{id}', {
    responses: {
      '200': {
        description: 'Deal model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Deal } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<any> {

    const sql = `SELECT d.id, d.customer_id AS customerId, d.service_user_id AS serviceUserId,
      d.repair_man_id AS repairManId, d.building_region AS buildingRegion, d.service_day AS serviceDay,
      d.has_resident_service_user AS hasResidentServiceUser, d.has_two_month_service AS hasTwoMonthService,
      d.service_time_type AS serviceTimeType, d.contract_number AS contractNumber, d.building_name AS buildingName,
      d.second_name AS secondName, d.contract_start_date AS contractStartDate, d.contract_finish_date AS contractFinishDate,
      d.warranty_finish_date AS warrantyFinishDate, d.address, d.address, d.full_deal_cost AS fullDealCost,
      d.discount, d.cost_per_service AS costPerService, d.previous_debt as previousDebt,
      d.building_latitude AS buildingLatitude, d.building_longitude AS buildingLongitude,
      d.building_location AS location,
      i.id as insuranceId, i.start_date AS startDate, i.finish_date AS finishDate, i.cost, i.add_deal_cost AS addDealCost,
      i.insurance_number AS insuranceNumber,
      l.id as liftId, l.national_id AS nationalId, l.capacity, l.stops_count AS stopsCount,
      CAST(l.device_type_id AS UNSIGNED) AS deviceTypeId, l.lift_type AS liftType
      FROM deals d
      LEFT JOIN insurances i ON d.id = i.deal_id
      LEFT JOIN lifts l ON d.id = l.deal_id
      WHERE d.id=${id}`;

    const r = await this.dealRepository.query(sql, [], [], 0);
    return r[0];

    // return await this.dealRepository.findById(id);
  }

  @authenticate('jwt')
  @patch('/deals/{id}', {
    responses: {
      '204': {
        description: 'Deal PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() fullDeal: FullDeal,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<void> {
    await this.dealService.update(id, fullDeal, Number(currentUser.id), false);
    // await this.dealRepository.updateById(id, deal);
  }

  @put('/deals/{id}', {
    responses: {
      '204': {
        description: 'Deal PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() deal: Deal,
  ): Promise<void> {
    await this.dealRepository.replaceById(id, deal);
  }

  @del('/deals/{id}', {
    responses: {
      '204': {
        description: 'Deal DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.dealRepository.deleteById(id);
  }

  @get('/customer-deals/{customer_id}', {
    responses: {
      '200': {
        description: 'Get customer deals',
        content: { 'application/json': { schema: { 'x-ts-type': Deal } } },
      },
    },
  })
  async getCustomerDeals(@param.path.number('customer_id') customerId: number): Promise<any> {

    const sql = `SELECT d.*
      FROM deals d
      WHERE d.customer_id=${customerId}`;

    const r = await this.dealRepository.query(sql, [], [], 0);
    return r[0];
  }

  @authenticate('jwt')
  @get('/deals/archive', {
    responses: {
      '200': {
        description: 'Array of Deal model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Deal } },
          },
        },
      },
    },
  })
  async archive(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Deal)) filter?: Filter<Deal>,
  ): Promise<any[]> {

    const sql = `SELECT d.id, c.id AS customer_id, c.name AS customer_name, d.building_name, d.contract_number,
      d.contract_finish_date, d.cost_per_service, d.full_deal_cost, d.service_day,
      r.name AS region, su.name as service_user_name, su.id as service_user_id
      FROM deals d
      LEFT JOIN customers c ON c.id = d.customer_id
      LEFT JOIN regions r ON r.id = d.building_region
      LEFT JOIN service_users su ON d.service_user_id = su.id
      order by d.id desc`;

    return await this.dealRepository.query(sql);
  }
}
