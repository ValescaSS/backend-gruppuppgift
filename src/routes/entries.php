<?php
/* session_start(); */

return function ($app) {
  
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // 3get Skapa en GET route som hämtar alla inlägg
  $app->get('/entries', function($request, $response ) {
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getAllEntries());
  })->add($auth);

  // 4get Skapa en GET route som hämtar de X senaste inläggen
  $app->get('/entries/last/{num}', function($request, $response, $args){
    $num = (int)$args['num'];
    $entries = new Entry($this->db);

    return $response->withJson($entries->getLastXEntries($num));
  })->add($auth);

  // 5get Skapa en GET route som hämtar de X första inläggen
  $app->get('/entries/first/{num}', function($request, $response, $args){
    $num = (int)$args['num'];
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getFirstXEntries($num));
  })->add($auth);

  // 6get Skapa en GET route som hämtar alla inlägg som är skrivna av en specifik användare
  $app->get('/entries/userid/{id}', function($request, $response, $args){
    $userID = $args['id'];
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getEntriesUserId($userID));
  })->add($auth);

  // 7get Skapa en GET route som hämtar de X senaste inläggen som är skrivna av en specifik användare
  $app->get('/entries/useridlastx/{id}', function($request, $response, $args){
    $userID = $args['id'];
    $queryString = $request->getQueryParams();
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getEntriesUserIdLastX($userID, $queryString));
  })->add($auth);

  // 8get Skapa en GET route som hämtar de X första inläggen som är skrivna av en specifik användare
  $app->get('/entries/useridfirstx/{id}', function($request, $response, $args){
    $userID = $args['id'];
    $queryString = $request->getQueryParams();
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getEntriesUserIdFirstX($userID, $queryString));
  })->add($auth);

  //2post Skapa en POST route som sparar ett nytt inlägg för en viss användare.
  $app->post('/api/newentry/{id}', function($request, $response, $args){
    $userID = $args['id'];
    $data = $request->getParsedBody();
    $newEntry = new Entry($this->db);

    return $response->withJson($newEntry-> postNewEntryUserId($userID, $data['title'], $data['content']));     
  });

  // 3post Skapa en DELETE route som raderar ett inlägg.
  $app->delete('/entries/deleteentry/{id}', function($request, $response, $args){
    $entryID = $args['id'];
    $entry = new Entry($this->db);

    return $response->withJson($entry-> deleteEntryById($entryID));
  })->add($auth);

};