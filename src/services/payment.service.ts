import { repository } from '@loopback/repository';
import {
  CompanyRepository,
  UserRepository,
  UserRoleRepository,
  Credentials,
  CustomerPaymentRepository,
  PaymentRepository,
} from '../repositories';
import {
  Company,
  User,
  Role,
  UserWithRole,
  CompanyWithUser,
  UserRole,
  WorkPayment,
  Payment,
  CustomerPayment,
} from '../models';
import { transactional } from 'loopback4-spring';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../keys';
import { PasswordHasher } from './hash.password.bcryptjs';
import { TokenService, UserService } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class PaymentService {
  constructor(
    @repository(CustomerPaymentRepository)
    public customerPaymentRepository: CustomerPaymentRepository,
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @transactional()
  async create(
    companyUserId: number,
    workPayment: WorkPayment,
    throwError: boolean,
    options?: Object,
  ): Promise<Payment> {

    let payment = new Payment();
    payment.amount = workPayment.amount;
    payment.companyUserId = companyUserId;
    payment.description = workPayment.paymentFor;
    payment.paymentType = workPayment.paymentType;
    payment.paymentDate = workPayment.paymentDate;
    payment.createdOn = new Date();
    payment.modifiedOn = new Date();
    const savedPayment: Payment = await this.paymentRepository.create(payment, options);

    let customerPayment = new CustomerPayment();
    customerPayment.addById = workPayment.addById;
    customerPayment.addByRole = workPayment.addByRole;
    customerPayment.companyUserId = companyUserId;
    customerPayment.customerId = workPayment.customerId;
    customerPayment.for = workPayment.paymentFor;
    customerPayment.paymentId = savedPayment.id;
    customerPayment.createdOn = new Date();
    customerPayment.modifiedOn = new Date();
    await this.customerPaymentRepository.create(customerPayment, options);

    if (throwError) {
      throw new Error(
        'Error after create user & company. Transaction is rollback.',
      );
    }

    return savedPayment;
  }
}
