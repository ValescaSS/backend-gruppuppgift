<?php

// return function ($app) {
//     $auth = require __DIR__ . '/../middlewares/auth.php';

//     // Post route som lägger till kommentarer i databasen 
//     $app->post('/api/comments', function($request, $response){
//         $data = $request->getParsedBody();
//         $newComment = new Comment($this->db);

//         return $response->withJson($newComment-> postNewComment($data['createdBy'], $data['entryID'], $data['content']));     
//     });

//     // Get rout som hämtar alla kommentarer till ett inlägg
//     $app->get('/api/comments/entry/{id}', function($request, $response, $args){
//         $entryID = $args['id'];
//         $comments = new Comment($this->db);

//         return $response->withJson($comments-> showCommentsEntryID($entryID));
//     });
// };