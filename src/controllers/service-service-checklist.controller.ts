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
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Service,
  ServiceChecklist,
} from '../models';
import {ServiceRepository} from '../repositories';

export class ServiceServiceChecklistController {
  constructor(
    @repository(ServiceRepository) protected serviceRepository: ServiceRepository,
  ) { }

  @get('/services/{id}/service-checklists', {
    responses: {
      '200': {
        description: 'Array of ServiceChecklist\'s belonging to Service',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ServiceChecklist } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ServiceChecklist>,
  ): Promise<ServiceChecklist[]> {
    return await this.serviceRepository.serviceChecklists(id).find(filter);
  }

  @post('/services/{id}/service-checklists', {
    responses: {
      '200': {
        description: 'Service model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceChecklist } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Service.prototype.id,
    @requestBody() serviceChecklist: ServiceChecklist,
  ): Promise<ServiceChecklist> {
    return await this.serviceRepository.serviceChecklists(id).create(serviceChecklist);
  }

  @patch('/services/{id}/service-checklists', {
    responses: {
      '200': {
        description: 'Service.ServiceChecklist PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceChecklist, {partial: true}),
        },
      },
    })
    serviceChecklist: Partial<ServiceChecklist>,
    @param.query.object('where', getWhereSchemaFor(ServiceChecklist)) where?: Where<ServiceChecklist>,
  ): Promise<Count> {
    return await this.serviceRepository.serviceChecklists(id).patch(serviceChecklist, where);
  }

  @del('/services/{id}/service-checklists', {
    responses: {
      '200': {
        description: 'Service.ServiceChecklist DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ServiceChecklist)) where?: Where<ServiceChecklist>,
  ): Promise<Count> {
    return await this.serviceRepository.serviceChecklists(id).delete(where);
  }
}
