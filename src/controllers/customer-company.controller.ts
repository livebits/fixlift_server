import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
} from '@loopback/rest';
import {
  Customer,
  Company,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerCompanyController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
  ) { }

  @get('/customers/{id}/company', {
    responses: {
      '200': {
        description: 'Company belonging to Customer',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Company } },
          },
        },
      },
    },
  })
  async getCompany(
    @param.path.number('id') id: typeof Customer.prototype.id,
  ): Promise<Company> {
    return await this.customerRepository.company(id);
  }
}
