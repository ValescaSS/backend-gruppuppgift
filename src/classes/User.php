<?php

class User extends Mapper {
  
  // Databas anrop
  public function getUserByID($userID) {
    $statement = $this->db->prepare("SELECT * FROM users WHERE userID = :userID");
    $statement->execute([
      ':userID' => $userID
    ]);
    return $statement->fetch(PDO::FETCH_ASSOC);
  }
  public function getUser($username) {
    $statement = $this->db->prepare("SELECT * FROM users WHERE username = :username");
    $statement->execute([
      ':username' => $username
    ]);
    return $statement->fetch(PDO::FETCH_ASSOC);
  }

  public function getAllUsers(){
    $statement = $this->db->prepare("SELECT userID, username FROM users");
    $statement->execute();
    return $statement->fetchall(PDO::FETCH_ASSOC);
  }

  public function getUserByIdNotShowPassword($userID){
    $statement = $this->db->prepare("SELECT username FROM users WHERE userID = :userID");
    $statement->execute([
      ':userID' => $userID
    ]);
    return $statement->fetch(PDO::FETCH_ASSOC);
  }

  public function registerNewUser($username, $password){
    $statement = $this->db->prepare("INSERT INTO users (username, password) VALUES (:username, :password)");
    $statement->execute([
      ":username" => $username, 
      ":password" => password_hash($password, PASSWORD_BCRYPT)
      ]);
    return "User registred";
  }
  
  public function changeUsername($userID, $new_username){
  $statement = $this->db->prepare("UPDATE users SET username = 'Sandra' WHERE userID = '{$userID}'");
  $statement-> execute();
  return "User updated";
  }

}
