<?php

use Illuminate\Support\Facades\Broadcast;



Broadcast::channel('game.{gameId}', function ($user = null, $gameId) {
    // Validar si el usuario pertenece a esa partida
    //return $user->games->contains('id', (int) $gameId);
    // Esto supone que tienes una relación User -> games(), pero si no, puedes poner algo simple para test:
    return true; // permitir a todos temporalmente
});




