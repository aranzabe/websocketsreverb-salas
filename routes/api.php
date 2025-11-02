<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Route;


Route::post('/chat/send-private', [ChatController::class, 'sendPrivate']);


Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('register', [AuthController::class, 'register']);

Route::get('/nologin', function () {
    return response()->json(["success"=>false, "message" => "Unauthorised"],203);
});

Broadcast::routes(['middleware' => ['auth:sanctum']]); //En el cliente, al conectar, Pusher automáticamente llamará a /broadcasting/auth.
//Broadcast::routes(['middleware' => []]); // sin auth
