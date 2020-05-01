import { Server as MockServer } from 'mock-socket';

export const getMockServer = () => {
  const mockServer = new MockServer('ws://ws.example.com');
  mockServer.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'welcome' }));
    socket.on('message', (data: any) => {
      process(socket, data);
    });
  });
  return mockServer;
};
const process = (socket, data) => {
  const jsonData = JSON.parse(data);
  if (jsonData.command === 'subscribe') {
    socket.send(
      JSON.stringify({
        type: 'confirm_subscription',
        identifier: jsonData.identifier,
      })
    );
  } else if (jsonData.command === 'message') {
    const responseData = JSON.parse(jsonData.data);
    if (responseData.action === 'cmd') {
      if (responseData.path === '/timeout') {
        setTimeout(() => {
          sendMessage(socket, jsonData, responseData);
        }, 4000);
      } else {
        sendMessage(socket, jsonData, responseData);
      }
    }
  }
};
const sendMessage = (socket, jsonData, data) => {
  const dataToSend = JSON.stringify({
    identifier: jsonData.identifier,
    message: {
      request_id: data.request_id,
      body: JSON.stringify({
        message: 'HELLO',
        data: data.data,
        params: data.params,
      }),
      code: 200,
      headers: {},
    },
  });
  socket.send(dataToSend);
};
