import Pusher from 'pusher-js';

// === Referencias DOM ===
const lblOn = document.querySelector('#lblOn') as HTMLElement;
const lblOff = document.querySelector('#lblOff') as HTMLElement;
const txtMensaje = document.querySelector('#txtMensaje') as HTMLInputElement;
const btnEnviar = document.querySelector('#btnEnviar') as HTMLButtonElement;
const ulMessages = document.querySelector('#messages') as HTMLElement;

// === Parámetros del juego ===
const gameId = '123'; // o dinámico desde tu app
const userName3 = 'Jugador3';

(document.querySelector('#lblPlayer') as HTMLElement).textContent = userName3;
(document.querySelector('#lblGame') as HTMLElement).textContent = gameId;

// === Parámetros de conexión ===
const wsHost = '127.0.0.1';
const wsPort = 8080;
const apiPort = 8000;

// === Configuración Pusher / Reverb ===
const pusher = new Pusher('local-app-key', {
  wsHost,
  wsPort,
  forceTLS: false,
  enabledTransports: ['ws'],
  cluster: 'mt1',
  disableStats: true,
  authEndpoint: `http://${wsHost}:${apiPort}/broadcasting/auth`,
  auth: {
    headers: {
      Accept: 'application/json',
    },
  },
});

// === Canal público ===
const channel = pusher.subscribe(`game.${gameId}`);

// ======== Estado Online / Offline ========
function setOnline() {
  lblOn.style.display = '';
  lblOff.style.display = 'none';
}
function setOffline() {
  lblOn.style.display = 'none';
  lblOff.style.display = '';
}

// ======== Eventos de conexión ========
pusher.connection.bind('connected', () => {
  console.info('✅ Conectado correctamente a Reverb');
  setOnline();
});

pusher.connection.bind('error', (err: any) => {
  console.error('⚠️ Error WebSocket:', err);
  setOffline();
});

// ======== Recepción de mensajes ========
channel.bind('message.sent', (data: { message: string; from: string }) => {
  console.log(`[Partida ${gameId}] ${data.from}: ${data.message}`);
  const li = document.createElement('li');
  li.textContent = `[Partida ${gameId}] ${data.from}: ${data.message}`;
  li.classList.add('list-group-item');
  ulMessages.appendChild(li);
});

// ======== Envío de mensaje ========
btnEnviar.addEventListener('click', () => {
  const mensaje = txtMensaje.value.trim();
  if (!mensaje) return;

  const payload = {
    message: mensaje,
    game_id: gameId,
    from: userName3,
  };

  const url = `http://${wsHost}:${apiPort}/api/chat/send-private`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((res) => res.json())
    .then((resp) => {
      console.log('Confirmación del servidor:', resp);
      txtMensaje.value = '';
    })
    .catch((err) => console.error('Error al enviar:', err));
});
