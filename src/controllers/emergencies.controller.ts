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
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { Emergency } from '../models';
import { EmergencyRepository, DealRepository } from '../repositories';
import { AuthenticationBindings, UserProfile, authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
var moment = require('moment');

export class EmergenciesController {
  constructor(
    @repository(EmergencyRepository)
    public emergencyRepository: EmergencyRepository,
    @repository(DealRepository)
    public dealRepository: DealRepository,
  ) { }

  @post('/emergencies', {
    responses: {
      '200': {
        description: 'Emergency model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Emergency } } },
      },
    },
  })
  async create(@requestBody() emergency: Emergency): Promise<Emergency> {
    emergency.status = "submitted";
    return await this.emergencyRepository.create(emergency);
  }

  @get('/emergencies/count', {
    responses: {
      '200': {
        description: 'Emergency model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Emergency)) where?: Where<Emergency>,
  ): Promise<Count> {
    return await this.emergencyRepository.count(where);
  }

  @authenticate('jwt')
  @get('/emergencies', {
    responses: {
      '200': {
        description: 'Array of Emergency model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Emergency } },
          },
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Emergency)) filter?: Filter<Emergency>,
  ): Promise<{ data: Emergency[], total: number }> {

    let now = new Date();

    let dealsIds: (number[]) = [];
    let deals = await this.dealRepository.find({ where: { companyUserId: Number(currentUser.id) }, fields: { id: true } });
    deals.forEach(deal => {
      dealsIds.push(deal.id ? deal.id : 0);
    });

    let cloneFilter = Object.assign({}, filter);
    if (filter !== undefined) {
      if (filter.where !== undefined) {

        let myFilter = {};

        let emgFilter: { search: string, emgType: string, emgTime: string } = <{ search: string, emgType: string, emgTime: string }>filter.where;
        if (emgFilter.search != null) {
          myFilter = { ...myFilter, ...{ or: [{ serviceUserReport: { like: emgFilter.search } }] } }
        }

        if (emgFilter.emgType != null) {

          switch (emgFilter.emgType) {
            case 'all':
            case '':
              myFilter = { ...myFilter }
              break;
            case 'undone':
              myFilter = { ...myFilter, ...{ or: [{ status: { eq: 'undone' } }, { status: { eq: 'submitted' } }, { status: { eq: '' } }, { status: { eq: null } }] } }
              break
            case 'done':
              myFilter = { ...myFilter, ...{ status: { eq: 'done' } } }
              break;
            default:
              break;
          }
        }

        if (emgFilter.emgTime != null) {

          switch (emgFilter.emgTime) {
            case 'all':
            case '':
              myFilter = { ...myFilter }
              break;
            case 'thisWeek':
              myFilter = { ...myFilter, ...{ and: [{ time: { lte: moment().endOf('isoWeek') } }, { time: { gte: moment().startOf('isoWeek') } }] } }
              break;
            case 'lastWeek':
              myFilter = { ...myFilter, ...{ and: [{ time: { lte: moment().subtract(1, 'weeks').endOf('isoWeek') } }, { time: { gte: moment().subtract(1, 'weeks').startOf('isoWeek') } }] } }
              break;
            case 'thisMonth':
              myFilter = { ...myFilter, ...{ and: [{ time: { lte: moment().endOf('month') } }, { time: { gte: moment().startOf('month') } }] } }
              break;
            case 'lastMonth':
              myFilter = { ...myFilter, ...{ and: [{ time: { lte: moment().subtract(1, 'months').endOf('month') } }, { time: { gte: moment().subtract(1, 'months').startOf('month') } }] } }
              break;
            case 'thisYear':
              myFilter = { ...myFilter, ...{ and: [{ time: { gte: moment().startOf('year') } }, { time: { lte: moment().endOf('year') } }] } }
              break;
            case 'lastYears':
              myFilter = { ...myFilter, ...{ time: { lte: moment().startOf('year') } } }
              break;

            default:
              break;
          }
        } else {
          myFilter = { ...myFilter, ...{ time: { lte: now.toISOString() } } }
        }

        filter.where = { ...filter.where, ...myFilter }

        filter.where = { and: [{ dealId: { inq: dealsIds } }, filter.where] };
      } else {
        filter.where = { and: [{ dealId: { inq: dealsIds } }, { time: { lte: now.toISOString() } }] };
      }
    } else {
      filter = { where: { and: [{ dealId: { inq: dealsIds } }, { time: { lte: now.toISOString() } }] } };
    }

    let emergencies = await await this.emergencyRepository.find(filter);
    let total = await this.emergencyRepository.count(filter.where);

    return { data: emergencies, total: total.count }

    // const sql = `SELECT e.id, e.service_user_id as serviceUserId, e.time, e.done_time as donetime, e.start_time AS startTime,
    // e.finish_time as finishTime, e.service_user_report as serviceUserReport, deals.id as dealId
    // FROM emergencies e
    // LEFT JOIN deals ON deals.id = e.deal_id
    // WHERE deals.company_user_id = ${currentUser.id}
    // order by e.id desc`;

    // return await this.emergencyRepository.query(sql);
    // return await this.emergencyRepository.find(filter);
  }

  @patch('/emergencies', {
    responses: {
      '200': {
        description: 'Emergency PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Emergency, { partial: true }),
        },
      },
    })
    emergency: Emergency,
    @param.query.object('where', getWhereSchemaFor(Emergency)) where?: Where<Emergency>,
  ): Promise<Count> {
    return await this.emergencyRepository.updateAll(emergency, where);
  }

  @get('/emergencies/{id}', {
    responses: {
      '200': {
        description: 'Emergency model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Emergency } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Emergency> {
    return await this.emergencyRepository.findById(id);
  }

  @patch('/emergencies/{id}', {
    responses: {
      '204': {
        description: 'Emergency PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Emergency, { partial: true }),
        },
      },
    })
    emergency: Emergency,
  ): Promise<void> {
    await this.emergencyRepository.updateById(id, emergency);
  }

  @put('/emergencies/{id}', {
    responses: {
      '204': {
        description: 'Emergency PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() emergency: Emergency,
  ): Promise<void> {
    await this.emergencyRepository.replaceById(id, emergency);
  }

  @del('/emergencies/{id}', {
    responses: {
      '204': {
        description: 'Emergency DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.emergencyRepository.deleteById(id);
  }
}
