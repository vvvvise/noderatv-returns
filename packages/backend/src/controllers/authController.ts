// authController.ts
import { FastifyRequest, FastifyReply } from 'fastify';

export async function twitterAuth(req: FastifyRequest, reply: FastifyReply) {
  // Twitter認証フロー開始 (実際はPassportを利用)
  reply.send({ message: 'Redirecting to Twitter OAuth...' });
}

export async function twitterCallback(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  // コールバック処理 (実際はPassportでtoken取得)
  reply.send({ message: 'Twitter Callback Success!' });
}
