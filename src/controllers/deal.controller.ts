import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  Inclusion,
  Condition,
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
import { Deal, FullDeal, Service, Damage } from '../models';
import { DealRepository, LiftRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { DealService } from '../services/deal.service';
import { service } from 'loopback4-spring';
import { inject } from '@loopback/core';

export class DealController {
  constructor(
    @repository(DealRepository)
    public dealRepository: DealRepository,
    @repository(LiftRepository)
    public liftRepository: LiftRepository,
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
  @get('/deals/getByDetail', {
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
  async getByDetail(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Deal)) filter: Filter<Deal>,
  ): Promise<any[]> {
    let now = new Date();

    let cloneFilter = Object.assign({}, filter);
    if (filter !== undefined) {
      if (filter.where !== undefined) {

        let myFilter = {};

        let dealFilter: { buildingName: string, dealType: string } = <{ buildingName: string, dealType: string }>filter.where;
        if (dealFilter.buildingName != null) {
          myFilter = { ...myFilter, ...{ or: [{ buildingName: { like: dealFilter.buildingName } }, { contractNumber: { like: dealFilter.buildingName } }] } }
        }

        if (dealFilter.dealType != null) {
          let oneMonthLater = now;
          oneMonthLater.setMonth(now.getMonth() + 1);
          now = new Date();

          switch (dealFilter.dealType) {
            case 'all':
            case '':
              myFilter = { ...myFilter, ...{ contractFinishDate: { gte: now.toISOString() } } }
              break;
            case 'expiredDeals':
              myFilter = { ...myFilter, ...{ contractFinishDate: { lt: oneMonthLater.toISOString() } } }
              break;
            default:
              break;
          }

        }
        filter.where = { ...filter.where, ...myFilter }

        filter.where = { and: [{ companyUserId: Number(currentUser.id) }, filter.where] };
      } else {
        filter.where = { and: [{ companyUserId: Number(currentUser.id) }, { contractFinishDate: { gte: now.toISOString() } }] };
      }
    } else {
      filter = { where: { and: [{ companyUserId: Number(currentUser.id) }, { contractFinishDate: { gte: now.toISOString() } }] } };
    }

    let deals = await this.dealRepository.find(filter);
    let applyInsuarnceFilter = false;
    await Promise.all(
      deals.map(async d => {
        try {

          let customer = await this.dealRepository.customer(d.id);
          d.customer = customer;

          let whereFilter = {};
          if (cloneFilter !== undefined && cloneFilter.where !== undefined) {

            let queryFilter: { buildingName: string, dealType: string } = <{ buildingName: string, dealType: string }>cloneFilter.where;
            if (queryFilter.dealType != null && queryFilter.dealType == "expiredInsurances") {
              now = new Date();
              let oneMonthLater = now;
              applyInsuarnceFilter = true;
              oneMonthLater.setMonth(now.getMonth() + 1);
              whereFilter = {
                where: {
                  finishDate: { lt: oneMonthLater.toISOString() }
                }
              }
            }

          }


          let insurance = await this.dealRepository.insurance(d.id).get(whereFilter);
          d.insurance = insurance;

          let region = await this.dealRepository.region(d.id);
          d.region = region;

          let serviceUser = await this.dealRepository.serviceUser(d.id);
          d.serviceUser = serviceUser;
        } catch {

        }
      }),
    );

    if (applyInsuarnceFilter) {
      let result: any[] = [];
      deals.map(d => {
        if (applyInsuarnceFilter && d.insurance !== undefined) {
          result.push(d);
        }
      });

      return result;
    } else {
      return deals;
    }


    // const sql = `SELECT d.id, c.id AS customer_id, c.name AS customer_name, d.building_name, d.contract_number,
    //   d.contract_finish_date, d.cost_per_service, d.full_deal_cost, d.service_day,
    //   r.name AS region, su.name as service_user_name, su.id as service_user_id
    //   FROM deals d
    //   LEFT JOIN customers c ON c.id = d.customer_id
    //   LEFT JOIN regions r ON r.id = d.building_region
    //   LEFT JOIN service_users su ON d.service_user_id = su.id
    //   order by d.id desc`;

    // return await this.dealRepository.query(sql);
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
    @param.query.object('filter', getFilterSchemaFor(Deal)) filter: Filter<Deal>,
  ): Promise<{ data: Deal[], total: number }> {
    let now = new Date();

    if (filter !== undefined) {
      if (filter.where !== undefined) {
        filter.where = { and: [{ companyUserId: Number(currentUser.id) }, { contractFinishDate: { gte: now.toISOString() } }, filter.where] };
      } else {
        filter.where = { and: [{ companyUserId: Number(currentUser.id) }, { contractFinishDate: { gte: now.toISOString() } }] };
      }
    } else {
      filter = { where: { and: [{ companyUserId: Number(currentUser.id) }, { contractFinishDate: { gte: now.toISOString() } }] } };
    }

    let deals = await this.dealRepository.find(filter);
    let total = await this.dealRepository.count(filter.where);

    return { data: deals, total: total.count }
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
  ): Promise<{ data: Deal[], total: number }> {

    let now = new Date();
    let deals = await this.dealRepository.find({ where: { and: [{ companyUserId: Number(currentUser.id) }, { contractFinishDate: { lt: now.toISOString() } }] } });
    await Promise.all(
      deals.map(async d => {
        try {

          let customer = await this.dealRepository.customer(d.id);
          d.customer = customer;

          let insurance = await this.dealRepository.insurance(d.id).get();
          d.insurance = insurance;

          let region = await this.dealRepository.region(d.id);
          d.region = region;

          let serviceUser = await this.dealRepository.serviceUser(d.id);
          d.serviceUser = serviceUser;
        } catch {

        }
      }),
    );

    let total = await this.dealRepository.count(filter ? filter.where : {});

    return { data: deals, total: total.count }

    // const sql = `SELECT d.id, c.id AS customer_id, c.name AS customer_name, d.building_name, d.contract_number,
    //   d.contract_finish_date, d.cost_per_service, d.full_deal_cost, d.service_day,
    //   r.name AS region, su.name as service_user_name, su.id as service_user_id
    //   FROM deals d
    //   LEFT JOIN customers c ON c.id = d.customer_id
    //   LEFT JOIN regions r ON r.id = d.building_region
    //   LEFT JOIN service_users su ON d.service_user_id = su.id
    //   order by d.id desc`;

    // return await this.dealRepository.query(sql);
  }

  @authenticate('jwt')
  @get('/deals/getDetail/{id}', {
    responses: {
      '204': {
        description: 'Deal model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Deal } } },
      },
    },
  })
  async get(@param.path.number('id') id: number): Promise<any> {

    let deal = await this.dealRepository.findById(id);

    let lift = await this.dealRepository.lift(deal.id).get();

    try {
      let insurance = await this.dealRepository.insurance(deal.id).get();
      deal.insurance = insurance;
    } catch {

    }


    let deviceType = await this.liftRepository.deviceType(lift.id);

    lift.deviceType = deviceType;
    deal.lift = lift;

    return deal;
  }

  @authenticate('jwt')
  @get('/deals/getServices/{dealId}', {
    responses: {
      '200': {
        description: 'Deal model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async getServices(@param.path.number('dealId') dealId: number): Promise<Service[]> {

    return await this.dealRepository.services(dealId).find();
  }

  @authenticate('jwt')
  @get('/deals/getUndoneServices/{dealId}', {
    responses: {
      '200': {
        description: 'Deal model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async getUndoneServices(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.number('dealId') dealId: number,
    @param.query.object('filter', getFilterSchemaFor(Service)) filter: Filter<Service>,
  ): Promise<Service[]> {

    let now = new Date();

    filter = <Filter<Service>>{
      where:
      {
        and:
          [
            {
              or: [
                { status: { eq: "undone" } },
                { status: { eq: "submitted" } },
                { status: { eq: null } }
              ]
            },
            {
              serviceUserId: Number(currentUser.id)
            },
            {
              time: { lte: now }
            }
          ]
      }
    };
    return await this.dealRepository.services(dealId).find(filter);
  }

  @authenticate('jwt')
  @get('/deals/getUndoneDamages/{dealId}', {
    responses: {
      '200': {
        description: 'Deal model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async getUndoneDamages(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.number('dealId') dealId: number,
    @param.query.object('filter', getFilterSchemaFor(Damage)) filter: Filter<Damage>,
  ): Promise<Damage[]> {

    filter = <Filter<Damage>>{
      where:
      {
        and:
          [
            {
              or: [
                { status: { eq: "undone" } },
                { status: { eq: "submitted" } },
                { status: { eq: null } }
              ]
            },
            {
              serviceUserId: Number(currentUser.id)
            }
          ]
      }
    };
    return await this.dealRepository.damages(dealId).find(filter);
  }

}
