<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameMessageSent implements ShouldBroadcast
{
    use SerializesModels;

    public $message;
    public $gameId;
    public $from;

    public function __construct($message, $gameId, $from)
    {
        $this->message = $message;
        $this->gameId = $gameId;
        $this->from = $from;
    }

    public function broadcastOn()
    {
        //Canal 'privado' dinámico
        return new Channel('game.' . $this->gameId);
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'from' => $this->from,
        ];
    }
}
