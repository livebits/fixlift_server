import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Deal,
  Customer,
} from '../models';
import {DealRepository} from '../repositories';

export class DealCustomerController {
  constructor(
    @repository(DealRepository)
    public dealRepository: DealRepository,
  ) { }

  @get('/deals/{id}/customer', {
    responses: {
      '200': {
        description: 'Customer belonging to Deal',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Customer } },
          },
        },
      },
    },
  })
  async getCustomer(
    @param.path.number('id') id: typeof Deal.prototype.id,
  ): Promise<Customer> {
    return await this.dealRepository.customer(id);
  }
}
