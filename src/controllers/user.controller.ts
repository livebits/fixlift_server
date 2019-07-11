// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import { validateCredentials } from '../services/validator';
import {
  post,
  param,
  get,
  requestBody,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  HttpErrors,
} from '@loopback/rest';
import { User, UserWithRole, UserRole } from '../models';
import { inject, intercept } from '@loopback/core';
import {
  authenticate,
  UserProfile,
  AuthenticationBindings,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {
  CredentialsRequestBody,
  UserProfileSchema,
} from './specs/user-controller.specs';
import { Credentials, UserRepository } from '../repositories/user.repository';
import { PasswordHasher } from '../services/hash.password.bcryptjs';

import {
  TokenServiceBindings,
  PasswordHasherBindings,
  UserServiceBindings,
  CustomerServiceBindings,
  ServiceUserBindings,
  SMSServiceBindings,
} from '../keys';
import * as _ from 'lodash';
import { authorize } from '../authorization';
import { UserRoleRepository, CustomerRepository, ServiceUserRepository } from '../repositories';
import { CustomerService } from '../services/customer-service';
import { ServiceUserService } from '../services/serviceUser-service';
import { SMSService } from '../services/sms.service';

export type AppUserCredentials = {
  mobile: string;
  code?: string;
  role?: string;
};

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(CustomerRepository) public customerRepository: CustomerRepository,
    @repository(ServiceUserRepository) public serviceUserRepository: ServiceUserRepository,
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,

    @inject(CustomerServiceBindings.CUSTOMER_SERVICE)
    public customerService: CustomerService,
    @inject(ServiceUserBindings.SERVICE_USER_SERVICE)
    public serviceUserService: ServiceUserService,
    @inject(SMSServiceBindings.SMS_SERVICE)
    private smsService: SMSService,
  ) { }

  @post('/users')
  @intercept('UniqueUsername')
  async create(@requestBody() user: UserWithRole): Promise<User> {
    // ensure a valid email value and password value
    // validateCredentials(_.pick(user, ['email', 'password']));

    // encrypt the password
    user.password = await this.passwordHasher.hashPassword(user.password);

    //empty permissions
    user.permissions = [];

    // create user role
    const userRole = new UserRole();
    userRole.roleId = user.role;

    // create the new user
    delete user.role;
    const savedUser = await this.userRepository.create(user);

    userRole.userId = savedUser.id;

    await this.userRoleRepository.create(userRole);

    delete savedUser.password;

    return savedUser;
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User))
    where?: Where<User>,
  ): Promise<Count> {
    return await this.userRepository.count(where);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() user: User,
    @param.query.object('where', getWhereSchemaFor(User))
    where?: Where<User>,
  ): Promise<Count> {
    return await this.userRepository.updateAll(user, where);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': UserWithRole,
            },
          },
        },
      },
    },
  })
  @intercept('UniqueUsername')
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() user: UserWithRole,
  ): Promise<void> {
    if (user.lastLogin) delete user.lastLogin;
    await this.userRepository.updateById(id, user);
    const userRole = new UserRole();
    userRole.userId = id;
    userRole.roleId = user.role;
    await this.userRoleRepository.deleteAll({ userId: id });
    await this.userRoleRepository.create(userRole);
    // return user;
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: UserWithRole,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  @get('/users/{userId}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async findById(@param.path.number('userId') userId: number): Promise<any> {
    // return this.userRepository.findById(userId, {
    //   fields: {password: false},
    // });

    const sql = `SELECT u.id, u.first_name AS firstName, u.last_name AS lastName, u.username, r.id AS role FROM users u LEFT JOIN user_roles ur ON ur.user_id = u.id LEFT JOIN roles r ON r.id = ur.role_id WHERE u.id=${userId}`;

    const r = await this.userRepository.query(sql, [], [], 0);
    return r[0];
  }

  @get('/users/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }

  @authorize(['*'])
  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<any> {
    // validateCredentials(credentials);

    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    //get user role with permissions
    const sql = `select u.super_admin as superAdmin ,r.name as role, r.permissions as permissions
      from users u
      left join user_roles ur on ur.user_id = u.id
      left join roles r on r.id = ur.role_id
      WHERE u.id = ${user.id}
      order by u.id desc`;

    let userWithRoles = await this.userRepository.query(sql);
    let result = userWithRoles[0];

    return { token, permissions: result };
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': User } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<any> {
    const sql = `select u.id, u.first_name as firstName, u.last_name as lastName, u.username, u.last_login as lastLogin, r.name as role
      from users u
      left join user_roles ur on ur.user_id = u.id
      left join roles r on r.id = ur.role_id
      order by u.id desc`;

    return await this.userRepository.query(sql);

    // return await this.userRepository.find(filter);
  }


  //login app users
  @post('/users/app-login', {
    responses: {
      '200': {
        description: 'Message',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                role: {
                  type: 'string',
                },
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async appLogin(
    @requestBody() credentials: AppUserCredentials,
  ): Promise<{ message: string, role: string }> {

    // ensure the user exists, and the password is correct
    let foundCustomerUser = await this.customerService.verifyCredentials(credentials);
    let foundServiceUser = null;

    if (!foundCustomerUser) {
      foundServiceUser = await this.serviceUserService.verifyCredentials(credentials);
    }

    if (!foundCustomerUser && !foundServiceUser) {
      throw new HttpErrors.NotFound(
        `Customer with mobile ${credentials.mobile} not found.`,
      );
    }

    //generate random code
    let code = Math.floor(Math.random() * (99999 - 10000)) + 10000;

    if (foundCustomerUser) {

      await this.customerRepository.updateAll({ verificationCode: code.toString() }, { id: foundCustomerUser.id });
      await this.smsService.sendVerificationCode(Number(foundCustomerUser.mobile), code);

    } else if (foundServiceUser) {

      await this.serviceUserRepository.updateAll({ verificationCode: code.toString() }, { id: foundServiceUser.id });
      await this.smsService.sendVerificationCode(Number(foundServiceUser.mobile), code);
    }

    let role = foundCustomerUser !== null ? 'customer' : foundServiceUser !== null ? 'service_user' : 'none'

    return { role: role, message: 'Verification code sent to your mobile number.' };
  }

  //verify customer user
  @post('/users/app-verify', {
    responses: {
      '200': {
        description: 'Message',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
                role: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async verify(
    @requestBody() credentials: AppUserCredentials,
  ): Promise<{ token: string, role: string }> {

    if (credentials.role === "customer") {
      // ensure the user exists, and the password is correct
      const customer = await this.customerService.verifyCodeCredentials(credentials);

      // convert a User object into a UserProfile object (reduced set of properties)
      const customerProfile = this.customerService.convertToUserProfile(customer);

      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(customerProfile);

      return { token, role: 'customer' };

    } else if (credentials.role === "service_user") {
      // ensure the user exists, and the password is correct
      const user = await this.serviceUserService.verifyCodeCredentials(credentials);

      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.serviceUserService.convertToUserProfile(user);

      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(userProfile);

      return { token, role: 'service_user' };

    } else {

      throw new HttpErrors.Unauthorized('The credentials are not correct.');
    }

  }
}
