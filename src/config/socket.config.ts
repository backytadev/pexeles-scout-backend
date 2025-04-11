import http from 'node:http';

import { Server } from 'socket.io';
import { socketCorsConfig } from './cors.config';
import { validateJWT } from '@/helpers/jwt.helper';
import { getSocketUser } from '@/helpers/get-socket-user';
import { User } from '@/interfaces/user.interface';
import { UserRole } from '@/enums/user-role.enum';

export function setupSocket(
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) {
  const io = new Server(server, {
    cors: socketCorsConfig,
  });

  io.on('connection', async (socket) => {
    const query = Object.fromEntries(Object.entries(socket.handshake.query));

    const [valid, uid] = validateJWT(Object.values(query)[0]);

    console.log('New client connected', uid);

    if (!valid) {
      console.log('Socket no identificado');
      return socket.disconnect();
    }

    const user = await getSocketUser(uid);

    socket.on('user-connected', () => {
      socket.emit(
        'welcome-message',
        `Te has conectado correctamente, bienvenido ${user?.firstNames} ${user?.lastNames}`
      );
    });

    socket.on('super-user-connected', (roles: string[]) => {
      if (roles?.includes(UserRole.SuperUser)) {
        io.emit('super-user-message', 'El super-usuario se conecto!!');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}
