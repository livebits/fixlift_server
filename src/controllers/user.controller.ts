// Copyright IBM Corp. 2018,2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { repository, Filter } from '@loopback/repository';
import { validateCredentials } from '../services/validator';
import { post, param, get, requestBody, getFilterSchemaFor } from '@loopback/rest';
import { User } from '../models';
import { inject } from '@loopback/core';
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

export class UserController {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) { }

  @post('/users')
  async create(@requestBody() user: User): Promise<User> {
    // ensure a valid email value and password value
    // validateCredentials(_.pick(user, ['email', 'password']));

    // encrypt the password
    user.password = await this.passwordHasher.hashPassword(user.password);

    // create the new user
    const savedUser = await this.userRepository.create(user);
    delete savedUser.password;

    return savedUser;
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
  async findById(@param.path.string('userId') userId: string): Promise<User> {
    return this.userRepository.findById(Number(userId), {
      fields: { password: false },
    });
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

  // @get('/users/{userId}/recommend', {
  //   responses: {
  //     '200': {
  //       description: 'Products',
  //       content: {
  //         'application/json': {
  //           schema: {
  //             type: 'array',
  //             items: {
  //               'x-ts-type': Product,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // })
  // async productRecommendations(
  //   @param.path.string('userId') userId: string,
  // ): Promise<Product[]> {
  //   return this.recommender.getProductRecommendations(userId);
  // }

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
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter<User>,
  ): Promise<User[]> {
    // const data = await this.userRepository.execute('select * from users left join companies cc on cc.user_id = users.id', []);
    // console.log(data);

    return await this.userRepository.find(filter);
  }

}
