// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BindingKey } from '@loopback/context';
import { PasswordHasher } from './services/hash.password.bcryptjs';
import { TokenService, UserService } from '@loopback/authentication';
import { User, Customer } from './models';
import { Credentials } from './repositories/user.repository';
import { CustomerCredentials } from './controllers';
import { SMSService } from './services/sms.service';
import { CustomerService } from './services/customer-service';
import { ServiceUserService } from './services/serviceUser-service';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '604800'; //seconds (1 week)
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
}

export namespace CustomerServiceBindings {
  export const CUSTOMER_SERVICE = BindingKey.create<CustomerService>(
    'services.customer.service',
  );
}

export namespace ServiceUserBindings {
  export const SERVICE_USER_SERVICE = BindingKey.create<ServiceUserService>(
    'services.ServiceUser.service',
  );
}

export namespace SMSServiceBindings {
  export const SMS_SERVICE = BindingKey.create<SMSService>(
    'services.sms.service',
  );
}
