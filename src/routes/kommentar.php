<?php
/* session_start(); */

return function ($app) {
  
  $auth = require __DIR__ . '/../middlewares/auth.php';



// Get one comment with id
 $app->get('/api/comment/{id}', function ($request, $response, $args) {
    $commentID = $args['id'];
    $comment = new Kommentar($this->db);
    return $response->withJson($comment->getCommentByID($commentID));
  })->add($auth);

  
// Get all comments with 
  $app->get('/api/comments', function($request, $response ) {
    $entries = new Kommentar($this->db);

    return $response->withJson($entries-> getAllComments());
  })->add($auth);



// Add new comment
$app->post('/api/newcomment/{id}/{entryID}', function($request, $response, $args){
    $userID = $args['id'];
    $entryID =  $args['entryID'];
    $data = $request->getParsedBody();
    $newComment = new Kommentar($this->db);

    return $response->withJson($newComment-> AddNewComment( $userID , $entryID, $data['content']));     
  });



// Update comment
$app->put('/api/updatecomment/{id}', function($request, $response, $args){
    $userID = $_SESSION['userID'];
    $data = $request->getParsedBody();
    $updateComment = new Kommentar($this->db);

    return $response->withJson($updateComment-> updateCommentById($userID, $data['content']));     
  })->add($auth);



// Delete comment
$app->delete('/api/deletecomment/{id}', function($request, $response, $args){
    $commentID = $args['id'];
    $comment = new Kommentar($this->db);

    return $response->withJson($comment-> deleteCommentById($commentID));
  })->add($auth);



};