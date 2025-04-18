import net from 'net';

const host = '127.0.0.1'; // Replace with your host
const port = 3002;       // Replace with your port

export const awakeNetCS = () => {

  const client = new net.Socket();

  client.connect(port, host, () => {
    console.log(`Connected to ${host}:${port}`);
    client.write('Start Game Message'); // Send your message
  });

  client.on('data', (data) => {
    console.log(`Received: ${data}`);
    client.destroy(); // Close the connection after receiving a response
  });

  client.on('close', () => {
    console.log('Connection closed');
  });

  client.on('error', (err) => {
    console.error(`Error: ${err.message}`);
  });
};