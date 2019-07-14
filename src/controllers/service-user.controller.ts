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
import { ServiceUser, Damage, Payment, WorkPayment, Deal, Customer } from '../models';
import { ServiceUserRepository, DamageRepository, CustomerRepository, DealRepository } from '../repositories';
import { authenticate, AuthenticationBindings, UserProfile } from '@loopback/authentication';
import { inject, intercept } from '@loopback/core';
import { PaymentService } from '../services/payment.service';
import { service } from 'loopback4-spring';

export class ServiceUserController {
  constructor(
    @repository(ServiceUserRepository)
    public serviceUserRepository: ServiceUserRepository,
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(DealRepository)
    public dealRepository: DealRepository,
    @repository(DamageRepository)
    public damageRepository: DamageRepository,
    @service(PaymentService)
    private paymentService: PaymentService,
  ) { }

  @authenticate('jwt')
  @intercept('UniqueMobile')
  @post('/service-users', {
    responses: {
      '200': {
        description: 'ServiceUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceUser } } },
      },
    },
  })
  async create(
    @requestBody() serviceUser: ServiceUser,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<ServiceUser> {
    serviceUser.companyUserId = Number(currentUser.id);
    return await this.serviceUserRepository.create(serviceUser);
  }

  @get('/service-users/count', {
    responses: {
      '200': {
        description: 'ServiceUser model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(ServiceUser)) where?: Where<ServiceUser>,
  ): Promise<Count> {
    return await this.serviceUserRepository.count(where);
  }

  @get('/service-users', {
    responses: {
      '200': {
        description: 'Array of ServiceUser model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': ServiceUser } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(ServiceUser)) filter?: Filter<ServiceUser>,
  ): Promise<ServiceUser[]> {
    return await this.serviceUserRepository.find(filter);
  }

  @patch('/service-users', {
    responses: {
      '200': {
        description: 'ServiceUser PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() serviceUser: ServiceUser,
    @param.query.object('where', getWhereSchemaFor(ServiceUser)) where?: Where<ServiceUser>,
  ): Promise<Count> {
    return await this.serviceUserRepository.updateAll(serviceUser, where);
  }

  @get('/service-users/{id}', {
    responses: {
      '200': {
        description: 'ServiceUser model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceUser } } },
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<ServiceUser> {
    return await this.serviceUserRepository.findById(id);
  }

  @authenticate('jwt')
  @intercept('UniqueMobile')
  @patch('/service-users/{id}', {
    responses: {
      '204': {
        description: 'ServiceUser PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() serviceUser: ServiceUser,
  ): Promise<void> {
    await this.serviceUserRepository.updateById(id, serviceUser);
  }

  @put('/service-users/{id}', {
    responses: {
      '204': {
        description: 'ServiceUser PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() serviceUser: ServiceUser,
  ): Promise<void> {
    await this.serviceUserRepository.replaceById(id, serviceUser);
  }

  @del('/service-users/{id}', {
    responses: {
      '204': {
        description: 'ServiceUser DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.serviceUserRepository.deleteById(id);
  }

  //app apis
  @authenticate('jwt')
  @post('/service-users/add-damage', {
    responses: {
      '200': {
        description: 'Damage model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Damage } } },
      },
    },
  })
  async addDamage(
    @requestBody() damage: Damage,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Damage> {

    damage.createdBy = "service_user";
    damage.creatorId = Number(currentUser.id);
    return await this.damageRepository.create(damage);
  }

  @authenticate('jwt')
  @post('/service-users/add-customer-payments', {
    responses: {
      '200': {
        description: 'CustomerPayment model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Payment } } },
      },
    },
  })
  async createByServiceUser(
    @requestBody() workPayment: WorkPayment,
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Payment> {
    let serviceUser = await this.serviceUserRepository.findById(Number(currentUser.id));
    return await this.paymentService.create(serviceUser.companyUserId, workPayment, false);
  }

  @authenticate('jwt')
  @get('/service-users/stats', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: { 'application/json': { schema: { 'x-ts-type': ServiceUser } } },
      },
    },
  })
  async stats(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<ServiceUser> {

    return await this.serviceUserRepository.findById(Number(currentUser.id));
  }

  @authenticate('jwt')
  @get('/service-users/deals', {
    responses: {
      '200': {
        description: 'Array of Deal model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Deal } },
          },
        },
      },
    },
  })
  async getDeals(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<any[]> {

    const sql = `SELECT d.id, c.id AS customer_id, c.name AS customer_name, d.building_name, d.contract_number,
      d.contract_finish_date, d.cost_per_service, d.full_deal_cost, d.service_day,
      r.name AS region, su.name as service_user_name, su.id as service_user_id
      FROM deals d
      LEFT JOIN customers c ON c.id = d.customer_id
      LEFT JOIN regions r ON r.id = d.building_region
      LEFT JOIN service_users su ON d.service_user_id = su.id
      WHERE d.company_user_id = su.company_user_id AND su.id = ${currentUser.id}
      order by d.id desc`;

    return await this.serviceUserRepository.query(sql);
  }

  @authenticate('jwt')
  @get('/service-users/getCustomers', {
    responses: {
      '200': {
        description: 'Array of Customers model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Customer } },
          },
        },
      },
    },
  })
  async getCustomers(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Customer[]> {
    // await this.companyRepository.find(filter);

    let serviceUser = await this.serviceUserRepository.findById(Number(currentUser.id));
    return await this.customerRepository.find({ where: { companyUserId: serviceUser.companyUserId } });
  }

  @authenticate('jwt')
  @get('/service-users/getCompanyDeals', {
    responses: {
      '200': {
        description: 'Array of Customers model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Customer } },
          },
        },
      },
    },
  })
  async getCompanyDeals(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<Deal[]> {

    let serviceUser = await this.serviceUserRepository.findById(Number(currentUser.id));
    return await this.dealRepository.find({ where: { companyUserId: serviceUser.companyUserId } });
  }

}
