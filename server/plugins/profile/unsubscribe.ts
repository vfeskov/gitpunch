import { Observable as $ } from 'rxjs/Observable';
import { badImplementation, badData } from 'boom';
import { saveWatching } from '../../db';
import * as JWT from 'jsonwebtoken';
const LAMBDA_JWT_RSA_PUBLIC_KEY = process.env.WAB_LAMBDA_JWT_RSA_PUBLIC_KEY.replace(/\\n/g, '\n');

export function unsubscribeRouteHandler({payload}, reply) {
  const {lambdajwt} = payload;
  JWT.verify(
    lambdajwt,
    LAMBDA_JWT_RSA_PUBLIC_KEY,
    (error, data) => {
      if (error) { return reply(badData('Invalid lambdajwt')); }
      saveWatching(data.email, false)
        .mapTo('')
        .catch(error => {
          console.error(error);
          return $.of(badImplementation())
        })
        .subscribe(reply);
    }
  );
}
