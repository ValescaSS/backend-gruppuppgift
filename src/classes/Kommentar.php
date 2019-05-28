<?php

class Kommentar extends Mapper
{


  // Get one comment from id
  public function getCommentByID($commentID)
  {
    $statement = $this->db->prepare("SELECT * FROM comments WHERE commentID = :commentID");
    $statement->execute([
      ':commentID' => $commentID
    ]);
    return $statement->fetch(PDO::FETCH_ASSOC);
  }


  // Get all comment form one entry
  public function getAllCommentsoneEntry($entryID)
  {
    $statement = $this->db->prepare("SELECT * FROM comments WHERE entryID = :entryID");
    $statement->execute([
      ':entryID' => $entryID
    ]);
    return $statement->fetchall(PDO::FETCH_ASSOC);
  }
  

  // Get all the comments
  public function getAllComments()
  {
    $statement = $this->db->prepare("SELECT * FROM comments");
    $statement->execute();
    return $statement->fetchall(PDO::FETCH_ASSOC);
  }


  // Add new comment
  public function AddNewComment($userID, $entryID, $content)
  {
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
  public function updateCommentById($commentID, $content)
  {
    $statement = $this->db->prepare("UPDATE comments SET content = :content WHERE commentID = :commentID");
    $statement->execute([
      ":commentID" => $commentID,
      ":content" => $content
    ]);
    return "Comment updated";
  }



  // Delete comment
  public function deleteCommentById($commentID)
  {
    $statement = $this->db->prepare("DELETE FROM comments WHERE commentID = {$commentID}");
    $statement->execute();
    return "Comment deleted";
  }

  public function getUserCommentAndUsername($entryID)
  {
  $statement = $this->db->prepare("SELECT 
  comments.content,
  users.username 
  FROM  comments 
  LEFT JOIN users  
  ON comments.createdBy = users.userID
  WHERE entryID = :entryID  
  
  ");
  $statement->execute([
    ':entryID' => $entryID
  ]);
    return $statement->fetchall(PDO::FETCH_ASSOC);
  }
  // SELECT comments.content, users.username FROM comments WHERE comments.entryID = :entryID JOIN users ON comments.createdBy = users.userID
  


// public function postNewComment($createdBy, $entryID, $content){
//         $statement = $this->db->prepare("INSERT INTO comments (entryID, content, createdBy, createdAt) VALUES (:entryID, :content, :createdBy, :createdAt)");
//         date_default_timezone_set("Europe/Stockholm");
//         $statement->execute([
//           ":entryID" => $entryID,
//           ":content" => $content,
//           ":createdBy" => $createdBy,
//           ":createdAt" => date('Y-m-d H:i:s')
//           ]);
//           return "Comment send";
//     }

//     public function showCommentsEntryID($entryid){
//         $statement = $this->db->prepare("SELECT content FROM comments WHERE entryID = $entryid");
//         $statement->execute();
//         return $statement->fetchall(PDO::FETCH_ASSOC);
//     }
}
