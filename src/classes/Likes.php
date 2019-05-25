<?php 

class Likes extends Mapper {


        public function getAllLikesoneEntry($entryID){
            
            $statement = $this->db->prepare(
                "SELECT 
            entries.entryID,
            entries.title,
            entries.content,
            entries.createdAt,
            
            COUNT(likes.likesID) as likes 
            -- GROUP_CONCAT(user.name separator '|') as liked  
            FROM  entries 
            LEFT JOIN likes  
            ON likes.entryID = entries.entryID  
            -- LEFT JOIN user  
            -- ON likes.userID = user.id  
            GROUP BY entries.entryID ");
            $statement->execute([
                ':entryID' => $entryID 
            ]);
            return $statement->fetchall(PDO::FETCH_ASSOC);
        }



        public function AddLike($userID , $entryID){
        $statement = $this->db->prepare("INSERT INTO likes (userID, entryID)
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