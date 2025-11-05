import Pusher from 'pusher-js';

// === Referencias DOM ===
const lblOn = document.querySelector('#lblOn') as HTMLElement;
const lblOff = document.querySelector('#lblOff') as HTMLElement;
const txtMensaje = document.querySelector('#txtMensaje') as HTMLInputElement;
const btnEnviar = document.querySelector('#btnEnviar') as HTMLButtonElement;
const ulMessages = document.querySelector('#messages') as HTMLElement;
const userNameEl = document.querySelector('#userName') as HTMLElement;
const gameNameEl = document.querySelector('#gameName') as HTMLElement;

// === Parámetros ===
const gameId = '123';
const userName = 'Jugador3';
userNameEl.textContent = userName;
gameNameEl.textContent = `Partida #${gameId}`;

const wsHost = '127.0.0.1';
const apiPort = '8000';

// === Configuración Pusher / Reverb ===
const pusher = new Pusher('local-app-key', {
  wsHost,
  wsPort: 8080,
  forceTLS: false,
  enabledTransports: ['ws'],
  cluster: 'mt1',
  disableStats: true,
  authEndpoint: `http://${wsHost}:${apiPort}/broadcasting/auth`,
  auth: { headers: { Accept: 'application/json' } },
});

// Canal público
const channel = pusher.subscribe(`game.${gameId}`);

function setOnline() {
  lblOn.style.display = '';
  lblOff.style.display = 'none';
}
function setOffline() {
  lblOn.style.display = 'none';
  lblOff.style.display = '';
}

// Eventos
pusher.connection.bind('connected', () => {
  console.info('✅ Conectado correctamente a Reverb');
  setOnline();
});
pusher.connection.bind('error', () => {
  console.error('⚠️ Error WebSocket');
  setOffline();
});

channel.bind('message.sent', (data: { message: string; from: string }) => {
  const li = document.createElement('li');
  li.textContent = `[Partida ${gameId}] ${data.from}: ${data.message}`;
  li.classList.add('list-group-item');
  ulMessages.appendChild(li);
});

btnEnviar.addEventListener('click', () => {
  const mensaje = txtMensaje.value.trim();
  if (!mensaje) return;

  fetch(`http://${wsHost}:${apiPort}/api/chat/send-private`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ message: mensaje, game_id: gameId, from: userName }),
  })
    .then((res) => res.json())
    .then((resp) => {
      console.log('Confirmación del servidor:', resp);
      txtMensaje.value = '';
    })
    .catch((err) => console.error('Error al enviar:', err));
});
