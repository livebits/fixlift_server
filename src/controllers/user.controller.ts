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
} from '../keys';
import * as _ from 'lodash';
import { authorize } from '../authorization';
import { UserRoleRepository } from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(UserRoleRepository)
    public userRoleRepository: UserRoleRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
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
  ): Promise<{ token: string }> {
    // validateCredentials(credentials);

    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return { token };
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
}
