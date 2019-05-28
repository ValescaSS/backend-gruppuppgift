<?php

return function ($app) {
    // Register auth middleware
    $auth = require __DIR__ . '/../middlewares/auth.php';
    // Add a login route
    $app->post('/api/login', function ($request, $response) {
        $data = $request->getParsedBody();

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
        if (isset($data['username']) && isset($data['password'])) {
          $userObj = new User($this->db);
          $user = $userObj->getUser($data['username']);
          if ($data['username'] === $user['username']) {
            if (password_verify($data['password'], $user['password'])) {
              $_SESSION['loggedIn'] = true;
              $_SESSION['userID'] = $user['userID'];
              return $response->withJson($data);
            }else{
              $wrongPassword = 'Wrong password';
              return $response->withJson($wrongPassword);
              
            }
          } else {
            $noUserRegistered = 'We can not find your name';
            return $response->withJson($noUserRegistered);
          }
        }

    });

    // Add a ping route
    $app->get('/api/ping', function ($request, $response, $args) {
        return $response->withJson(['loggedIn' => true]);
    })->add($auth);

};
