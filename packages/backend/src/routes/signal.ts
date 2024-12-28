import { FastifyPluginCallback } from 'fastify';
import { signalingHandler } from '../controllers/signalController';

const signalRoutes: FastifyPluginCallback = (fastify, options, done) => {
  fastify.post('/', signalingHandler);

  done();
};

export default signalRoutes;
