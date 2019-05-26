<?php
/* session_start(); */

return function ($app) {
  
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // 3get Skapa en GET route som hämtar alla inlägg
  $app->get('/entries', function($request, $response ) {
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getAllEntries());
  });

  // 4get Skapa en GET route som hämtar de X senaste inläggen
  $app->get('/entries/last/{num}', function($request, $response, $args){
    $num = (int)$args['num'];
    $entries = new Entry($this->db);

    return $response->withJson($entries->getLastXEntries($num));
  });

  // 5get Skapa en GET route som hämtar de X första inläggen
  $app->get('/entries/first/{num}', function($request, $response, $args){
    $num = (int)$args['num'];
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getFirstXEntries($num));
  });

  // 6get Skapa en GET route som hämtar alla inlägg som är skrivna av en specifik användare
  $app->get('/api/entries', function($request, $response, $args){
    $userID = $_SESSION['userID'];
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getEntriesUserId($userID));
  })->add($auth);

  // 7get Skapa en GET route som hämtar de X senaste inläggen som är skrivna av en specifik användare
  $app->get('/entries/useridlastx/{id}', function($request, $response, $args){
    $args['id'] = $_SESSION['userID'];
    $queryString = $request->getQueryParams();
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getEntriesUserIdLastX($args['id'], $queryString));
  })->add($auth);

  // 8get Skapa en GET route som hämtar de X första inläggen som är skrivna av en specifik användare
  $app->get('/entries/useridfirstx/{id}', function($request, $response, $args){
    $args['id'] = $_SESSION['userID'];
    $queryString = $request->getQueryParams();
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getEntriesUserIdFirstX($args['id'], $queryString));
  })->add($auth);

  //2post Skapa en POST route som sparar ett nytt inlägg för en viss användare.
  $app->post('/api/entry', function($request, $response, $args){
    $userID = $_SESSION['userID'];
    $data = $request->getParsedBody();
    $newEntry = new Entry($this->db);
    
    return $response->withJson($newEntry-> postNewEntryUserId($userID, $data['title'], $data['content']));     
  })->add($auth);
  
  // 3post Skapa en DELETE route som raderar ett inlägg.
  $app->delete('/api/entry/{id}', function($request, $response, $args){
    $entryID = $args['id'];
    $entry = new Entry($this->db);
    
    return $response->withJson($entry-> deleteEntryById($entryID));
  })->add($auth);
  
  // Put Ändra entrys innehållet
  $app->put('/api/entry/{id}', function($request, $response, $args){
    $entryID = $args['id'];
    $data = $request->getParsedBody();
    $entry = new Entry($this->db);
    
    return $response->withJson($entry->editEntry($entryID,$data['title'], $data['content']));
  })->add($auth);
  
  // Get Hämta specifik title och content för en viss användare
  $app->get('/api/entry/{id}', function($request, $response, $args){
    $entryID = $args['id'];
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getOneEntry($entryID));
  })->add($auth);

};