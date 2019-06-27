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
import { Customer } from '../models';
import { CustomerRepository } from '../repositories';
import { AuthenticationBindings, UserProfile, authenticate, UserService, TokenService } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { CustomerService } from '../services/customer-service';
import { CustomerServiceBindings, SMSServiceBindings, TokenServiceBindings } from '../keys';
import { SMSService } from '../services/sms.service';

export type CustomerCredentials = {
  mobile: string;
  code?: string;
};

export class CustomerController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @inject(CustomerServiceBindings.CUSTOMER_SERVICE)
    public customerService: CustomerService,
    @inject(SMSServiceBindings.SMS_SERVICE)
    private smsService: SMSService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) { }

  @authenticate('jwt')
  @post('/customers', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Customer } } },
      },
    },
  })
  async create(
    @requestBody() customer: Customer,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Customer> {

    customer.companyUserId = Number(currentUser.id);
    return await this.customerRepository.create(customer);
  }

  @get('/customers/count', {
    responses: {
      '200': {
        description: 'Customer model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Customer)) where?: Where<Customer>,
  ): Promise<Count> {
    return await this.customerRepository.count(where);
  }

  @get('/customers', {
    responses: {
      '200': {
        description: 'Array of Customer model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Customer } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Customer)) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return await this.customerRepository.find(filter);
  }

  @patch('/customers', {
    responses: {
      '200': {
        description: 'Customer PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() customer: Customer,
    @param.query.object('where', getWhereSchemaFor(Customer)) where?: Where<Customer>,
  ): Promise<Count> {
    return await this.customerRepository.updateAll(customer, where);
  }

  @get('/customers/{id}', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Customer } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Customer> {
    return await this.customerRepository.findById(id);
  }

  @patch('/customers/{id}', {
    responses: {
      '204': {
        description: 'Customer PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() customer: Customer,
  ): Promise<void> {
    await this.customerRepository.updateById(id, customer);
  }

  @put('/customers/{id}', {
    responses: {
      '204': {
        description: 'Customer PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() customer: Customer,
  ): Promise<void> {
    await this.customerRepository.replaceById(id, customer);
  }

  @del('/customers/{id}', {
    responses: {
      '204': {
        description: 'Customer DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.customerRepository.deleteById(id);
  }
}
