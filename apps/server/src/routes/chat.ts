import { FastifyPluginCallback } from 'fastify';
// コントローラを呼び出す例
import { postChat } from '../controllers/chatController';

const chatRoutes: FastifyPluginCallback = (fastify, options, done) => {
  fastify.post('/', postChat);

  done();
};

export default chatRoutes;
