// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import { HttpErrors } from '@loopback/rest';
import { Credentials, UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import { UserService, UserProfile } from '@loopback/authentication';
import { repository } from '@loopback/repository';
import { PasswordHasher } from './hash.password.bcryptjs';
import { PasswordHasherBindings } from '../keys';
import { inject } from '@loopback/context';
import { Customer } from '../models';
import { CustomerCredentials } from '../controllers';
import { CustomerRepository } from '../repositories';

export class CustomerService {
  constructor(
    @repository(CustomerRepository) public customerRepository: CustomerRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) { }

  async verifyCredentials(credentials: CustomerCredentials): Promise<Customer | null> {
    const foundUser = await this.customerRepository.findOne({
      where: { mobile: credentials.mobile },
    });

    // if (!foundUser) {
    //   throw new HttpErrors.NotFound(
    //     `Customer with mobile ${credentials.mobile} not found.`,
    //   );
    // }
    // const passwordMatched = await this.passwordHasher.comparePassword(
    //   credentials.password,
    //   foundUser.password,
    // );

    // if (!passwordMatched) {
    //   throw new HttpErrors.Unauthorized('The credentials are not correct.');
    // }

    return foundUser;
  }

  async verifyCodeCredentials(credentials: CustomerCredentials): Promise<Customer> {
    const foundUser = await this.customerRepository.findOne({
      where: { mobile: credentials.mobile },
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `Customer with mobile ${credentials.mobile} not found.`,
      );
    }

    const codeMatched = foundUser.verificationCode == credentials.code;

    if (!codeMatched) {
      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

    return foundUser;
  }

  convertToUserProfile(customer: Customer): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    return { id: String(customer.id), name: customer.name };
  }
}
