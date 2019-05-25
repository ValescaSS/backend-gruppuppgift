<?php

return function ($app) {
    // Register auth middleware
    $auth = require __DIR__ . '/../middlewares/auth.php';
    // Add a login route
    $app->post('/api/login', function ($request, $response) {
        $data = $request->getParsedBody();
        var_dump($data['username']);
        // In a real example, do database checks here
        if (isset($data['username']) && isset($data['password'])) {

            $userObj = new User($this->db);
            $user = $userObj->getUser($data['username']);

            if ($data['username'] == $user['username']) {

                if (password_verify($data['password'], $user['password'])) {

                    $_SESSION['loggedIn'] = true;
                    $_SESSION['userID'] = $user['userID'];
                    return $response->withJson($data);

                } else {

                    return $response->withStatus("Wrong password");

                }

            } else {

                return $response->withStatus("Wrong username");

            }

        } else {

            return $response->withStatus("You have to write username and password");

        }
    });

    // Add a ping route
    $app->get('/api/ping', function ($request, $response, $args) {
        return $response->withJson(['loggedIn' => true]);
    })->add($auth);
};
