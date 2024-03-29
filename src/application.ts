import { BootMixin } from '@loopback/boot';
import {
  ApplicationConfig,
  BindingKey,
  asGlobalInterceptor,
} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySequence } from './sequence';
import {
  AuthenticationComponent,
  AuthenticationBindings,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import { JWTAuthenticationStrategy } from './authentication-strategies/jwt-strategy';
import {
  TokenServiceBindings,
  TokenServiceConstants,
  PasswordHasherBindings,
  UserServiceBindings,
  CustomerServiceBindings,
  SMSServiceBindings,
  ServiceUserBindings,
} from './keys';
import { JWTService } from './services/jwt-service';
import { BcryptHasher } from './services/hash.password.bcryptjs';
import { MyUserService } from './services/user-service';
import { AuthorizationComponent } from './authorization';
import { UniqueUsernameInterceptor } from './interceptors';
import { SpringComponent } from 'loopback4-spring';
import { CompanyUniqueUsernameInterceptor } from './interceptors/company-unique-username.interceptor';
import { CustomerService } from './services/customer-service';
import { SMSService } from './services/sms.service';
import { ServiceUser } from './models';
import { ServiceUserService } from './services/serviceUser-service';
import { UniqueMobileInterceptor } from './interceptors/unique-mobile.interceptor';

/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');

const pkg: PackageInfo = require('../package.json');

export class FixliftApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.setUpBindings();

    // Bind authentication component related elements
    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);
    this.component(SpringComponent);

    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    // this.bind(RestExplorerBindings.CONFIG).to({
    //   path: '/explorer',
    // });
    // this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    // Bind package.json to the application context
    this.bind(PackageKey).to(pkg);

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // // Bind bcrypt hash services
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

    this.bind('UniqueUsername').toProvider(UniqueUsernameInterceptor);
    this.bind('UniqueMobile').toProvider(UniqueMobileInterceptor);
    this.bind('CompanyUniqueUsername').toProvider(
      CompanyUniqueUsernameInterceptor,
    );

    this.bind(CustomerServiceBindings.CUSTOMER_SERVICE).toClass(CustomerService);
    this.bind(ServiceUserBindings.SERVICE_USER_SERVICE).toClass(ServiceUserService);
    this.bind(SMSServiceBindings.SMS_SERVICE).toClass(SMSService);
  }
}
