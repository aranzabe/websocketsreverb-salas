<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            $auth = Auth::user();
            // return $auth;
            //$tokenResult = $auth->createToken('LaravelSanctumAuth');
            $tokenResult = $auth->createToken('LaravelSanctumAuth', ['read', 'delete','mindundi']);

            // Actualizar expiración
            // $hours = (int) env('SANCTUM_EXPIRATION_HOURS', 2);
            // $tokenResult->accessToken->expires_at = now()->addHours($hours);
            // $tokenResult->accessToken->save();

            $success = [
                'id'         => $auth->id,
                'name'       => $auth->name,
                'token'      => $tokenResult->plainTextToken,
                'expires_at' => $tokenResult->accessToken->expires_at == null ? null :  $tokenResult->accessToken->expires_at->toDateTimeString()
            ];

            return response()->json(["success"=>true,"data"=>$success, "message" => "User logged-in!"]);
        }
        else{
            return response()->json("Unauthorised",204);
        }
    }

    public function register(Request $request)
    {
	    $us = User::where('email',$request->email)->first();
        if(!empty($us->email)) {
            return response()->json(["success"=>false, "message" => "Already registered user"]);
        }
        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $user = User::create($input);

        $tokenResult = $user->createToken('LaravelSanctumAuth');

        // Actualizar expiración
        // $hours = (int) env('SANCTUM_EXPIRATION_HOURS', 2);
        // $tokenResult->accessToken->expires_at = now()->addHours($hours);
        // $tokenResult->accessToken->save();

        $success = [
            'id' => $user->id,
            'name' => $user->name,
            'token' => $tokenResult->plainTextToken,
            'expires_at' => $tokenResult->accessToken->expires_at ==null ? null:  $tokenResult->accessToken->expires_at->toDateTimeString()
        ];


        return response()->json(["success"=>true,"data"=>$success, "message" => "User successfully registered!"]);
    }

     /**
     * Por defecto los tokens de Sanctum no expiran. Se puede modificar esto añadiendo una cantidad en minutos a la variable 'expiration' en el archivo de config/sanctum.php.
     */
     public function logout(Request $request)
    {
        if(Auth::attempt(['email' => $request->email, 'password' => $request->password])){
            $cantidad = Auth::user()->tokens()->delete();
            return response()->json(["success"=>true, "message" => "Tokens Revoked: ".$cantidad],200);
        }
        else {
            return response()->json("Unauthorised",204);
        }

    }
}
