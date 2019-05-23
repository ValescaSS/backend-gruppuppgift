<?php
return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Add a login route
  $app->post('/api/login', function ($request, $response) {
    $data = $request->getParsedBody();
    // In a real example, do database checks here
    $userObj = new User($this->db);
    $user = $userObj->getUser($data['username']);

    if ($data['username'] && $data['password']) {

      if ($data['username'] == $user['username']) {
        if (password_verify($data['password'], $user['password'])) {
          $_SESSION['loggedIn'] = true;
          $_SESSION['userID'] = $user['userID'];
          return $response->withJson($data);
        }
      } else {
        return $response->withStatus(401);
      }
    } else {
      return $response->withStatus(401);
    }
  });


  // Add a ping route
  $app->get('/api/ping', function ($request, $response, $args) {
    return $response->withJson(['loggedIn' => true]);
  })->add($auth);
};
