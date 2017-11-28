import { Server } from 'hapi';
import { unsubscribeRouteHandler } from './unsubscribe';
import { watchingRouteHandler } from './watching';
import { profileRouteHandler } from './profile';
import { reposReplaceRouteHandler, reposCreateRouteHandler, reposDeleteRouteHandler } from './repos';

export function register(server: Server, options, callback) {
  server.route([{
    method: 'GET',
    path: '/api/profile',
    handler: profileRouteHandler
  }, {
    method: 'PUT',
    path: '/api/repos',
    handler: reposReplaceRouteHandler
  }, {
    method: 'POST',
    path: '/api/repos',
    handler: reposCreateRouteHandler
  }, {
    method: 'DELETE',
    path: '/api/repos/{repo}',
    handler: reposDeleteRouteHandler
  }, {
    method: 'PUT',
    path: '/api/watching',
    handler: watchingRouteHandler
  }, {
    method: 'PUT',
    path: '/api/unsubscribe',
    config: { auth: false },
    handler: unsubscribeRouteHandler
  }]);
  callback();
}

(register as any).attributes = {
  name: 'profile',
  version: '1.0.0'
};
