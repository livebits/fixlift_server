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
import { CustomerPayment, WorkPayment } from '../models';
import { CustomerPaymentRepository } from '../repositories';
import { service } from 'loopback4-spring';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { PaymentService } from '../services/payment.service';

export class CustomerPaymentsController {
  constructor(
    @repository(CustomerPaymentRepository)
    public customerPaymentRepository: CustomerPaymentRepository,
    @service(PaymentService)
    private paymentService: PaymentService,
  ) { }

  @authenticate('jwt')
  @post('/customer-payments', {
    responses: {
      '200': {
        description: 'CustomerPayment model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CustomerPayment } } },
      },
    },
  })
  async create(
    @requestBody() customerPayment: CustomerPayment,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<CustomerPayment> {
    return await this.customerPaymentRepository.create(customerPayment);
    // return await this.paymentService.create(workPayment, false);
  }

  @get('/customer-payments/count', {
    responses: {
      '200': {
        description: 'CustomerPayment model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(CustomerPayment)) where?: Where<CustomerPayment>,
  ): Promise<Count> {
    return await this.customerPaymentRepository.count(where);
  }

  @get('/customer-payments', {
    responses: {
      '200': {
        description: 'Array of CustomerPayment model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': CustomerPayment } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(CustomerPayment)) filter?: Filter<CustomerPayment>,
  ): Promise<CustomerPayment[]> {
    return await this.customerPaymentRepository.find(filter);
  }

  @patch('/customer-payments', {
    responses: {
      '200': {
        description: 'CustomerPayment PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerPayment, { partial: true }),
        },
      },
    })
    customerPayment: CustomerPayment,
    @param.query.object('where', getWhereSchemaFor(CustomerPayment)) where?: Where<CustomerPayment>,
  ): Promise<Count> {
    return await this.customerPaymentRepository.updateAll(customerPayment, where);
  }

  @get('/customer-payments/{id}', {
    responses: {
      '200': {
        description: 'CustomerPayment model instance',
        content: { 'application/json': { schema: { 'x-ts-type': CustomerPayment } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<CustomerPayment> {
    return await this.customerPaymentRepository.findById(id);
  }

  @patch('/customer-payments/{id}', {
    responses: {
      '204': {
        description: 'CustomerPayment PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CustomerPayment, { partial: true }),
        },
      },
    })
    customerPayment: CustomerPayment,
  ): Promise<void> {
    await this.customerPaymentRepository.updateById(id, customerPayment);
  }

  @put('/customer-payments/{id}', {
    responses: {
      '204': {
        description: 'CustomerPayment PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() customerPayment: CustomerPayment,
  ): Promise<void> {
    await this.customerPaymentRepository.replaceById(id, customerPayment);
  }

  @del('/customer-payments/{id}', {
    responses: {
      '204': {
        description: 'CustomerPayment DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.customerPaymentRepository.deleteById(id);
  }
}
