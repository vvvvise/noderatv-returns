import { FastifyRequest, FastifyReply } from 'fastify';

export async function postChat(req: FastifyRequest, reply: FastifyReply) {
  const body: any = req.body || {};
  // ここでDBに書き込む or socket.ioにブロードキャストする などの処理
  reply.send({ status: 'ok', received: body });
}
