<?php
/* session_start(); */

return function ($app) {
  
  $auth = require __DIR__ . '/../middlewares/auth.php';




$app->get('/api/search', function($request, $response, $args){
    $search = $args['search'];
    $searchs = new Search($this->db);

    return $response->withJson($searchs-> getSerach($search));
  })->add($auth);



  
};