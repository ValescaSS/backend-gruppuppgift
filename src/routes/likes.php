<?php
/* session_start(); */

return function ($app) {
  
  $auth = require __DIR__ . '/../middlewares/auth.php';


  $app->get('/api/like/{id}', function($request, $response ,$args) {
    $entryID =  $args['id'];
    $likes = new Likes($this->db);

    return $response->withJson($likes-> getAllLikesoneEntry($entryID));
  })->add($auth);


  $app->post('/api/like/{id}', function($request, $response, $args){
    $userID =  $_SESSION['userID'] ;
    $entryID =  $args['id'];
    $newLike = new Likes($this->db);

    return $response->withJson($newLike-> AddLike( $userID,  $entryID));     
  })->add($auth);



};