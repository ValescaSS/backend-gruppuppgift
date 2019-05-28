<?php

return function ($app) {
  // Add a basic template route
  $app->get('/', function ($request, $response, $args) {
    // Render index view
    return $this->renderer->render($response, 'index.phtml', [
      'title' => 'TMVT Journal'
    ]);
  });

  $app->get('/name', function ($request, $response, $args) {
    // Render index view
    $userID = $_SESSION['userID'];
    $userObj = new User($this->db);
    $user = $userObj->getUserByID($userID);
    var_dump($user['username']);
    return $this->renderer->render($response, 'index.phtml', [
      'welcome' => $user['username']
    ]);
  });
};
