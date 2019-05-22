<?php

return [
  'settings' => [
    'displayErrorDetails' => true, // set to false in production
    'addContentLengthHeader' => false, // Allow the web server to send the content-length header

    // Renderer settings
    'renderer' => [
      'template_path' => __DIR__ . '/views/',
    ],

    // Database settings
    'db' => [
      'host' => 'localhost:3306',
      'user' => 'root',
      'pass' => '',
      'dbname' => 'grupp-journal'
    ]
  ],
];
