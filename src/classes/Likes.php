<?php 

class Likes extends Mapper {


        public function getAllLikesoneEntry(){
            
            $statement = $this->db->prepare(
                "SELECT 
            entries.entryID,
            entries.title,
            entries.content,
            entries.createdAt,
            users.username,
            COUNT(likes.likesID) as likes 
            -- GROUP_CONCAT(user.name separator '|') as liked  
            FROM  entries 
            LEFT JOIN likes  
            ON likes.entryID = entries.entryID  
            JOIN users
            ON users.userID = entries.createdBy
            -- LEFT JOIN user  
            -- ON likes.userID = user.id  
            GROUP BY entries.entryID ");
            $statement->execute();
            return $statement->fetchall(PDO::FETCH_ASSOC);
        }



        public function AddLike($userID , $entryID){
        $statement = $this->db->prepare("INSERT INTO likes (userID, entryID)
        SELECT $userID, $entryID FROM entries
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