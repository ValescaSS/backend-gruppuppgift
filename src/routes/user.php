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

  // En GET route som hämtar alla användare (tänk på att INTE visa password-fältet)
  $app->get('/users', function ($request, $response) {
    $users = new User($this->db);
    
    return $response->withJson($users-> getAllUsers());
  });
  
  
  // En POST route som registrerar en ny användare
  $app->post('/api/register', function ($request, $response) {
    $data = $request->getParsedBody();
    //validera om användare har redan registrerat eller inte
    if (empty($data['username']) && empty($data['password'])) {
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
      $userCheck = $userInfo->getUser($data['username']);
      if (password_verify($data['password'], $userCheck['password']) && $data['username'] == $userCheck['username']) {
        $alreadyRegistered = "You have already registered";
        return $response->withJson($alreadyRegistered);
      } else {
        $user = new User($this->db);
        return $response->withJson($user->registerNewUser($data['username'], $data['password']));
      }
    }
  });

  
};
