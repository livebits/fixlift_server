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
import { Service, ServiceFilter } from '../models';
import { ServiceRepository, DealRepository, ServiceChecklistRepository, ServiceSegmentRepository, ChecklistRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';

export class ServicesController {
  constructor(
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
    @repository(DealRepository)
    public dealRepository: DealRepository,
    @repository(ServiceChecklistRepository)
    public serviceChecklistRepository: ServiceChecklistRepository,
    @repository(ServiceSegmentRepository)
    public serviceSegmentRepository: ServiceSegmentRepository,
    @repository(ChecklistRepository)
    public checklistRepository: ChecklistRepository,
  ) { }

  @post('/services', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async create(@requestBody() service: Service): Promise<Service> {
    service.status = "submitted";
    return await this.serviceRepository.create(service);
  }

  @get('/services/count', {
    responses: {
      '200': {
        description: 'Service model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Service)) where?: Where<Service>,
  ): Promise<Count> {
    return await this.serviceRepository.count(where);
  }

  @get('/services', {
    responses: {
      '200': {
        description: 'Array of Service model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Service } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Service)) filter?: Filter<Service>,
  ): Promise<Service[]> {

    return await this.serviceRepository.find(filter);
  }

  @patch('/services', {
    responses: {
      '200': {
        description: 'Service PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, { partial: true }),
        },
      },
    })
    service: Service,
    @param.query.object('where', getWhereSchemaFor(Service)) where?: Where<Service>,
  ): Promise<Count> {
    return await this.serviceRepository.updateAll(service, where);
  }

  @get('/services/{id}', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Service> {
    return await this.serviceRepository.findById(id);
  }

  @patch('/services/{id}', {
    responses: {
      '204': {
        description: 'Service PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Service, { partial: true }),
        },
      },
    })
    service: Service,
  ): Promise<void> {
    await this.serviceRepository.updateById(id, service);
  }

  @put('/services/{id}', {
    responses: {
      '204': {
        description: 'Service PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() service: Service,
  ): Promise<void> {
    await this.serviceRepository.replaceById(id, service);
  }

  @del('/services/{id}', {
    responses: {
      '204': {
        description: 'Service DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.serviceRepository.deleteById(id);
  }

  @authenticate('jwt')
  @post('/services/filter', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async filter(@requestBody() serviceFilter: Partial<Service>): Promise<any> {

    let where = '';
    if (serviceFilter.status && serviceFilter.status !== "") {
      // where += `WHERE s.status = '${serviceFilter.status}'`;
    }

    if (where !== '') {
      if (serviceFilter.dealId && serviceFilter.dealId !== 0) {
        where += ` AND d.id = '${serviceFilter.dealId}'`;
      }
    } else {
      if (serviceFilter.dealId && serviceFilter.dealId !== 0) {
        where += `WHERE d.id = '${serviceFilter.dealId}'`;
      }
    }

    const sql = `SELECT s.*, s.id AS service_id, d.*, d.id AS deal_id,
      d.service_user_id as deal_service_user_id, l.*, l.id AS lift_id,
      r.name AS region_name
      FROM services s
      LEFT JOIN deals d ON d.id = s.deal_id
      LEFT JOIN lifts l ON d.id = l.deal_id
      LEFT JOIN regions r ON d.building_region = r.id
      ${where}
      order by s.id desc`;

    return await this.serviceRepository.query(sql);
  }

  @authenticate('jwt')
  @get('/services/getDetail/{id}', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async getDetail(
    @param.path.number('id') id: number
  ): Promise<Service> {

    let service = await this.serviceRepository.findById(id);
    service.deal = await this.serviceRepository.deal(id);
    service.deal.lift = await this.dealRepository.lift(service.deal.id).get();

    if (service.status == "done") {
      let serviceChecklists = await this.serviceRepository.serviceChecklists(service.id).find();

      //add checklist
      await Promise.all(
        serviceChecklists.map(async sc => {
          try {
            const sql = `SELECT c.id, c.title, c.priority, c.status, clc.title AS checkListCategoryTitle, clc.priority AS checkListCategoryPriority
              FROM checklists c
              LEFT JOIN checklist_categories clc ON c.checklist_category_id = checklist_categories.id
              WHERE c.id = ${sc.checklistId}
              ORDER BY clc.priority ASC, c.priority ASC`;

            let checklist = await this.checklistRepository.query(sql);
            sc.checklist = checklist[0];
          } catch {

          }
        }),
      );

      service.serviceChecklists = serviceChecklists;

      //service segment items
      let serviceSegments = await this.serviceRepository.serviceSegments(service.id).find();
      await Promise.all(
        serviceSegments.map(async ss => {
          try {
            ss.segment = await this.serviceSegmentRepository.segment(ss.id);
          } catch {

          }
        }),
      );
      service.serviceSegments = serviceSegments;

      //service factor items
      let serviceFactors = await this.serviceRepository.serviceFactors(service.id).find();
      service.serviceFactors = serviceFactors;
    }

    return service;
  }
}
