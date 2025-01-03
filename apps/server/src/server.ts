import Fastify from 'fastify';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import signalRoutes from './routes/signal';

async function startServer() {
  const fastify = Fastify({ logger: true });

  // ルーティング設定
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(chatRoutes, { prefix: '/chat' });
  fastify.register(signalRoutes, { prefix: '/signal' });

  // socket.ioとの連携（Fastifyをhttp.createServerで包む）
  const httpServer = createServer(fastify.server);
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket: Socket) => {
    console.log('a user connected:', socket.id);

    socket.on('chatMessage', (msg: string) => {
      // 全員にブロードキャスト
      io.emit('chatMessage', msg);
    });

    // 受け取ったofferを別のユーザーへ送る
    socket.on('offer', (offer) => {
      // NOTE: socket.broadcast.emit('offer', offer); // 全員に送る例
      // 任意のルームIDなどを用いて特定ユーザーに送るのが望ましい
      socket.to('someRoom').emit('offer', offer);
    });

    socket.on('answer', (answer) => {
      socket.to('someRoom').emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
      socket.to('someRoom').emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id);
    });
  });

  try {
    await fastify.ready();
    httpServer.listen(3000, '0.0.0.0', () => {
      console.log('Server + Socket.io listening on http://localhost:3000');
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

startServer();
