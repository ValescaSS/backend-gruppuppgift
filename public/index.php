<?php
  // Load everything needed
  require __DIR__ . '/../vendor/autoload.php';

  // Start a session here
  session_start();

  // Get settings and instantiate the app
  $settings = require __DIR__ . '/../src/settings.php';
  $app = new \Slim\App($settings);

  // Register our dependencies through our container
  $dependencies = require __DIR__ . '/../src/container.php';
  $dependencies($app);

  // Register routes
  $login = require __DIR__ . '/../src/routes/login.php';
  $login($app);

  $view = require __DIR__ . '/../src/routes/view.php';
  $view($app);

  $user = require __DIR__ . '/../src/routes/user.php';
  $user($app);

  $entries = require __DIR__ . '/../src/routes/entries.php';
  $entries($app);

  $kommentar = require __DIR__ . '/../src/routes/kommentar.php';
  $kommentar($app);

  $logout = require __DIR__ . '/../src/routes/logout.php';
  $logout($app);

  $comments = require __DIR__ . '/../src/routes/comments.php';
  $comments($app);

  $likes = require __DIR__ . '/../src/routes/likes.php';
  $likes($app);

  // Run app
  $app->run();
