import { FastifyReply, FastifyRequest } from 'fastify';

export async function signalingHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const signalData: unknown = req.body || {};
  // WebRTCのoffer/answer/ICEをクライアント間でやりとりする場合は、
  // ここで他のクライアントへ転送するなど
  reply.send({ status: 'ok', signalData });
}
