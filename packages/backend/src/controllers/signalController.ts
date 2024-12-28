import { FastifyRequest, FastifyReply } from 'fastify';

export async function signalingHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const signalData: any = req.body || {};
  // WebRTCのoffer/answer/ICEをクライアント間でやりとりする場合は、
  // ここで他のクライアントへ転送するなど
  reply.send({ status: 'ok', signalData });
}
