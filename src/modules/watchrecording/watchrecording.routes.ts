/* eslint-disable no-loop-func */
import { Router } from 'express';

const watchRecordingRouter = Router();

interface IConnectedUsersProps {
  pin: string;
  id_user: string;
  user_name: string;
  created_at: Date;
}

let connectedUsers: IConnectedUsersProps[] = [];

watchRecordingRouter.get('/requestPin', (request, response) => {
  let objIndex = 0;
  let pin = 0;
  while (objIndex > -1) {
    pin = Math.floor(10000 + Math.random() * 90000);
    objIndex = connectedUsers.findIndex(item => item.pin === String(pin));
  }
  connectedUsers.push({
    pin: String(pin),
    id_user: '',
    user_name: '',
    created_at: new Date(),
  });
  response.json({ pin });
  // console.log(connectedUsers);
});

watchRecordingRouter.post('/createPin', (request, response) => {
  const { pin } = request.query;
  connectedUsers.push({
    pin: String(pin),
    id_user: '',
    user_name: '',
    created_at: new Date(),
  });
  console.log(connectedUsers);
  response.send('PIN criado!');
});

watchRecordingRouter.post('/connectUser', (request, response) => {
  const { pin, id_user, user_name } = request.query;
  const objIndex = connectedUsers.findIndex(item => item.pin === String(pin));

  if (objIndex > -1) {
    connectedUsers[objIndex].id_user = String(id_user);
    connectedUsers[objIndex].user_name = String(user_name);
    response.json('Usuário conectado!');
    request.io.emit(String(pin), { user_name });
  } else {
    response.status(401).json('PIN não encontrado');
  }

  console.log(connectedUsers);
});

watchRecordingRouter.put('/takePhoto', (request, response) => {
  console.log(request.connectedUsers);
  const { pin } = request.query;
  const objIndex = connectedUsers.findIndex(item => item.pin === String(pin));

  if (objIndex > -1) {
    const ownerSocket =
      request.connectedUsers[connectedUsers[objIndex].id_user];

    if (ownerSocket) {
      request.io.to(ownerSocket).emit('take_photo');
      response.send('Mensagem enviada');
      console.log('enviou a mensagem');
    }
  } else {
    response.send('PIN não encontrado');
  }
  console.log(connectedUsers);
});

watchRecordingRouter.put('/startRecording', (request, response) => {
  console.log(request.connectedUsers);
  const { pin } = request.query;
  const objIndex = connectedUsers.findIndex(item => item.pin === String(pin));

  if (objIndex > -1) {
    const ownerSocket =
      request.connectedUsers[connectedUsers[objIndex].id_user];

    if (ownerSocket) {
      request.io.to(ownerSocket).emit('start_recording');
      response.send('Mensagem enviada');
      console.log('enviou a mensagem');
    }
  } else {
    response.send('PIN não encontrado');
  }
  console.log(connectedUsers);
});

watchRecordingRouter.put('/stopRecording', (request, response) => {
  console.log(request.connectedUsers);
  const { pin } = request.query;
  const objIndex = connectedUsers.findIndex(item => item.pin === String(pin));

  if (objIndex > -1) {
    const ownerSocket =
      request.connectedUsers[connectedUsers[objIndex].id_user];

    if (ownerSocket) {
      request.io.to(ownerSocket).emit('stop_recording');
      response.send('Mensagem enviada');
      console.log('enviou a mensagem');
    }
  } else {
    response.send('PIN não encontrado');
  }
  console.log(connectedUsers);
});

watchRecordingRouter.put('/disconnectUser', (request, response) => {
  console.log(request.connectedUsers);
  const { pin } = request.query;
  const objIndex = connectedUsers.findIndex(item => item.pin === String(pin));
  const ownerSocket = request.connectedUsers[connectedUsers[objIndex].id_user];
  console.log(ownerSocket);
  if (ownerSocket) {
    request.io.to(ownerSocket).emit('disconnect');
    response.send('Mensagem enviada');
    console.log('enviou a mensagem');
  }

  connectedUsers = connectedUsers.filter(item => item.pin !== String(pin));
  response.send('Disconectado');
  console.log(connectedUsers);
});

export default watchRecordingRouter;
