import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Deal,
  Service,
} from '../models';
import {DealRepository} from '../repositories';

export class DealServiceController {
  constructor(
    @repository(DealRepository) protected dealRepository: DealRepository,
  ) { }

  @get('/deals/{id}/services', {
    responses: {
      '200': {
        description: 'Array of Service\'s belonging to Deal',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Service } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Service>,
  ): Promise<Service[]> {
    return await this.dealRepository.services(id).find(filter);
  }

  @post('/deals/{id}/services', {
    responses: {
      '200': {
        description: 'Deal model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Service } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Deal.prototype.id,
    @requestBody() service: Service,
  ): Promise<Service> {
    return await this.dealRepository.services(id).create(service);
  }

  @patch('/deals/{id}/services', {
    responses: {
      '200': {
        description: 'Deal.Service PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() service: Partial<Service>,
    @param.query.object('where', getWhereSchemaFor(Service)) where?: Where<Service>,
  ): Promise<Count> {
    return await this.dealRepository.services(id).patch(service, where);
  }

  @del('/deals/{id}/services', {
    responses: {
      '200': {
        description: 'Deal.Service DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Service)) where?: Where<Service>,
  ): Promise<Count> {
    return await this.dealRepository.services(id).delete(where);
  }
}
