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
import { ServiceRepository } from '../repositories';

export class ServicesController {
  constructor(
    @repository(ServiceRepository)
    public serviceRepository: ServiceRepository,
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

  @post('/services/filter', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async filter(@requestBody() serviceFilter: ServiceFilter): Promise<any> {

    // return await this.serviceRepository.create(service);

    const sql = `SELECT s.*, d.*, l.*
      FROM services s
      LEFT JOIN deal d ON d.id = s.deal_id
      LEFT JOIN lifts l ON d.id = l.deal_id
      WHERE s.status = ${serviceFilter.status} AND d.contract_number = ${serviceFilter.dealContractNumber}
      order by s.id desc`;

    return await this.serviceRepository.query(sql);
  }
}
