import { Observable as $ } from 'rxjs/Observable';
import { badImplementation } from 'boom';
import { loadProfile } from '../../db';

export function profileRouteHandler(request, reply) {
  const {email} = request.auth.credentials;
  loadProfile(email)
    .catch(error => {
      console.error(error);
      return $.of(badImplementation());
    })
    .subscribe(reply);
}
