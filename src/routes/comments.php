<?php

return function ($app) {
    $auth = require __DIR__ . '/../middlewares/auth.php';

    $app->post('/api/comments', function($request, $response){
        $data = $request->getParsedBody();
        $newComment = new Comment($this->db);

    return $response->withJson($newComment-> postNewComment($data['createdBy'], $data['entryID'], $data['content']));     
    });
};