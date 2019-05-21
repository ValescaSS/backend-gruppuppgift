<?php

class User extends Mapper {


  // Get one comment from id
  public function getCommentByID($commentID){
            $statement = $this->db->prepare("SELECT * FROM comments WHERE commentID = :commentID");
            $statement->execute([
                'commentID' => $commentID 
            ]);
            return $statement->fetch(PDO::FETCH_ASSOC);
        }


  // Get all the comments
  public function getAllComments(){
        $statement = $this->db->prepare("SELECT * FROM comments");
        $statement->execute();
        return $statement->fetchall(PDO::FETCH_ASSOC);
    }


  // Add new comment
  public function AddNewComment($entryID, $content){
        $statement = $this->db->prepare("INSERT INTO comments (entryID, content, createdAt , createdBy) VALUES (:entryID, :content, :createdAt, :createdBy)");
        date_default_timezone_set("Europe/Stockholm");
        $statement->execute([
          ":entryID" => $entryID,
          ":content" => $content,
          ":createdAt" => date('Y-m-d H:i:s'),
          ":createdBy" => $userID
          ]);
          return "Post send";
    }


  // Update comment
    public function updateCommentById($entryID, $content){
        $statement = $this->db->prepare("UPDATE comments SET content = :content WHERE userID = :userID");
        date_default_timezone_set("Europe/Stockholm");
        $statement->execute([
          ":content" => $content,
          ]);
          return "Post updated";
    }



  // Delete comment
  public function deleteCommentById($entryID){
        $statement = $this->db->prepare("DELETE FROM comments WHERE entryID = {$entryID}");
        $statement->execute();
        return "Comment deleted";
    }



}