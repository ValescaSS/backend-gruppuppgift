<?php

return function ($app) {
    // Register auth middleware
    $auth = require __DIR__ . '/../middlewares/auth.php';

    $app->get('/api/logout', function ($request, $response, $args) {
        session_destroy();
        return $response->withJson(['loggedIn' => false]);
      });
};