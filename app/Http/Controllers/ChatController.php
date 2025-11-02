<?php

namespace App\Http\Controllers;

use App\Events\GameMessageSent;
use App\Events\PrivateMessageSent;
use Illuminate\Http\Request;

class ChatController extends Controller
{
   

    // public function sendPrivate(Request $request)
    // {
    //     $msg  = $request->input('message');
    //     $to   = $request->input('to');
    //     $from = $request->input('from') ?? 'anon';

    //     event(new PrivateMessageSent([
    //         'text' => $msg,
    //         'to' => $to,
    //         'from' => $from,
    //     ]));

    //     return response()->json(['status'=>'ok']);
    // }

    public function sendPrivate(Request $request)
    {
        $msg  = $request->input('message');
        $gameId = $request->input('game_id');
        $from = $request->input('from') ?? 'anon';

        event(new GameMessageSent($msg, $gameId, $from));

        return response()->json(['status'=>'ok']);
    }

}
