// === Referencias DOM ===
const lblOn      = document.querySelector('#lblOn');
const lblOff     = document.querySelector('#lblOff');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar  = document.querySelector('#btnEnviar');
const ulMessages = document.querySelector('#messages');

// === Parámetros del juego ===
const gameId = '123'; // o dinámico desde tu app


//Ejemplo para probar:
// const token2 = '2|h59RQp5wOWOg3FcNrxKIpCN8WwFm41nGcFg84V6T090dd508';
const userName2 = 'Jugador2';

document.querySelector('#lblPlayer').textContent = userName2; // o userName2 según el cliente
document.querySelector('#lblGame').textContent = gameId;

// === Parámetros de conexión ===
const wsHost = '127.0.0.1';
const wsPort = '8080';
const apiPort = '8000';

// Configuración Pusher para Reverb
const pusher = new Pusher('local-app-key', {
    wsHost: wsHost,
    wsPort: wsPort,
    forceTLS: false,
    enabledTransports: ['ws'],
    cluster: 'mt1',
    disableStats: true,  // Evita llamadas externas
    enabled: true,
    // Evitamos reconexión automática infinita
    //reconnectAttempts: 0,
    //reconnectDelay: 0,
    authEndpoint: `http://${wsHost}:${apiPort}/broadcasting/auth`, // importante
    auth: {
        headers: {
        'Accept': 'application/json'
        }
    }
});


// Canal privado de la partida
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

// ======== Eventos globales de conexión ========
pusher.connection.bind('connected', () => {
    //console.log('Conectado a Reverb');
    console.info('✅ Conectado correctamente a Reverb');
    setOnline();
});


pusher.connection.bind('error', (err) => {
    if (err.data.code === 1006) {
        console.warn('⚠️ Conexión perdida con Reverb');
    } else {
        console.error('⚠️ Error WebSocket:', err);
    }
    setOffline();
});

// ======== Recepción de mensajes en tiempo real ========
channel.bind('message.sent', (data) => {
    //console.log('Mensaje recibido desde servidor:', data.message);
    console.log(`[Partida ${gameId}] ${data.from}: ${data.message}`);
    const li = document.createElement('li');
    li.textContent = `[Partida ${gameId}] ${data.from}: ${data.message}`;
    li.classList.add('list-group-item');
    ulMessages.appendChild(li);
});

// ======== Enviar mensaje al backend ========
btnEnviar.addEventListener('click', () => {
    const mensaje = txtMensaje.value.trim();
    if (!mensaje) return;

    const payload = {
        message: mensaje,
        game_id: gameId,
        from: userName2,
    };

    // Usamos wsHost para construir la URL dinámicamente
    const url = `http://${wsHost}:${apiPort}/api/chat/send-private`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(resp => {
        console.log('Confirmación del servidor:', resp);
        txtMensaje.value = '';
    })
    .catch(err => console.error('Error al enviar:', err));
});






