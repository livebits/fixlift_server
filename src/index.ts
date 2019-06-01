import {FixliftApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {FixliftApplication};

export async function main(options: ApplicationConfig = {}) {
  const app = new FixliftApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}
