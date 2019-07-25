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
  getModelSchemaRef,
} from '@loopback/rest';
import { Customer, Damage, Payment, WorkPayment, Deal, Balance, CustomerWithRelations, CustomerRelations } from '../models';
import { CustomerRepository, DamageRepository, ServiceUserRepository, DealRepository, LiftRepository } from '../repositories';
import { AuthenticationBindings, UserProfile, authenticate, UserService, TokenService } from '@loopback/authentication';
import { inject, intercept } from '@loopback/core';
import { CustomerService } from '../services/customer-service';
import { CustomerServiceBindings, SMSServiceBindings, TokenServiceBindings } from '../keys';
import { SMSService } from '../services/sms.service';
import { PaymentService } from '../services/payment.service';
import { service } from 'loopback4-spring';

export class CustomerController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @repository(DealRepository)
    public dealRepository: DealRepository,
    @repository(LiftRepository)
    public liftRepository: LiftRepository,
    @repository(ServiceUserRepository)
    public serviceUserRepository: ServiceUserRepository,
    @repository(DamageRepository)
    public damageRepository: DamageRepository,
    @inject(CustomerServiceBindings.CUSTOMER_SERVICE)
    public customerService: CustomerService,
    @inject(SMSServiceBindings.SMS_SERVICE)
    private smsService: SMSService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @service(PaymentService)
    private paymentService: PaymentService,
  ) { }

  @authenticate('jwt')
  @intercept('UniqueMobile')
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

  @authenticate('jwt')
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
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.query.object('filter', getFilterSchemaFor(Customer)) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return await this.customerRepository.find({ where: { companyUserId: Number(currentUser.id) } });
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

  @authenticate('jwt')
  @intercept('UniqueMobile')
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

  //app apis
  @authenticate('jwt')
  @get('/customers/stats', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Customer, { partial: true }), } },
      },
    },
  })
  async stats(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<CustomerRelations> {

    // const sql = `SELECT c.*, COALESCE(c.password, 0) as balance
    //   FROM customers c
    //   WHERE c.id = ${currentUser.id}`;

    let customer = await this.customerRepository.findById(Number(currentUser.id));

    // let balance = new Balance();
    // balance.balance = 0;

    // customer.deals = [deal, deal];

    return customer;
  }

  @authenticate('jwt')
  @post('/customers/add-damage', {
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

    damage.createdBy = "customer";
    damage.creatorId = Number(currentUser.id);
    damage.createdOn = new Date();
    damage.modifiedOn = new Date();

    delete damage.id;
    delete damage.serviceUserId;

    return await this.damageRepository.create(damage);
  }

  @authenticate('jwt')
  @post('/customers/add-customer-payments', {
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

    let customer = await this.customerRepository.findById(Number(currentUser.id));
    return await this.paymentService.create(customer.companyUserId, workPayment, false);
  }

  @authenticate('jwt')
  @get('/customers/deals', {
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
  ): Promise<Deal[]> {

    // const sql = `SELECT d.id, c.id AS customer_id, c.name AS customer_name, d.building_name, d.contract_number,
    //   d.contract_finish_date, d.cost_per_service, d.full_deal_cost, d.service_day,
    //   r.name AS region, su.name as service_user_name, su.id as service_user_id
    //   FROM deals d
    //   LEFT JOIN customers c ON c.id = d.customer_id
    //   LEFT JOIN regions r ON r.id = d.building_region
    //   LEFT JOIN service_users su ON d.service_user_id = su.id
    //   WHERE d.company_user_id = c.company_user_id AND c.id = ${currentUser.id}
    //   order by d.id desc`;

    let deals = await this.customerRepository.deals(Number(currentUser.id)).find();

    await Promise.all(
      deals.map(async d => {
        try {
          let lift = await this.dealRepository.lift(d.id).get();
          let deviceType = await this.liftRepository.deviceType(lift.id);

          d.lift = lift;
          d.lift.deviceType = deviceType;
        } catch {

        }
      }),
    );
    // console.log(deals);

    return deals;
  }
}
