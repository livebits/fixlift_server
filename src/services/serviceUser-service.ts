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
import { Customer, ServiceUser } from '../models';
import { CustomerRepository, ServiceUserRepository } from '../repositories';
import { ServiceUserCredentials } from '../controllers';

export class ServiceUserService {
  constructor(
    @repository(ServiceUserRepository) public ServiceUserRepository: ServiceUserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
  ) { }

  async verifyCredentials(credentials: ServiceUserCredentials): Promise<ServiceUser | null> {
    const foundUser = await this.ServiceUserRepository.findOne({
      where: { mobile: credentials.mobile },
    });

    // if (!foundUser) {
    //   throw new HttpErrors.NotFound(
    //     `Customer with mobile ${credentials.mobile} not found.`,
    //   );
    // }

    return foundUser;
  }

  async verifyCodeCredentials(credentials: ServiceUserCredentials): Promise<ServiceUser> {
    const foundUser = await this.ServiceUserRepository.findOne({
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

  convertToUserProfile(serviceUser: ServiceUser): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    return { id: String(serviceUser.id), name: serviceUser.name };
  }
}
