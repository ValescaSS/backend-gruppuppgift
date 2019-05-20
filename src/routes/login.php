<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Add a login route
  $app->post('/api/login', function ($request, $response) {
    // $data = $request->getParsedBody();
    if ($data['username'] && $data['password']) {
      // In a real example, do database checks here
      $_SESSION['loggedIn'] = true;
      $_SESSION['userID'] = $data['userID'];
      $_SESSION['username'] = $data['username'];

      $userID = $_SESSION['userID'];

      

      return $response->withJson($userID);
    } else {
      return $response->withStatus(401);
    }
  });

  // Add a ping route
  $app->get('/api/ping', function ($request, $response, $args) {
    return $response->withJson(['loggedIn' => true]);
  })->add($auth);
};
