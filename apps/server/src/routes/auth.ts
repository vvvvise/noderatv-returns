import { FastifyPluginCallback } from 'fastify';
// コントローラを呼び出す例
import { twitterAuth, twitterCallback } from '../controllers/authController';

const authRoutes: FastifyPluginCallback = (fastify, options, done) => {
  fastify.get('/twitter', twitterAuth);
  fastify.get('/twitter/callback', twitterCallback);

  done();
};

export default authRoutes;
