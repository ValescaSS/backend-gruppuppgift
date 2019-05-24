<?php 

class Likes extends Mapper {


public function getAllLikesoneEntry($entryID){
            $statement = $this->db->prepare("SELECT * FROM likes WHERE entryID = :entryID");
            $statement->execute([
                ':entryID' => $entryID 
            ]);
            return $statement->fetchall(PDO::FETCH_ASSOC);
        }


}