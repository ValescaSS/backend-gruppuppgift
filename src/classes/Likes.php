<?php 

class Likes extends Mapper {


/* public function getAllLikesoneEntry($entryID){
            $statement = $this->db->prepare("SELECT * FROM likes WHERE entryID = :entryID");
            $statement->execute([
                ':entryID' => $entryID 
            ]);
            return $statement->fetchall(PDO::FETCH_ASSOC);
        } */



        public function AddLike($userID , $entryID){
        $statement = $this->db->prepare("INSERT INTO likes (userID, entryID) /* VALUES (:userID , :entryID) */ 
        SELECT $entryID, $entryID FROM likes
        WHERE EXISTS
        (  SELECT entryID FROM entries WHERE entryID = $entryID) AND 
        NOT EXISTS
        (  SELECT likesID FROM likes WHERE userID = $userID  AND entryID = $entryID)  
        LIMIT 1  
        ");
        $statement->execute([
          ":userID" => $userID,
          ":entryID" => $entryID
          ]);
          return "Like send";
    }





}