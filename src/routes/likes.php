<?php
/* session_start(); */

return function ($app) {
  
  $auth = require __DIR__ . '/../middlewares/auth.php';


  $app->get('/api/likes/{id}', function($request, $response ,$args) {
    $entryID =  $args['id'];
    $entries = new Likes($this->db);

    return $response->withJson($entries-> getAllLikesoneEntry($entryID));
  })->add($auth);



};