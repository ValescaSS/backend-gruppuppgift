<?php
return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';



  // Basic protected GET route 
  $app->get('/api/user/{id}', function ($request, $response, $args) {
    $args['id'] = $_SESSION['userID'];
    $user = new User($this->db);

    return $response->withJson($user->getUserByID($args['id']));
  })->add($auth);

  // 1get Skapa en GET route som hämtar alla användare (tänk på att INTE visa password-fältet)
  $app->get('/users', function ($request, $response) {
    $users = new User($this->db);

    return $response->withJson($users->getAllUsers());
  })->add($auth);

  // 2get Skapa en GET route som hämtar en enskild användare (tänk på att INTE visa password-fältet )
  $app->get('/usernotpass/{id}', function ($request, $response, $args) {
    $args['id'] = $_SESSION['userID'];
    $user = new User($this->db);

    return $response->withJson($user->getUserByIdNotShowPassword($args['id']));
  })->add($auth);

  // 1post Skapa en POST route som registrerar en ny användare
  $app->post('/api/register', function ($request, $response) {
    $data = $request->getParsedBody();
    //validera om användare har redan registrerat eller inte
    if (empty($data['username'] && $data['password'])) {
      $emptyNameAndPassword = 'Write your password and your name';
      return $response->withJson($emptyNameAndPassword);
    }
    if (empty($data['username'])) {
      $nameErr = "Write your name";
      return $response->withJson($nameErr);
    }
    if (empty($data['password'])) {
      $passErr = "Write your password";
      return $response->withJson($passErr);
    }

    if (!empty($data['username'] && $data['password'])) {
      $userInfo = new User($this->db);
      $user = $userInfo->getUser($data['username']);
      if (password_verify($data['password'], $user['password']) && $data['username'] == $user['username']){
        $alreadyRegistered = "You have already registered.";
        return $response->withJson($alreadyRegistered);
     }
    } else {
      $user = new User($this->db);
      return $response->withJson($user->registerNewUser($data['username'], $data['password']));
    }
  });

  // 4get Skapa en GET route som loggar ut den inloggade användaren.

  // 5put Skapa en PUT route som ändrar på en användares användarnamn.
  $app->put('/api/change_username/{id}', function ($request, $response, $args) {
    $args['id'] = $_SESSION['userID'];
    $data = $request->getParsedBody();
    $user = new User($this->db);

    return $response->withJson($user->changeUsername($args['id'], $data['new_username']));
  });
};
