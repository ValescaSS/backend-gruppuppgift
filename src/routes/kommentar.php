<?php
session_start();

return function ($app) {
  
  $auth = require __DIR__ . '/../middlewares/auth.php';



// Get one comment with id
 $app->get('/api/comment/{id}', function ($request, $response, $args) {
    $commentID = $args['id'];
    $comment = new Comment($this->db);
    return $response->withJson($comment->getCommentByID($commentID));
  })->add($auth);

  
// Get all comments with 
  $app->get('/api/comments', function($request, $response ) {
    $entries = new Entry($this->db);

    return $response->withJson($entries-> getAllComments());
  })->add($auth);



// Add new comment
$app->post('/api/newcomment/user', function($request, $response, $args){
    $userID = $_SESSION['userID'];
    $data = $request->getParsedBody();
    $newComment = new Entry($this->db);

    return $response->withJson($newComment-> AddNewComment($userID, $data['entryID'], $data['content']));     
  })->add($auth);



// Update comment
$app->put('/api/updatecomment/{id}', function($request, $response, $args){
    $userID = $_SESSION['userID'];
    $data = $request->getParsedBody();
    $updateComment = new Entry($this->db);

    return $response->withJson($updateComment-> updateCommentById($userID, $data['content']));     
  })->add($auth);



// Delete comment
$app->delete('/api/comment/deletecomment/{id}', function($request, $response, $args){
    $commentID = $args['id'];
    $comment = new Entry($this->db);

    return $response->withJson($comment-> deleteCommentById($commentID));
  })->add($auth);



};