<?php
return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Add a login route
  $app->post('/api/login', function ($request, $response) {
    $data = $request->getParsedBody();
    // In a real example, do database checks here
    if (!empty($data['username'] && $data['password'])) {
  

      $statement = $this->db->prepare("SELECT * FROM users WHERE username = :username");
      $statement->execute([
        ":username" => $data['username']
      ]);
      $user = $statement->fetch(PDO::FETCH_ASSOC);
      if ($data['username'] == $user['username']) {
        if (password_verify($data['password'], $user['password'])) {
          $_SESSION['loggedIn'] = true;
          $_SESSION['userID'] = $user['userID'];
          return $response->withJson(($_SESSION['userID']));
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
