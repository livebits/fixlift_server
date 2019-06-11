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
  Company,
  Customer,
} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyCustomerController {
  constructor(
    @repository(CompanyRepository) protected companyRepository: CompanyRepository,
  ) { }

  @get('/companies/{id}/customers', {
    responses: {
      '200': {
        description: 'Array of Customer\'s belonging to Company',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Customer } },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return await this.companyRepository.customers(id).find(filter);
  }

  @post('/companies/{id}/customers', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Customer } } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Company.prototype.id,
    @requestBody() customer: Customer,
  ): Promise<Customer> {
    return await this.companyRepository.customers(id).create(customer);
  }

  @patch('/companies/{id}/customers', {
    responses: {
      '200': {
        description: 'Company.Customer PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody() customer: Partial<Customer>,
    @param.query.object('where', getWhereSchemaFor(Customer)) where?: Where<Customer>,
  ): Promise<Count> {
    return await this.companyRepository.customers(id).patch(customer, where);
  }

  @del('/companies/{id}/customers', {
    responses: {
      '200': {
        description: 'Company.Customer DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Customer)) where?: Where<Customer>,
  ): Promise<Count> {
    return await this.companyRepository.customers(id).delete(where);
  }
}
