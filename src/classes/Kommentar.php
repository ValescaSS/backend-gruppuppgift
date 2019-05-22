<?php

class Kommentar extends Mapper {


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
  public function AddNewComment($userID,$entryID, $content){
        $statement = $this->db->prepare("INSERT INTO comments (entryID, content, createdBy,createdAt ) VALUES (:entryID, :content, :createdBy , :createdAt)");
        date_default_timezone_set("Europe/Stockholm");
        $statement->execute([
          ":entryID" => $entryID,
          ":content" => $content,
          ":createdBy" => $userID,
          ":createdAt" => date('Y-m-d H:i:s')
          ]);
          return "Comment send";
    }


  // Update comment
    public function updateCommentById($entryID, $content){
        $statement = $this->db->prepare("UPDATE comments SET content = :content WHERE userID = :userID");
        date_default_timezone_set("Europe/Stockholm");
        $statement->execute([
          ":content" => $content,
          ]);
          return "Comment send";
    }



  // Delete comment
  public function deleteCommentById($entryID){
        $statement = $this->db->prepare("DELETE FROM comments WHERE entryID = {$entryID}");
        $statement->execute();
        return "Comment deleted";
    }



}