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
  Customer,
  Deal,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerDealController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
  ) { }

  @get('/customers/{id}/deals', {
    responses: {
      '200': {
        description: 'Array of Deal\'s belonging to Customer',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Deal } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Deal>,
  ): Promise<Deal[]> {
    return await this.customerRepository.deals(id).find(filter);
  }

  @post('/customers/{id}/deals', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Deal } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Customer.prototype.id,
    @requestBody() deal: Deal,
  ): Promise<Deal> {
    return await this.customerRepository.deals(id).create(deal);
  }

  @patch('/customers/{id}/deals', {
    responses: {
      '200': {
        description: 'Customer.Deal PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() deal: Partial<Deal>,
    @param.query.object('where', getWhereSchemaFor(Deal)) where?: Where<Deal>,
  ): Promise<Count> {
    return await this.customerRepository.deals(id).patch(deal, where);
  }

  @del('/customers/{id}/deals', {
    responses: {
      '200': {
        description: 'Customer.Deal DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Deal)) where?: Where<Deal>,
  ): Promise<Count> {
    return await this.customerRepository.deals(id).delete(where);
  }
}
