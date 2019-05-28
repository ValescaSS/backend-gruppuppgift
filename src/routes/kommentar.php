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
  $app->get('/api/comments', function ($request, $response) {
    $entries = new Kommentar($this->db);

    return $response->withJson($entries->getAllComments());
  })->add($auth);


  // Get all comments form one entry 
  $app->get('/api/comments/{id}', function ($request, $response, $args) {
    $entryID =  $args['id'];
    $entries = new Kommentar($this->db);

    return $response->withJson($entries->getAllCommentsoneEntry($entryID));
  })->add($auth);



  // Add new comment
  $app->post('/api/comment/{id}', function ($request, $response, $args) {
    $userID = $_SESSION['userID'];
    $entryID =  $args['id'];
    $data = $request->getParsedBody();
    $newComment = new Kommentar($this->db);

    return $response->withJson($newComment->AddNewComment($userID,  $entryID, $data['content']));
  })->add($auth);



  // Update comment
  $app->put('/api/comment/{commentID}', function ($request, $response, $args) {
    $commentID =  $args['commentID'];
    $data = $request->getParsedBody();
    $updateComment = new Kommentar($this->db);

    return $response->withJson($updateComment->updateCommentById($commentID, $data['content']));
  })->add($auth);



  // Delete comment
  $app->delete('/api/comment/{commentID}', function ($request, $response, $args) {
    $commentID =  $args['commentID'];
    $comment = new Kommentar($this->db);

    return $response->withJson($comment->deleteCommentById($commentID));
  })->add($auth);

  // Get ett inlägg och all kommenterar
  $app->get('/api/comment/user/{id}', function ($request, $response, $args) {
    $entryID = (int)$args['id'];
    $comment = new Kommentar($this->db);

    return $response->withJson($comment->getUserCommentAndUsername($entryID));
  })->add($auth);

  // Get ett inlägg och all kommenterar
  $app->get('/api/comments/users/{id}', function ($request, $response, $args) {
    $entryID = (int)$args['id'];
    $comment = new Kommentar($this->db);

    return $response->withJson($comment->getUserCommentsAndUsernames($entryID));
  })->add($auth);
};
