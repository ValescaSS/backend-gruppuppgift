<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Basic protected GET route 
  $app->get('/user/{id}', function ($request, $response, $args) {
    $userID = $args['id'];
    $user = new User($this->db);

    return $response->withJson($user->getUserByID($userID));
  })->add($auth);

  // 1get Skapa en GET route som hämtar alla användare (tänk på att INTE visa password-fältet)
  $app->get('/users', function($request, $response){
    $users = new User($this->db);

    return $response->withJson($users-> getAllUsers());
  })->add($auth);

  // 2get Skapa en GET route som hämtar en enskild användare (tänk på att INTE visa password-fältet )
  $app->get('/usernotpass/{id}', function ($request, $response, $args) {
    $userID = $args['id'];
    $user = new User($this->db);

    return $response->withJson($user->getUserByIdNotShowPassword($userID));
  })->add($auth);

  // 1post Skapa en POST route som registrerar en ny användare
  $app->post('/api/register', function($request, $response){
    $data = $request->getParsedBody();
    $user = new User($this->db);

    return $response->withJson($user->registerNewUser($data['username'], $data['password']));
  });

  // 4get Skapa en GET route som loggar ut den inloggade användaren.

  // 5put Skapa en PUT route som ändrar på en användares användarnamn.
  $app->put('/api/change_username/{id}', function($request, $response, $args){
    $userID = $args['id'];
    $data = $request->getParsedBody();
    $user = new User($this->db);

    return $response->withJson($user->changeUsername($userID, $data['new_username']));
  });
};
